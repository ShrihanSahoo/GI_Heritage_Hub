'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { languages } from '@/lib/language-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Phone,
  Shield,
  MapPin,
  Camera,
  Send,
  Loader2,
  ArrowLeft,
  PartyPopper,
  ArrowRight,
  Mail,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Relaxed schemas for Demo Mode - all media/ID is optional
const stepSchemas = [
  z.object({
    preferredLanguage: z.string().optional(),
  }),
  z.object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    mobileNumber: z.string().optional(),
    otp: z.string().optional(),
    profilePhoto: z.any().optional(),
  }),
  z.object({
    idType: z.string().optional(),
    idNumber: z.string().optional(),
    idProof: z.any().optional(),
  }),
  z.object({
    address: z.string().optional(),
    pincode: z.string().optional(),
    experience: z.string().optional(),
    craftStory: z.string().optional(),
  }),
  z.object({
    craftProof: z.any().optional(),
    association: z.string().optional(),
    associationDetails: z.string().optional(),
    digitalReadiness: z.string().optional(),
  }),
  z.object({
    consent: z.boolean().optional(),
  }),
];


type FormData = z.infer<typeof stepSchemas[0]> & 
                z.infer<typeof stepSchemas[1]> & 
                z.infer<typeof stepSchemas[2]> &
                z.infer<typeof stepSchemas[3]> &
                z.infer<typeof stepSchemas[4]> &
                z.infer<typeof stepSchemas[5]>;


const steps = [
  { id: 1, title: 'Language', icon: <User /> },
  { id: 2, title: 'Complete Profile', icon: <Phone /> },
  { id: 3, title: 'Identity (Optional)', icon: <Shield /> },
  { id: 4, title: 'Background', icon: <MapPin /> },
  { id: 5, title: 'Artisan Proof', icon: <Camera /> },
  { id: 6, title: 'Declaration', icon: <Send /> },
];

