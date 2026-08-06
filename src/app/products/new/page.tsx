'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import {
  File,
  Sparkles,
  BookOpen,
  Package,
  ArrowLeft,
  Loader2,
  PartyPopper,
  UploadCloud
} from 'lucide-react';
import { useFirebase, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Artisan } from '@/lib/data';

// Relaxed schemas for Demo Mode
const stepSchemas = [
  z.object({
    productName: z.string().optional(),
    category: z.string().optional(),
    region: z.string().optional(),
  }),
  z.object({
    materials: z.string().optional(),
    makingTechnique: z.string().optional(),
    timeToMake: z.string().optional(),
  }),
  z.object({
    photos: z.any().optional(),
    story: z.string().optional(),
    giTag: z.string().optional(),
  }),
  z.object({
    price: z.coerce.number().optional(),
    availability: z.string().optional(),
    stockCount: z.coerce.number().optional(),
    dispatchTime: z.string().optional(),
  })
];

type FormData = z.infer<typeof stepSchemas[0]> & 
                z.infer<typeof stepSchemas[1]> &
                z.infer<typeof stepSchemas[2]> &
                z.infer<typeof stepSchemas[3]>;

const steps = [
  { id: 1, title: 'Core Details', icon: <File /> },
  { id: 2, title: 'Craftsmanship', icon: <Sparkles /> },
  { id: 3, title: 'Media & Story', icon: <BookOpen /> },
  { id: 4, title: 'Logistics & Price', icon: <Package /> },
];

