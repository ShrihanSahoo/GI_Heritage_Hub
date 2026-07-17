'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Info, Sparkles, Loader2, Languages, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chatWithArtisan } from '@/ai/flows/artisan-chat-flow';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

export function FloatingHeritageBridge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await chatWithArtisan({
        userMessage: userMsg,
        artisan: {
          id: 'floating-master',
          name: t('Master Maker'),
          craft: t('Heritage Arts'),
          region: t('Indian Heartland'),
          story: t('I represent the collective soul of India\'s rural artisan clusters.'),
        },
        products: [], // General heritage chat context
      });
      setMessages([...newMessages, { role: 'model', text: response.response }]);
    } catch (error) {
      console.error('Heritage Bridge Error:', error);
      setMessages([...newMessages, { role: 'model', text: t('The heritage bridge is currently being strengthened. Please try to connect with the master again in a moment.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-card border-2 border-accent/20 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-accent text-accent-foreground flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold font-headline text-lg leading-tight">{t('Master Maker')}</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-70 font-black">{t('Heritage Chat Bridge')}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/10">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-grow p-6 bg-muted/10" ref={scrollRef}>
              <div className="space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner rotate-3">
                        <Bot className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground italic px-4 leading-relaxed">
                      {t('Pranam. I am a master of the Indian heartland. Ask me about our ancient techniques, our materials, or how we preserve our cultural soul.')}
                    </p>
                    <div className="grid grid-cols-1 gap-2 px-4">
                      <Button variant="outline" size="sm" onClick={() => setInput(t('Tell me about natural pigments?'))} className="text-xs rounded-full border-accent/20 hover:bg-accent/5">
                        {t('Natural Pigments')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInput(t('How do you learn your craft?'))} className="text-xs rounded-full border-accent/20 hover:bg-accent/5">
                        {t('Artisan Lineage')}
                      </Button>
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    <Avatar className="h-8 w-8 border shadow-sm flex-shrink-0">
                      <AvatarFallback className={msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                        {msg.role === 'user' ? 'U' : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed max-w-[80%]",
                      msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-background border border-accent/5 rounded-tl-none shadow-sm"
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 border animate-pulse">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-background border border-accent/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                       <Loader2 className="h-4 w-4 animate-spin text-accent-foreground" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Artisan is typing...')}</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-background/50 backdrop-blur-md">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('Speak with the master...')}
                  className="rounded-xl border-accent/10 focus:border-accent py-5"
                />
                <Button type="submit" size="icon" className="h-11 w-11 rounded-xl shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Languages className="h-3 w-3 text-muted-foreground" />
                <span className="text-[8px] uppercase tracking-[0.2em] font-black text-muted-foreground/60">{t('Real-time AI Heritage Translation')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110",
          isOpen ? "bg-card text-foreground border-2 border-accent/20" : "bg-accent text-accent-foreground"
        )}
      >
        {isOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
      </Button>
    </div>
  );
}
