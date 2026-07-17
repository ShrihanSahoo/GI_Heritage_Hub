'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  TrendingDown, 
  Languages, 
  Quote, 
  BarChart3, 
  Users, 
  IndianRupee, 
  Map,
  Scale,
  Library,
  BookOpenCheck,
  CheckCircle2,
  Building2,
  Gem,
  Award,
  History,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const authenticitySources = [
  {
    title: "GI Registry (IP India)",
    description: "The legal foundation. Every product is cross-referenced with the Government of India's Geographical Indications Registry.",
    color: "from-orange-500/20 to-orange-600/20",
    icon: <Scale className="h-8 w-8 text-orange-600" />,
    tag: "Legal Verification"
  },
  {
    title: "UNESCO ICH",
    description: "Aligning with the Intangible Cultural Heritage standards to ensure the 'Human Soul' of the craft is preserved.",
    color: "from-blue-500/20 to-blue-600/20",
    icon: <Library className="h-8 w-8 text-blue-600" />,
    tag: "Cultural Standard"
  },
  {
    title: "WIPO Global Data",
    description: "Utilizing international IP standards from the World Intellectual Property Organization for global trade protection.",
    color: "from-purple-500/20 to-purple-600/20",
    icon: <Globe className="h-8 w-8 text-purple-600" />,
    tag: "International Hub"
  },
  {
    title: "Ministry of Textiles",
    description: "Direct data streams from handicraft census and development programs to identify authentic master artisans.",
    color: "from-emerald-500/20 to-emerald-600/20",
    icon: <Building2 className="h-8 w-8 text-emerald-600" />,
    tag: "Direct Census"
  },
  {
    title: "Craft Council Registry",
    description: "Verified documentation of traditional making techniques, materials, and regional historical narratives.",
    color: "from-rose-500/20 to-rose-600/20",
    icon: <BookOpenCheck className="h-8 w-8 text-rose-600" />,
    tag: "Technique Audit"
  },
  {
    title: "TRIFED / NABARD",
    description: "Collaborating with tribal and rural development bodies to ensure fair-trade pricing and direct income flow.",
    color: "from-amber-500/20 to-amber-600/20",
    icon: <Gem className="h-8 w-8 text-amber-600" />,
    tag: "Economic Ethics"
  }
];