export default function NewProductPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const { firestore } = useFirebase();

  const artisanRef = useMemoFirebase(
    () => (user ? doc(firestore, 'artisan_profiles', user.uid) : null),
    [user, firestore]
  );
  const { data: artisan, isLoading: isLoadingArtisan } = useDoc<Artisan>(artisanRef);

  const currentSchema = stepSchemas[step];
  const form = useForm<FormData>({
    resolver: zodResolver(currentSchema as any),
    mode: 'onChange',
    defaultValues: {
      availability: 'in_stock'
    }
  });

  const { control, trigger, getValues, setValue } = form;

  useEffect(() => {
    if (artisan && step === 0) {
      setValue('region', t(artisan.region), { shouldValidate: true });
    }
  }, [artisan, step, setValue, t]);

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };
  
  const onSubmit = async (data: any) => {
     if (!user || !firestore) {
      toast({ variant: 'destructive', title: t('Error'), description: t('You must be logged in as a seller.') });
      return;
    }
    setIsSubmitting(true);
    const productsCollectionRef = collection(firestore, 'products');

    try {
      const imageId = 'pashmina-shawl'; // Placeholder for demo
      const docData = {
        name: { en: data.productName || 'Unnamed Masterpiece', hi: '', ta: '' },
        craft: { en: data.category || 'Traditional Craft', hi: '', ta: '' },
        region: { en: data.region || 'India Cluster', hi: '', ta: '' },
        materials: data.materials || 'Traditional raw materials',
        makingTechnique: data.makingTechnique || 'Master artisan technique',
        timeToMake: data.timeToMake || 'Varies',
        story: data.story ? { en: data.story, hi: '', ta: '' } : { en: 'A piece of heritage.', hi: '', ta: '' },
        gi_tag: data.giTag ? { en: data.giTag, hi: '', ta: '' } : null,
        price: data.price || 0,
        availability: data.availability || 'in_stock',
        stockCount: data.stockCount || 1,
        dispatchTime: data.dispatchTime || '3-5 days',
        artisanId: user.uid,
        imageId: imageId,
      };

      const newDocRef = await addDoc(productsCollectionRef, docData);
      await setDoc(newDocRef, { id: newDocRef.id, slug: newDocRef.id }, { merge: true });

      toast({ title: t('Product Listed!'), description: t('Your new craft is now live on the marketplace.') });
      setStep(steps.length);
      setTimeout(() => router.push(`/products/${newDocRef.id}`), 3000);

    } catch (error) {
      console.error('Error adding product to Firestore:', error);
      const permissionError = new FirestorePermissionError({
          path: productsCollectionRef.path,
          operation: 'create',
          requestResourceData: data,
        });
      errorEmitter.emit('permission-error', permissionError);
      toast({ variant: 'destructive', title: t('Submission Failed'), description: t('Could not save your product.') });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const availabilityValue = useWatch({ control, name: 'availability' });
  const { formState: { errors } } = form;

  return (
    <div className="container mx-auto max-w-2xl py-12 min-h-[80vh] flex flex-col justify-center">
        <Link href="/account" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8 text-sm font-bold uppercase tracking-[0.3em] self-start">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back to Dashboard')}
        </Link>
      <div className="space-y-4">
        <Progress value={((step + 1) / (steps.length + 1)) * 100} className="w-full h-2" />
        <div className="p-8 border-2 border-primary/5 rounded-2xl shadow-xl bg-card">
          <div key={step}>
            {step < steps.length && (
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-2">
                  {steps[step].icon}
                </div>
                <h2 className="text-2xl font-bold font-headline">{t(steps[step].title)}</h2>
                <p className="text-muted-foreground text-sm">{t('Step {current} of {total}').replace('{current}', String(step + 1)).replace('{total}', String(steps.length))}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName">{t('Product Name')}</Label>
                    <Input id="productName" {...form.register('productName')} placeholder={t('e.g., Hand-carved Wooden Elephant')} className="py-6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('Category / Craft')}</Label>
                    <Input id="category" {...form.register('category')} placeholder={t('e.g., Woodcraft, Pottery')} className="py-6" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="region">{t('Region of Origin')}</Label>
                    <Input id="region" {...form.register('region')} placeholder={t('e.g., Rajasthan, India')} disabled={isLoadingArtisan} className="py-6" />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <Label htmlFor="materials">{t('Materials Used')}</Label>
                      <Input id="materials" {...form.register('materials')} placeholder={t('e.g., Mango wood, Brass')} className="py-6" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="makingTechnique">{t('Making Technique')}</Label>
                      <Textarea id="makingTechnique" {...form.register('makingTechnique')} className="min-h-[120px]" placeholder={t('Describe your master technique...')} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="timeToMake">{t('Time taken to make')}</Label>
                      <Input id="timeToMake" {...form.register('timeToMake')} placeholder={t('e.g., Approx 7 days')} className="py-6" />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="photos">{t('Product Photos (Optional for Demo)')}</Label>
                      <div className="relative border-dashed border-2 border-muted rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-all cursor-pointer">
                        <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground mb-2">{t('Drag and drop to simulate upload')}</span>
                        <Input id="photos" type="file" {...form.register('photos')} accept="image/*" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="story">{t('Story or Significance')}</Label>
                      <Textarea id="story" {...form.register('story')} className="min-h-[120px]" placeholder={t('What makes this product special?')} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="giTag">{t('GI Tag Reference (Optional)')}</Label>
                      <Input id="giTag" {...form.register('giTag')} placeholder={t('Enter GI number')} className="py-6" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                   <div className="space-y-2">
                      <Label htmlFor="price">{t('Price (INR)')}</Label>
                      <Input id="price" type="number" {...form.register('price')} placeholder={t('e.g., 3500')} className="py-6" />
                  </div>
                   <div className="space-y-3">
                      <Label>{t('Availability')}</Label>
                       <RadioGroup onValueChange={(value) => form.setValue('availability', value, { shouldValidate: true })} className="flex gap-4" defaultValue="in_stock">
                          <Label className="flex items-center gap-2 border rounded-xl p-4 flex-1 has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all cursor-pointer">
                              <RadioGroupItem value="in_stock" id="in_stock" />{t('In Stock')}
                          </Label>
                          <Label className="flex items-center gap-2 border rounded-xl p-4 flex-1 has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all cursor-pointer">
                              <RadioGroupItem value="made_to_order" id="made_to_order" />{t('Made to Order')}
                          </Label>
                      </RadioGroup>
                  </div>
                   {availabilityValue === 'in_stock' && (
                       <div className="space-y-2">
                          <Label htmlFor="stockCount">{t('Available Stock')}</Label>
                          <Input id="stockCount" type="number" {...form.register('stockCount')} placeholder={t('e.g., 5')} className="py-6" />
                      </div>
                  )}
                </div>
              )}

              {step === steps.length && (
                 <div className="text-center space-y-4 py-8">
                    <PartyPopper className="h-16 w-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold font-headline">{t('Heritage Piece Listed!')}</h2>
                    <p className="text-muted-foreground">{t("Your craft is now live on the marketplace cluster.")}</p>
                    <Button asChild className="rounded-full px-8 bg-primary">
                        <Link href="/account">{t('Back to Dashboard')}</Link>
                    </Button>
                </div>
              )}

              <div className="mt-8 flex justify-between gap-4">
                {step > 0 && step < steps.length && (
                  <Button type="button" variant="outline" onClick={prevStep} className="rounded-full px-8">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('Back')}
                  </Button>
                )}
                <div className='flex-grow' />
                {step < steps.length - 1 && (
                  <Button type="button" onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6">
                    {t('Next Step')}
                  </Button>
                )}
                 {step === steps.length - 1 && (
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-12 py-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('Listing...')}
                      </>
                    ) : (
                      t('List Product Now')
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