export default function ArtisanVerificationPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, setLanguage } = useTranslation();
  const { toast } = useToast();
  const { user, firestore, auth } = useFirebase();

  const currentSchema = stepSchemas[step];
  const form = useForm<FormData>({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
    defaultValues: {
      preferredLanguage: 'en',
      association: 'no',
      digitalReadiness: 'yes',
      consent: true
    }
  });
  
  const { trigger, getValues } = form;

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      if(step === 0) {
        const lang = getValues('preferredLanguage');
        if (lang) {
            setLanguage(lang);
        }
      }
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      let currentUser = user;

      // Full Profile Account Creation logic for Demo
      if (!currentUser) {
        // Prioritize provided email/password, otherwise generate unique demo ones
        const demoEmail = data.email || `artisan-${Date.now()}@heritage-hub.com`;
        const demoPassword = data.password || 'heritage123';
        
        const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
        currentUser = userCredential.user;
        
        if (data.fullName) {
          await updateProfile(currentUser, { displayName: data.fullName });
        }

        // Create base user record in 'users' collection
        const userRef = doc(firestore, 'users', currentUser.uid);
        await setDoc(userRef, {
          id: currentUser.uid,
          email: currentUser.email,
          firstName: data.fullName?.split(' ')[0] || 'Master',
          lastName: data.fullName?.split(' ').slice(1).join(' ') || 'Artisan',
          userType: 'seller',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }

      const artisanProfileRef = doc(firestore, 'artisan_profiles', currentUser.uid);

      // Map the translatable fields (required by the Hybrid Data Engine pattern)
      const profileData = {
        id: currentUser.uid,
        userId: currentUser.uid,
        name: { en: data.fullName || currentUser.displayName || 'New Artisan', hi: '', ta: '' },
        craft: { en: 'Traditional Handicraft', hi: '', ta: '' },
        region: { en: data.address || 'Traditional Cluster, India', hi: '', ta: '' },
        story: { en: data.craftStory || 'A passionate guardian of ancient techniques.', hi: '', ta: '' },
        imageId: 'artisan-raj', // Placeholder for demo
        sellerAuthenticityBadge: true,
        slug: currentUser.uid,
        status: 'verified', // Automatic verification for demo
        idType: data.idType || 'aadhaar',
        experience: data.experience || '10-20',
        digitalReadiness: data.digitalReadiness === 'yes',
        appliedAt: new Date().toISOString(),
        isDemoAccount: true
      };

      await setDoc(artisanProfileRef, profileData, { merge: true });

      toast({
        title: t('Account & Profile Created!'),
        description: t("Welcome to the Hub. Your master status is active."),
      });

      setStep(steps.length);

    } catch (serverError: any) {
      console.error("Artisan Creation Error:", serverError);
      toast({
        variant: 'destructive',
        title: t('Submission Failed'),
        description: serverError.message || t('An error occurred during account creation. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-12 min-h-[90vh] flex flex-col">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/mission" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 text-sm font-bold uppercase tracking-widest self-start">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back to Mission')}
        </Link>
        <div className="w-full text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2">{t('Artisan Onboarding')}</h1>
          <p className="text-muted-foreground italic">{t('Create your complete heritage account.')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Progress value={((step + 1) / (steps.length + 1)) * 100} className="w-full h-2" />
        
        <div className="p-8 border-2 border-primary/5 rounded-2xl shadow-xl bg-card">
          <div key={step}>
            {step < steps.length && (
              <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                      {steps[step].icon}
                  </div>
                  <h2 className="text-2xl font-bold font-headline">{t(steps[step].title)}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{t('Step {current} of {total}').replace('{current}', String(step + 1)).replace('{total}', String(steps.length))}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 0 && (
                <div className="space-y-4">
                  <Label className="text-lg">{t('Primary Language')}</Label>
                  <Select onValueChange={(value) => form.setValue('preferredLanguage', value, { shouldValidate: true })} defaultValue="en">
                      <SelectTrigger className="py-6 text-lg">
                          <SelectValue placeholder={t('Choose a language...')} />
                      </SelectTrigger>
                      <SelectContent>
                          {languages.map(lang => (
                              <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-4">
                    {t('Our AI bridge uses this to translate global collector messages for you instantly.')}
                  </p>
                </div>
              )}
              
              {step === 1 && (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <Label htmlFor="fullName">{t('Full Legal Name')}</Label>
                      <Input id="fullName" {...form.register('fullName')} placeholder={t('e.g. Master Rajesh Kumar')} className="py-6" />
                  </div>
                  {!user && (
                    <>
                      <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-3 w-3"/> {t('Account Email')}</Label>
                          <Input id="email" type="email" {...form.register('email')} placeholder="name@heritage.com" className="py-6" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="password" className="flex items-center gap-2"><Lock className="h-3 w-3"/> {t('Secure Password')}</Label>
                          <Input id="password" type="password" {...form.register('password')} placeholder="••••••••" className="py-6" />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                      <Label htmlFor="mobileNumber">{t('Mobile Number (Optional)')}</Label>
                      <Input id="mobileNumber" {...form.register('mobileNumber')} placeholder={t('10-digit mobile number')} type="tel" className="py-6 flex-grow" />
                  </div>
                </div>
              )}

              {step === 2 && (
                  <div className="space-y-6">
                      <div className="space-y-3">
                          <Label className="text-lg">{t('Identity Proof (Optional)')}</Label>
                           <RadioGroup onValueChange={(value) => form.setValue('idType', value, { shouldValidate: true })} className="flex gap-4">
                              <Label className="flex items-center gap-2 border rounded-xl p-4 flex-1 has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all cursor-pointer">
                                  <RadioGroupItem value="aadhaar" id="aadhaar" />{t('Aadhaar')}
                              </Label>
                              <Label className="flex items-center gap-2 border rounded-xl p-4 flex-1 has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all cursor-pointer">
                                  <RadioGroupItem value="voter" id="voter" />{t('Voter ID')}
                              </Label>
                          </RadioGroup>
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="idNumber">{t('ID Card Number (Optional)')}</Label>
                          <Input id="idNumber" {...form.register('idNumber')} placeholder={t('Enter ID number')} className="py-6" />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="idProof">{t('Upload Photo of ID (Optional)')}</Label>
                          <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:bg-muted/10 transition-colors cursor-pointer relative">
                            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">{t('Drag and drop to simulate upload')}</p>
                            <Input id="idProof" type="file" {...form.register('idProof')} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                      </div>
                  </div>
              )}

              {step === 3 && (
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="address">{t('Heritage Location')}</Label>
                          <Textarea id="address" {...form.register('address')} placeholder={t('Workshop address or Village Cluster')} className="min-h-[100px]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pincode">{t('Pincode')}</Label>
                            <Input id="pincode" {...form.register('pincode')} placeholder="000000" className="py-6" />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('Legacy (Years)')}</Label>
                            <Select onValueChange={(value) => form.setValue('experience', value, { shouldValidate: true })}>
                                <SelectTrigger className="py-6"><SelectValue placeholder={t('Experience')} /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0-5">0 - 5 {t('years')}</SelectItem>
                                    <SelectItem value="5-10">5 - 10 {t('years')}</SelectItem>
                                    <SelectItem value="10-20">10 - 20 {t('years')}</SelectItem>
                                    <SelectItem value="20+">20+ {t('years')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="craftStory">{t('The Heritage Story')}</Label>
                          <Textarea id="craftStory" {...form.register('craftStory')} className="min-h-[120px]" placeholder={t('How did you learn your craft?')} />
                      </div>
                  </div>
              )}

              {step === 4 && (
                  <div className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="craftProof">{t('Proof of Craftsmanship (Optional)')}</Label>
                          <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:bg-muted/10 transition-colors cursor-pointer relative">
                             <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                             <p className="text-sm text-muted-foreground">{t('Upload a photo or short video of you working.')}</p>
                             <Input id="craftProof" type="file" {...form.register('craftProof')} accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                      </div>
                      <div className="space-y-3">
                          <Label className="text-lg">{t('Part of a GI Group?')}</Label>
                           <RadioGroup onValueChange={(value) => form.setValue('association', value, { shouldValidate: true })} className="flex gap-4" defaultValue="no">
                              <Label className="flex items-center gap-2 border rounded-xl p-4 flex-1 has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all cursor-pointer">
                                  <RadioGroupItem value="yes" id="assoc-yes" />{t('Yes')}
                              </Label>
                              <Label className="flex items-center gap-2 border rounded-xl p-4 flex-1 has-[:checked]:bg-primary/5 has-[:checked]:border-primary transition-all cursor-pointer">
                                  <RadioGroupItem value="no" id="assoc-no" />{t('No')}
                              </Label>
                          </RadioGroup>
                      </div>
                  </div>
              )}
              
              {step === 5 && (
                  <div className="space-y-6">
                      <div className="flex items-start space-x-3 p-6 bg-muted/20 rounded-xl border border-primary/5">
                          <Checkbox id="consent" defaultChecked onCheckedChange={(checked) => form.setValue('consent', checked as boolean, { shouldValidate: true })} className="mt-1"/>
                          <Label htmlFor="consent" className="text-sm leading-relaxed italic text-muted-foreground">
                              {t('I hereby declare that I am a genuine artisan of the Indian heartland.')}
                          </Label>
                      </div>
                  </div>
              )}


              <div className="mt-12 flex justify-between gap-4">
                {step > 0 && step < steps.length && (
                  <Button type="button" variant="outline" onClick={prevStep} className="px-8 py-6 rounded-full border-primary/10">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back')}
                  </Button>
                )}
                <div className='flex-grow' />
                {step < steps.length - 1 && (
                  <Button type="button" onClick={nextStep} className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 rounded-full text-lg shadow-lg">
                    {t('Next Step')}
                  </Button>
                )}
                 {step === steps.length - 1 && (
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 px-12 py-6 rounded-full text-lg shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t('Creating Master Account...')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t('Verify My Legacy')}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

           {step === steps.length && (
               <div className="text-center space-y-6 py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                  >
                    <PartyPopper className="h-20 w-20 text-green-500 mx-auto" />
                  </motion.div>
                  <h2 className="text-3xl font-bold font-headline">{t('Welcome, Master Artisan!')}</h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">{t('Your full heritage account is active and your master profile is verified. You can now start showcasing your masterpieces to the world.')}</p>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 rounded-full">
                        <Link href="/products/new">
                            {t('List First Product')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="px-8 py-6 rounded-full">
                        <Link href="/account">{t('View My Dashboard')}</Link>
                    </Button>
                  </div>
              </div>
           )}

            </div>
        </div>
      </div>
    </div>
  );
}