export function LandingVisionPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-48 overflow-hidden flex items-center justify-center min-h-[90vh]">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1637166404565-bf4ff5415a6f?q=80&w=2070')] bg-cover bg-center opacity-50" 
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
        
        <div className="container relative mx-auto px-4 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground mb-8 backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">{t('The Heritage Renaissance')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold font-headline mb-8 tracking-tighter max-w-6xl mx-auto text-foreground leading-[0.9] drop-shadow-sm"
          >
            {t('Restore the Soul of India')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-3xl text-foreground/80 max-w-3xl mx-auto mb-16 leading-relaxed font-light italic"
          >
            {t('A digital bridge between the rural master and the global collector, dedicated to the absolute protection of Geographical Indication (GI) legacy.')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Button asChild size="lg" className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/40 transition-all hover:scale-105 rounded-full">
              <Link href="/signup">
                {t('Enter the Hub')} <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-xl px-12 py-8 border-primary/40 bg-white/5 hover:bg-white/10 text-primary backdrop-blur-md rounded-full">
              <Link href="/login">{t('Login to Shop')}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-12 bg-primary relative -mt-12 z-20 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatBlock 
              icon={<Map className="h-6 w-6" />}
              value="400+"
              label={t('Verified GI Tags')}
            />
            <StatBlock 
              icon={<Users className="h-6 w-6" />}
              value="1M+"
              label={t('Protected Artisans')}
            />
            <StatBlock 
              icon={<IndianRupee className="h-6 w-6" />}
              value="3X"
              label={t('Artisan Income Growth')}
            />
            <StatBlock 
              icon={<Globe className="h-6 w-6" />}
              value="150+"
              label={t('Export Nations')}
            />
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-32 border-b relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold font-headline mb-8 tracking-tight">{t('The Authenticity Crisis')}</h2>
            <div className="w-24 h-2 bg-primary mx-auto mb-8" />
            <p className="text-2xl text-muted-foreground font-light leading-relaxed">
              {t('Centuries of Indian heritage are facing an existential threat. Our technology addresses the three systemic pillars of exploitation.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto">
            <CrisisCard 
              icon={<TrendingDown className="h-16 w-16 text-primary mb-6" />}
              title={t('Middleman Exploitation')}
              stat="85%"
              statLabel={t('Value lost to layers')}
              description={t('Traditional artisans often receive less than 15% of the final sale price. We remove the layers, ensuring 100% of your support reaches the maker.')}
            />
            <CrisisCard 
              icon={<BarChart3 className="h-16 w-16 text-primary mb-6" />}
              title={t('Counterfeit Dominance')}
              stat="₹3,500Cr"
              statLabel={t('Annual fake-craft market')}
              description={t('Cheap machine-made imitations devalue genuine skill. We strictly enforce GI verification, making authenticity our non-negotiable standard.')}
            />
            <CrisisCard 
              icon={<Languages className="h-16 w-16 text-primary mb-6" />}
              title={t('Digital Isolation')}
              stat="92%"
              statLabel={t('Artisans lack direct access')}
              description={t('The greatest masters of craft are often the most digitally isolated. Our AI translation hub removes the barrier between rural heartlands and global collectors.')}
            />
          </div>
        </div>
      </section>

      {/* Customer Benefits Section */}
      <section className="py-32 bg-primary/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent/20 text-accent-foreground font-bold text-xs tracking-widest uppercase mb-6"
            >
              <Sparkles className="h-4 w-4" />
              {t('The Collector\'s Experience')}
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-bold font-headline mb-8 tracking-tight">{t('Why Buy Authenticity?')}</h2>
            <p className="text-2xl text-muted-foreground font-light leading-relaxed">
              {t('When you choose a GI-verified item, you aren\'t just purchasing a product—you are acquiring a certified piece of history.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <BenefitCard 
              icon={<History className="h-12 w-12 text-amber-600" />}
              title={t('Verified Lineage')}
              color="bg-amber-500/10 border-amber-200/50"
              description={t('Every product comes with a unique digital passport. Scan to view its government verification, the master artisan who made it, and the regional traditions it carries.')}
            />
            <BenefitCard 
              icon={<HeartHandshake className="h-12 w-12 text-emerald-600" />}
              title={t('Direct Impact')}
              color="bg-emerald-500/10 border-emerald-200/50"
              description={t('By removing middlemen, your investment goes directly to rural masters. Help preserve families of artisans and the centuries-old skills they safeguard.')}
            />
            <BenefitCard 
              icon={<Award className="h-12 w-12 text-blue-600" />}
              title={t('Elite Craftsmanship')}
              color="bg-blue-500/10 border-blue-200/50"
              description={t('Access items that never reach urban malls. We source directly from GI-protected clusters, offering pieces of unparalleled quality and rare beauty.')}
            />
          </div>
        </div>
      </section>

      {/* Authenticity Sources: The "Source of Truth" Section */}
      <section className="py-32 bg-muted/20 border-b">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <div className="space-y-10 mb-24">
            <h2 className="text-5xl md:text-7xl font-bold font-headline leading-tight tracking-tight">
              {t('The Source of Truth')}
            </h2>
            <p className="text-2xl text-muted-foreground leading-relaxed font-light max-w-4xl mx-auto">
              {t('Authenticity isn\'t a claim—it\'s a verified lineage. Every detail on our platform is cross-referenced with the world\'s most authoritative heritage and trade bodies.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authenticitySources.map((source, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-3xl p-8 border bg-gradient-to-br ${source.color} border-white/20 shadow-xl flex flex-col text-left group`}
              >
                <div className="mb-6 bg-white/50 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-white transition-colors">
                  {source.icon}
                </div>
                <div className="inline-flex items-center gap-1.5 mb-4 text-[10px] font-black tracking-widest uppercase py-1 px-3 bg-white/40 rounded-full border border-white/30 text-foreground/80 w-fit">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  {source.tag}
                </div>
                <h3 className="text-2xl font-bold font-headline mb-3 text-foreground">{source.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {source.description}
                </p>
                <div className="absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity">
                  {source.icon}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-primary rounded-3xl text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-primary/20">
            <div className="text-left">
              <h4 className="text-2xl font-bold font-headline mb-1">{t('Dynamic Verification Engine')}</h4>
              <p className="opacity-80 text-lg">{t('Live-tracking the heritage of every product through automated registry API calls.')}</p>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-primary bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold">
                  {i}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-primary bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shadow-lg">
                +12
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UN / WIPO Context Section */}
      <section className="py-32 border-b bg-primary/5">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-12"
          >
            <img 
              src="https://picsum.photos/seed/heritage-standard/400/120" 
              alt="International Heritage Standard" 
              className="h-20 opacity-60 grayscale brightness-125"
              data-ai-hint="heritage logo"
            />
          </motion.div>
          <Quote className="h-16 w-16 text-primary/30 mx-auto mb-8" />
          <blockquote className="text-3xl md:text-5xl font-headline font-medium italic text-muted-foreground leading-[1.2] mb-12 tracking-tight">
            "{t('A Geographical Indication (GI) is a sign used on products that have a specific geographical origin and possess qualities or a reputation that are due to that origin. They are vital tools for preserving traditional knowledge and supporting sustainable development.')}"
          </blockquote>
          <p className="text-lg font-bold uppercase tracking-[0.3em] text-primary/80">— {t('World Intellectual Property Organization (WIPO)')}</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
        <div className="container relative mx-auto px-4 z-10">
          <h2 className="text-5xl md:text-8xl font-bold font-headline mb-12 tracking-tighter leading-none">
            {t('Join the Heritage Revolution')}
          </h2>
          <p className="text-2xl md:text-3xl opacity-80 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
            {t('Login or create an account to start your journey through the verified, untranslated heart of India.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Button asChild size="lg" variant="secondary" className="text-2xl px-16 py-10 shadow-2xl hover:scale-105 transition-transform rounded-full">
              <Link href="/signup">{t('Create Account')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-2xl px-16 py-10 border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full">
              <Link href="/login">{t('Existing Member Login')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBlock({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="text-primary-foreground group">
      <div className="flex justify-center mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold font-headline mb-1 tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-widest opacity-80 font-semibold">{label}</div>
    </div>
  );
}

function CrisisCard({ icon, title, description, stat, statLabel }: { icon: React.ReactNode, title: string, description: string, stat: string, statLabel: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="flex flex-col h-full bg-card border border-primary/10 rounded-3xl p-10 shadow-lg text-center"
    >
      <div className="mb-8 flex justify-center">{icon}</div>
      <h3 className="text-3xl font-bold font-headline mb-4 tracking-tight leading-tight">{title}</h3>
      <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="text-3xl font-bold text-primary font-headline">{stat}</div>
        <div className="text-xs uppercase tracking-widest font-bold opacity-60">{statLabel}</div>
      </div>
      <p className="text-lg text-muted-foreground leading-relaxed flex-grow">
        {description}
      </p>
    </motion.div>
  );
}

function BenefitCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex flex-col p-8 rounded-3xl border shadow-sm ${color} transition-all duration-300`}
    >
      <div className="mb-6 flex justify-center md:justify-start">
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-headline mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
