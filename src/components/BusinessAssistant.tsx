'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Loader2, TrendingUp, X, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { chatWithStrategist } from '@/ai/flows/business-assistant-flow';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

export function BusinessAssistant() {
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
      const response = await chatWithStrategist({
        userMessage: userMsg,
        history: messages,
      });
      setMessages([...newMessages, { role: 'model', text: response.response }]);
    } catch (error) {
      console.error('Strategist Chat Error:', error);
      setMessages([...newMessages, { role: 'model', text: t('Strategic systems are currently optimizing. Please consult the scrolls again in a moment.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <Card className="border-primary/20 shadow-2xl rounded-[2rem] overflow-hidden bg-gradient-to-br from-card to-primary/5 border-2">
        <CardHeader className="bg-primary/5 pb-8">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-2">
                        <TrendingUp className="h-3 w-3" /> {t('Executive Intelligence')}
                    </div>
                    <CardTitle className="text-3xl font-headline font-bold">{t('Premium Strategy AI')}</CardTitle>
                    <CardDescription className="text-base italic">
                        {t('Consult with your dedicated Global Craft Strategist to scale your heritage legacy.')}
                    </CardDescription>
                </div>
                {!isOpen && (
                     <Button 
                        onClick={() => setIsOpen(true)}
                        className="rounded-full bg-primary hover:bg-primary/90 px-8 py-6 font-bold shadow-lg"
                    >
                        <Bot className="mr-2 h-5 w-5" /> {t('Open Strategist')}
                    </Button>
                )}
            </div>
        </CardHeader>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="h-[450px] flex flex-col bg-background/50 backdrop-blur-sm border-y border-primary/10">
                    <div className="flex-grow p-6">
                        <ScrollArea className="h-full pr-4" ref={scrollRef}>
                            <div className="space-y-6">
                                {messages.length === 0 && (
                                    <div className="text-center py-12 space-y-6">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner rotate-3">
                                            <Briefcase className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground italic max-w-xs mx-auto">
                                                {t('Greetings, Master Artisan. I am here to analyze your growth potential. How shall we expand your legacy today?')}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setInput(t('How do I price for exports?'))} className="rounded-full border-primary/20 text-xs">
                                                {t('Pricing for Exports')}
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setInput(t('Optimize my GI tag branding?'))} className="rounded-full border-primary/20 text-xs">
                                                {t('GI Branding Strategy')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {messages.map((msg, i) => (
                                    <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                        <Avatar className="h-8 w-8 border shadow-sm flex-shrink-0">
                                            <AvatarFallback className={msg.role === 'user' ? "bg-primary text-primary-foreground font-black" : "bg-accent text-accent-foreground"}>
                                                {msg.role === 'user' ? 'M' : <Bot className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm",
                                            msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card border border-primary/5 rounded-tl-none"
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
                                        <div className="bg-card border border-primary/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('Analyzing Market Data...')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="p-6 border-t bg-muted/20">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-3"
                        >
                            <Input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('Ask about margins, seasonal trends, or global standards...')}
                                className="rounded-xl border-primary/10 focus:border-primary py-7 bg-background text-base shadow-inner"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" className="h-14 w-14 rounded-xl shadow-xl flex-shrink-0" disabled={isLoading}>
                                <Send className="h-6 w-6" />
                            </Button>
                        </form>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="bg-primary/5 flex justify-between py-4">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-black text-muted-foreground flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-primary" /> {t('Executive Decision Support Active')}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-[10px] font-black uppercase tracking-widest hover:text-destructive">
                    <X className="mr-1 h-3 w-3" /> {t('Close Strategist')}
                  </Button>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
