'use client';

import { useState, useRef, useEffect, type FormEvent, useMemo, Suspense } from 'react';
import { Send, Languages, Loader2, User, Bot, CornerDownLeft, BadgeCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { translateMessage, type AutomaticTranslationInput } from '@/ai/flows/automatic-translation';
import { chatWithArtisan } from '@/ai/flows/artisan-chat-flow';
import { type ArtisanChatInput } from '@/ai/flows/artisan-chat-types';
import { useTranslation } from '@/hooks/useTranslation';
import { artisans as mockArtisans, Artisan, Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

type Message = {
  id: string;
  author: 'user' | 'artisan';
  text: string;
  translatedText?: string;
  isTranslating?: boolean;
};

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [isAiReplying, setIsAiReplying] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { firestore, user } = useFirebase();

  const artisanIdFromUrl = searchParams.get('artisanId');

  // Fetch live artisans
  const artisansRef = useMemoFirebase(
    () => collection(firestore, 'artisan_profiles'),
    [firestore]
  );
  const { data: liveArtisans, isLoading: isLoadingArtisans } = useCollection<Artisan>(artisansRef);

  const allArtisans = useMemo(() => {
    const artisanMap = new Map<string, Artisan>();
    mockArtisans.forEach(a => artisanMap.set(a.id, a));
    liveArtisans?.forEach(a => artisanMap.set(a.id, a));
    return Array.from(artisanMap.values());
  }, [liveArtisans]);

  const artisanImage = PlaceHolderImages.find((img) => img.id === selectedArtisan?.imageId);

  useEffect(() => {
    if (artisanIdFromUrl && allArtisans.length > 0 && !selectedArtisan) {
      const artisan = allArtisans.find(a => a.id === artisanIdFromUrl || a.slug === artisanIdFromUrl);
      if (artisan) {
        handleArtisanSelect(artisan.id);
      }
    }
  }, [artisanIdFromUrl, allArtisans, selectedArtisan]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleArtisanSelect = (artisanId: string) => {
    const artisan = allArtisans.find(a => a.id === artisanId);
    if (artisan) {
        setSelectedArtisan(artisan);
        setMessages([
            {
                id: `initial-${Date.now()}`,
                author: 'artisan',
                text: t('Hello! I am {artisanName}. How can I help you with my {artisanCraft}?').replace('{artisanName}', t(artisan.name)).replace('{artisanCraft}', t(artisan.craft)),
            }
        ]);
    }
  }

  const handleTranslate = async (messageId: string) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    const messageToTranslate = messages[messageIndex];

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTranslating: true } : msg
      )
    );

    try {
      const translationInput: AutomaticTranslationInput = {
        text: messageToTranslate.text,
        sourceLanguage: messageToTranslate.author === 'user' ? 'English' : 'AI',
        targetLanguage: 'English',
      };
      
      const result = await translateMessage(translationInput);
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translatedText: result.translatedText, isTranslating: false }
            : msg
        )
      );

    } catch (error) {
      console.error('Translation failed:', error);
       setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isTranslating: false, translatedText: t('Translation failed.') } : msg
        )
      );
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedArtisan || isAiReplying) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      author: 'user',
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsAiReplying(true);

    try {
        const aiInput: ArtisanChatInput = {
            userMessage: input,
            artisan: {
                id: selectedArtisan.id,
                name: t(selectedArtisan.name),
                craft: t(selectedArtisan.craft),
                region: t(selectedArtisan.region),
                story: t(selectedArtisan.story),
            },
            products: (selectedArtisan.products || []).map(p => ({
                id: p.id,
                name: t(p.name),
                price: p.price,
                description: t(p.description),
                craft: t(p.craft)
            })),
        };

        const result = await chatWithArtisan(aiInput);

        const aiMessage: Message = {
            id: `artisan-${Date.now()}`,
            author: 'artisan',
            text: result.response,
        };
        setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
        console.error("AI chat failed:", error);
        const errorMessage: Message = {
            id: `error-${Date.now()}`,
            author: 'artisan',
            text: t("I'm sorry, I'm having trouble responding right now. Please try again in a moment."),
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsAiReplying(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
         <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
            <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back to Market')}
            </Link>
         </Button>
         <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary/60 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
            <Bot className="h-3.5 w-3.5" />
            {t('AI-Powered Heritage Bridge')}
         </div>
      </div>

      <div className="border rounded-3xl bg-card h-[75vh] flex flex-col shadow-2xl overflow-hidden relative">
        <div className="p-6 border-b bg-background/50 backdrop-blur-sm flex justify-between items-center">
            {selectedArtisan ? (
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                         {artisanImage ? <AvatarImage src={artisanImage.imageUrl} /> : <AvatarFallback>{t(selectedArtisan.name).charAt(0)}</AvatarFallback>}
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-bold font-headline flex items-center gap-2">
                        {t('Chat with {name}').replace('{name}', t(selectedArtisan.name))}
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t(selectedArtisan.craft)} • {t(selectedArtisan.region)}</p>
                    </div>
                </div>
            ) : (
                <h1 className="text-xl font-bold font-headline">{t('Connect with a Verified Artisan')}</h1>
            )}
            {selectedArtisan && (
                 <Button variant="outline" size="sm" onClick={() => setSelectedArtisan(null)} className="rounded-full text-[10px] font-black uppercase tracking-widest border-primary/10">
                    {t('Switch Artisan')}
                 </Button>
            )}
        </div>

        {!selectedArtisan ? (
            <div 
              className="flex-grow p-4 flex flex-col items-center justify-center gap-4 text-center relative"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23E07A5F33' stroke-width='4' stroke-dasharray='12%2c 12' stroke-dashoffset='32' stroke-linecap='square'/%3e%3c/svg%3e")`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
              <div className="z-10 px-8">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner rotate-3">
                    <Bot className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold font-headline mb-4">{t('Direct Heritage Bridge')}</h2>
                <p className='text-muted-foreground max-w-md mx-auto text-lg font-light leading-relaxed mb-8'>
                    {t('Communicate instantly with master artisans. Our AI removes language barriers so you can discuss materials, legacies, and custom heritage variations.')}
                </p>
                 <Select onValueChange={handleArtisanSelect}>
                    <SelectTrigger className="w-full max-w-sm mx-auto text-lg py-7 rounded-2xl border-primary/20 shadow-xl bg-background">
                        <SelectValue placeholder={t('Select a Verified Artisan...')} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                        {allArtisans.map(artisan => (
                            <SelectItem key={artisan.id} value={artisan.id} className="py-3">
                              <div className="flex items-center gap-3">
                                <BadgeCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                                <div className="text-left">
                                  <div className="font-bold text-base">{t(artisan.name)}</div>
                                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t(artisan.craft)} • {t(artisan.region)}</div>
                                </div>
                              </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Languages className="h-3 w-3" />
                    {t('Real-time Hindi, Tamil, Bengali & more')}
                </div>
              </div>
            </div>
        ) : (
            <>
                <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                <div className="space-y-8 pb-4">
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                        'flex items-end gap-3',
                        message.author === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.author === 'artisan' && (
                        <Avatar className="h-10 w-10 border shadow-sm">
                            {artisanImage ? <AvatarImage src={artisanImage.imageUrl} alt={t(selectedArtisan.name)} /> : <AvatarFallback><Bot className='w-5 h-5 text-muted-foreground' /></AvatarFallback>}
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'max-w-xs md:max-w-md rounded-2xl px-5 py-4 relative group shadow-sm',
                            message.author === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-background border border-primary/5 text-foreground rounded-bl-none'
                        )}
                        >
                        <p className="text-base leading-relaxed">{message.text}</p>
                        {message.translatedText && (
                            <div className="mt-3 pt-3 border-t border-current/10 italic text-sm opacity-80 flex items-start gap-2">
                                <Languages className="h-3 w-3 mt-1 flex-shrink-0" />
                                <p>{message.translatedText}</p>
                            </div>
                        )}
                        {message.author === 'artisan' && !message.translatedText && (
                            <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -bottom-2 -right-2 h-8 w-8 bg-background border rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-primary/10"
                            onClick={() => handleTranslate(message.id)}
                            disabled={message.isTranslating}
                            title={t('Translate to English')}
                            >
                            {message.isTranslating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Languages className="h-4 w-4 text-primary" />
                            )}
                            </Button>
                        )}
                        </div>
                        {message.author === 'user' && (
                        <Avatar className="h-10 w-10 shadow-sm">
                            <AvatarFallback className='bg-primary text-primary-foreground font-black'>
                                {user?.displayName?.charAt(0) || <User className='w-5 h-5' />}
                            </AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isAiReplying && (
                         <div className="flex items-end gap-3 justify-start">
                            <Avatar className="h-10 w-10 border animate-pulse">
                                 <AvatarFallback><Bot className='w-5 h-5 text-muted-foreground' /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs rounded-2xl px-5 py-4 bg-background border border-primary/5 rounded-bl-none flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground italic">{t('Artisan is typing...')}</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                </ScrollArea>

                <div className="p-6 border-t bg-background/50 backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('Ask about materials, the legacy, or request a variation...')}
                        autoComplete="off"
                        suppressHydrationWarning
                        disabled={isAiReplying}
                        className="py-7 px-6 rounded-2xl border-primary/10 focus:border-primary transition-all bg-background text-lg"
                        />
                        <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex-shrink-0" suppressHydrationWarning disabled={isAiReplying}>
                            {isAiReplying ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                            <span className="sr-only">{t('Send')}</span>
                        </Button>
                    </form>
                    <div className="flex justify-between items-center mt-4 px-2">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1">
                            {t('Press')} <CornerDownLeft className="h-3 w-3" /> {t('to initiate heritage bridge')}
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                {t('Encrypted Connection')}
                            </span>
                        </div>
                    </div>
                </div>
           </>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div className="container mx-auto py-32 text-center animate-pulse">{t('Loading Heritage Hub...')}</div>}>
      <ChatContent />
    </Suspense>
  );
}
