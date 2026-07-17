
'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  TrendingUp, 
  Globe, 
  Sparkles, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Target, 
  Users, 
  Lightbulb,
  Gem,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { BusinessAssistant } from '@/components/BusinessAssistant';
import { useTranslation } from '@/hooks/useTranslation';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const revenueData = [
  { name: 'Week 1', domestic: 45000, export: 12000 },
  { name: 'Week 2', domestic: 52000, export: 21000 },
  { name: 'Week 3', domestic: 48000, export: 35000 },
  { name: 'Week 4', domestic: 61000, export: 42000 },
];

const regionDistribution = [
  { name: 'North America', value: 45 },
  { name: 'Europe', value: 30 },
  { name: 'Domestic (India)', value: 15 },
  { name: 'East Asia', value: 10 },
];

const COLORS = ['#E07A5F', '#F2CC8F', '#81B29A', '#3D405B'];

export default function PremiumDashboardPage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('insights');

  // Artisan check logic
  const artisanDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'artisan_profiles', user.uid) : null),
    [user, firestore]
  );
  const { data: artisanProfile, isLoading: isArtisanLoading } = useDoc(artisanDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  // Localized chart data
  const translatedRevenueData = useMemo(() => revenueData.map(d => ({ ...d, name: t(d.name) })), [t]);
  const translatedRegionDistribution = useMemo(() => regionDistribution.map(d => ({ ...d, name: t(d.name) })), [t]);

  if (isUserLoading || isArtisanLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-accent font-headline text-2xl tracking-[0.2em]">{t('AUTHENTICATING EXECUTIVE HUB...')}</p>
        </div>
      </div>
    );
  }

  // Redirect if user is logged in but not an artisan
  if (user && !artisanProfile && !isArtisanLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
            <Lock className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold font-headline mb-4">{t('Artisan Credentials Required')}</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            {t('The Premium Executive Hub is reserved exclusively for verified master artisans of the Indian heartland.')}
          </p>
          <Button asChild className="rounded-full px-8 py-6">
            <a href="/artisans/apply">{t('Apply for Master Status')}</a>
          </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white selection:bg-accent selection:text-accent-foreground pb-24 font-body">
      {/* Premium Header */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1590001158193-790179980530?q=80&w=2070')] bg-cover bg-fixed grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-accent font-black uppercase tracking-[0.4em] text-[10px]"
              >
                <Crown className="h-4 w-4 fill-accent" />
                {t('Premium Executive Suite')}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold font-headline leading-tight"
              >
                {t('Master Intelligence')}
              </motion.h1>
              <p className="text-xl text-white/60 font-light italic max-w-2xl font-headline">
                {t('Elite heritage analytics and AI-powered scaling for the subcontinents finest makers.')}
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center min-w-[160px] shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">{t('Heritage Score')}</p>
                  <p className="text-5xl font-bold font-headline text-accent">98.4</p>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-green-500 mt-3 font-black">
                    <TrendingUp className="h-3 w-3" /> +1.2% {t('GROWTH')}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Left Column: AI Strategy Chat */}
          <div className="lg:col-span-1 space-y-8">
             <Card className="bg-[#151515] border-white/10 border-2 rounded-[2.5rem] overflow-hidden sticky top-24 shadow-2xl">
                <CardHeader className="bg-accent/5 border-b border-white/5">
                    <div className="flex items-center gap-2 text-accent mb-2">
                        <Zap className="h-4 w-4 fill-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('Live Consultant')}</span>
                    </div>
                    <CardTitle className="text-2xl font-headline">{t('AI Strategist')}</CardTitle>
                </CardHeader>
                <div className="h-[500px]">
                   <BusinessAssistant />
                </div>
             </Card>

             <Card className="bg-accent text-accent-foreground rounded-[2.5rem] border-0 shadow-2xl shadow-accent/5 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="h-32 w-32 rotate-12" />
                </div>
                <CardHeader>
                    <CardTitle className="text-xl font-headline">{t('Premium Goals')}</CardTitle>
                    <CardDescription className="text-accent-foreground/60">{t('Your path to Global Master status.')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                            <span>{t('Export Readiness')}</span>
                            <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2 bg-accent-foreground/20" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                            <span>{t('GI Branding Depth')}</span>
                            <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-accent-foreground/20" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="link" className="text-accent-foreground font-black p-0 h-auto text-xs uppercase tracking-widest group">
                        {t('Expand Benchmarks')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </CardFooter>
             </Card>
          </div>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Top Stats Bar */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { label: 'Global Reach', value: t('42 Countries'), icon: <Globe />, trend: t('+5 THIS MONTH') },
                    { label: 'Avg Order Value', value: '₹14,500', icon: <Gem />, trend: t('+₹2,100 VS INDUSTRY') },
                    { label: 'Master Authenticity', value: '100%', icon: <ShieldCheck />, trend: t('GI-REGISTRY VERIFIED') },
                ].map((stat, i) => (
                    <motion.div key={i} whileHover={{ y: -5 }}>
                        <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8 backdrop-blur-md hover:bg-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-accent/20 rounded-2xl text-accent">
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.trend}</span>
                            </div>
                            <h3 className="text-4xl font-bold font-headline mb-1">{stat.value}</h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40">{t(stat.label)}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* AI Insights & Analytics Tabs */}
            <div className="space-y-8">
                <div className="flex border-b border-white/10 gap-8">
                    {['insights', 'market', 'trade', 'sentiments'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-6 px-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative",
                                activeTab === tab ? "text-accent" : "text-white/40 hover:text-white"
                            )}
                        >
                            {t(tab)}
                            {activeTab === tab && <motion.div layoutId="premium-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'insights' && (
                        <motion.div 
                            key="insights" 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <Card className="bg-white/5 border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-8">
                                    <Sparkles className="h-24 w-24 text-accent/10 rotate-12" />
                                </div>
                                <h3 className="text-4xl font-bold font-headline mb-8">{t('Executive AI Report')}</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 font-headline">{t('Market Entry Recommendation')}</h4>
                                            <p className="text-white/60 leading-relaxed text-sm font-light">
                                                {t('Data indicates a 40% surge in North American demand for terracotta-based sustainable home decor. We recommend prioritizing your "Classic Vase" series for the NYC Summer Collection.')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <Lightbulb className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 font-headline">{t('Product Optimization Suggestion')}</h4>
                                            <p className="text-white/60 leading-relaxed text-sm font-light">
                                                {t('Your GI-tag conversion rate is high, but image depth scores are below average. AI suggests 3D macro photography for your embroidery pieces to justify the premium price points.')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-8">
                                <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">{t('Sentiment Engine Analysis')}</h4>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold font-headline">{t('Authenticity Confidence')}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-white/40">{t('Based on collector queries')}</p>
                                            </div>
                                            <p className="text-3xl font-headline font-bold text-green-400">96%</p>
                                        </div>
                                        <Progress value={96} className="h-1.5 bg-white/5" />
                                        
                                        <div className="flex justify-between items-end pt-4">
                                            <div className="space-y-1">
                                                <p className="text-lg font-bold font-headline">{t('Heritage Connection')}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-white/40">{t('Impact of artisan narrative')}</p>
                                            </div>
                                            <p className="text-3xl font-headline font-bold text-accent">89%</p>
                                        </div>
                                        <Progress value={89} className="h-1.5 bg-white/5" />
                                    </div>
                                </Card>
                                
                                <Card className="bg-accent/5 border-accent/20 rounded-[2rem] p-8">
                                    <div className="flex items-center gap-3 text-accent mb-4">
                                        <Users className="h-5 w-5" />
                                        <h4 className="font-bold text-lg font-headline">{t('Top Emerging Demographic')}</h4>
                                    </div>
                                    <p className="text-2xl font-bold font-headline mb-1">{t('Scandinavian Heritage Collectors')}</p>
                                    <p className="text-xs text-white/60 leading-relaxed font-light">{t('Recent queries focus on "minimalist traditionalism" and natural pigments.')}</p>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'trade' && (
                        <motion.div 
                            key="trade" 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8">
                                    <CardHeader className="p-0 mb-8">
                                        <CardTitle className="text-2xl font-headline">{t('Revenue Flow: Domestic vs Export')}</CardTitle>
                                        <CardDescription className="text-[10px] uppercase tracking-widest text-white/40">{t('Weekly performance analysis of global sales channels.')}</CardDescription>
                                    </CardHeader>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={translatedRevenueData}>
                                                <defs>
                                                    <linearGradient id="colorDomestic" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#E07A5F" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#F2CC8F" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#F2CC8F" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} unit="₹" />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Area type="monotone" dataKey="domestic" stroke="#E07A5F" fillOpacity={1} fill="url(#colorDomestic)" strokeWidth={4} />
                                                <Area type="monotone" dataKey="export" stroke="#F2CC8F" fillOpacity={1} fill="url(#colorExport)" strokeWidth={4} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="bg-white/5 border-white/10 rounded-[2rem] p-8">
                                    <CardHeader className="p-0 mb-8">
                                        <CardTitle className="text-2xl font-headline">{t('Regional Demand Distribution')}</CardTitle>
                                        <CardDescription className="text-[10px] uppercase tracking-widest text-white/40">{t('Volume analysis of international heritage clusters.')}</CardDescription>
                                    </CardHeader>
                                    <div className="h-[300px] flex items-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={translatedRegionDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={8}
                                                    dataKey="value"
                                                >
                                                    {translatedRegionDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                     contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="space-y-4 pl-8">
                                            {translatedRegionDistribution.map((entry, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{t(entry.name)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'market' && (
                        <motion.div 
                            key="market" 
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 border-t-accent/20 border-t-2">
                                <Badge className="mb-4 bg-accent/20 text-accent border-0 uppercase tracking-widest text-[8px] font-black">{t('AI Trend: High')}</Badge>
                                <h4 className="text-xl font-bold font-headline mb-2">{t('Minimalist Pottery')}</h4>
                                <p className="text-xs text-white/40 mb-6 font-light leading-relaxed">{t('Predicted 25% growth in Scandinavian and Japanese markets next quarter.')}</p>
                                <div className="flex items-center gap-2 text-green-400 font-black uppercase text-[10px] tracking-widest">
                                    <TrendingUp className="h-3.5 w-3.5" /> +12% {t('Confidence')}
                                </div>
                            </Card>
                            <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 border-t-blue-500/20 border-t-2">
                                <Badge className="mb-4 bg-blue-500/20 text-blue-400 border-0 uppercase tracking-widest text-[8px] font-black">{t('AI Trend: Stable')}</Badge>
                                <h4 className="text-xl font-bold font-headline mb-2">{t('Traditional Textiles')}</h4>
                                <p className="text-xs text-white/40 mb-6 font-light leading-relaxed">{t('Steady growth in luxury segment. Focus on natural-dye variants for European collectors.')}</p>
                                <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-widest">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> {t('High Data Precision')}
                                </div>
                            </Card>
                            <Card className="bg-white/5 border-white/10 rounded-[2.5rem] p-8 border-t-orange-500/20 border-t-2">
                                <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-0 uppercase tracking-widest text-[8px] font-black">{t('AI Trend: Emerging')}</Badge>
                                <h4 className="text-xl font-bold font-headline mb-2">{t('Custom Metal Icons')}</h4>
                                <p className="text-xs text-white/40 mb-6 font-light leading-relaxed">{t('New interest from interior designers in Dubai and Singapore for custom spiritual art.')}</p>
                                <div className="flex items-center gap-2 text-orange-400 font-black uppercase text-[10px] tracking-widest">
                                    <AlertCircle className="h-3.5 w-3.5" /> {t('New Opportunities')}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Action Center */}
            <div className="p-12 bg-accent rounded-[3.5rem] text-accent-foreground flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-[0_0_80px_rgba(242,204,143,0.15)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="relative z-10 space-y-2">
                    <h2 className="text-4xl font-bold font-headline leading-none">{t('Scale Your Heritage Legacy')}</h2>
                    <p className="text-accent-foreground/70 text-lg max-w-xl font-headline italic">{t('Unlock international warehousing and AI-managed logistics for the global winter season.')}</p>
                </div>
                <Button className="relative z-10 bg-accent-foreground text-accent hover:bg-accent-foreground/90 py-8 px-12 text-xl font-black uppercase tracking-widest rounded-[2rem] shadow-2xl transition-all hover:scale-105">
                    {t('Upgrade to Global Hub')} <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
