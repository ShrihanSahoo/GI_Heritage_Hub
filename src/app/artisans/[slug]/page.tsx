
'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Mail, MessageSquare, PlusCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { useTranslation } from '@/hooks/useTranslation';
import { artisans as mockArtisans, products as mockProducts, Artisan, Product } from '@/lib/data';
import { use, useMemo, useState } from 'react';
import { collection, query, where, doc, addDoc } from 'firebase/firestore';
import { useFirebase, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type ArtisanPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ArtisanPage({ params }: ArtisanPageProps) {
  const { t } = useTranslation();
  const resolvedParams = use(params);
  const { firestore, user } = useFirebase();
  const [customRequest, setCustomRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // The slug can be the artisan's ID, so we fetch from artisan_profiles collection
  const artisanRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'artisan_profiles', resolvedParams.slug) : null),
    [firestore, resolvedParams.slug]
  );
  const { data: liveArtisan, isLoading: isLoadingArtisan } = useDoc<Artisan>(artisanRef);

  // Fetch products for this artisan
  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), where('artisanId', '==', resolvedParams.slug)) : null),
    [firestore, resolvedParams.slug]
  );
  const { data: liveProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const artisan = useMemo(() => {
    // If we have live data, use it.
    if (liveArtisan) return liveArtisan;
    // Otherwise, fall back to mock data.
    return mockArtisans.find((a) => a.slug === resolvedParams.slug);
  }, [liveArtisan, resolvedParams.slug]);

  const products = useMemo(() => {
    const productMap = new Map<string, Product>();

    // Add mock products first
    mockProducts
      .filter((p) => p.artisanId === resolvedParams.slug)
      .forEach(product => productMap.set(product.id, product));
    
    // Add or overwrite with live products
    liveProducts?.forEach(product => productMap.set(product.id, product));

    return Array.from(productMap.values());
  }, [liveProducts, resolvedParams.slug]);

  const allArtisans = useMemo(() => {
    const artisanMap = new Map<string, Artisan>();
    mockArtisans.forEach(a => artisanMap.set(a.id, a));
    if (liveArtisan) {
        artisanMap.set(liveArtisan.id, liveArtisan);
    }
    return Array.from(artisanMap.values());
  }, [liveArtisan]);
  
  const handleCustomRequestSubmit = async () => {
    if (!user || !artisan || !customRequest.trim()) {
      toast({
        variant: 'destructive',
        title: t('Error'),
        description: t('Please log in and write a description for your request.'),
      });
      return;
    }
    setIsSubmitting(true);
    const requestData = {
      buyerId: user.uid,
      artisanId: artisan.id,
      description: customRequest,
      requirements: customRequest,
      status: 'pending',
    };
    const collectionRef = collection(firestore, 'custom_order_requests');
    try {
      await addDoc(collectionRef, requestData);
      toast({
        title: t('Request Sent'),
        description: t('The artisan has been notified of your custom order request.'),
      });
      setCustomRequest('');
      // Find a way to close dialog
    } catch (serverError) {
      const permissionError = new FirestorePermissionError({
        path: collectionRef.path,
        operation: 'create',
        requestResourceData: requestData,
      });
      errorEmitter.emit('permission-error', permissionError);
      toast({
        variant: 'destructive',
        title: t('Request Failed'),
        description: t('Could not send your request. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoadingArtisan || isLoadingProducts) {
    return <div className="container mx-auto py-12 text-center">{t('Loading artisan profile...')}</div>
  }

  if (!artisan) {
    notFound();
  }

  const bannerImage = PlaceHolderImages.find((img) => img.id === 'artisan-profile-banner');
  const artisanImage = PlaceHolderImages.find((img) => img.id === artisan.imageId);

  return (
    <div className="bg-card">
      <div className="relative h-48 md:h-64 w-full">
        {bannerImage && (
          <Image
            src={bannerImage.imageUrl}
            alt="Artisan crafts banner"
            fill
            className="object-cover"
            data-ai-hint={bannerImage.imageHint}
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="container mx-auto px-4 -mt-16 md:-mt-24 pb-16">
        <div className="relative">
          <div className="md:flex gap-8 items-end">
            <div className="relative flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-card ring-4 ring-card">
              {artisanImage && (
                <Image
                  src={artisanImage.imageUrl}
                  alt={t(artisan.name)}
                  fill
                  className="rounded-full object-cover"
                  data-ai-hint={artisanImage.imageHint}
                  sizes="(max-width: 768px) 128px, 192px"
                />
              )}
            </div>
            <div className="mt-4 md:mt-0 md:pb-4 flex-grow">
              <h1 className="text-3xl md:text-5xl font-bold font-headline">{t(artisan.name)}</h1>
              <p className="text-lg text-primary">{t(artisan.craft)}</p>
              <p className="text-md text-muted-foreground">{t(artisan.region)}</p>
            </div>
            <div className="mt-4 md:mt-0 md:pb-4 flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" /> {t('Message')}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                   <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('Request Custom Order')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle className='font-headline'>{t('Request a Custom Order')}</DialogTitle>
                    <DialogDescription>
                        {t('Describe your custom request for {artisanName}. They will get back to you via in-app chat.').replace('{artisanName}', artisan ? t(artisan.name) : t('the artisan'))}
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="custom-request">{t('Your custom request')}</Label>
                            <Textarea 
                                placeholder={t('I would like a similar vase, but in a blue color...')} 
                                id="custom-request" 
                                className="min-h-[120px]"
                                value={customRequest}
                                onChange={(e) => setCustomRequest(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-accent text-accent-foreground hover:bg-accent/90" 
                        onClick={handleCustomRequestSubmit}
                        disabled={isSubmitting}
                      >
                          {isSubmitting ? t('Sending...') : t('Send Request')}
                      </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mt-12">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold font-headline mb-4">{t("Artisan's Story")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(artisan.story)}
            </p>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold font-headline mb-4">
              {t('Products by {artisanName}').replace('{artisanName}', t(artisan.name))}
            </h2>
            {products.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} artisans={allArtisans} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">{t('No products listed yet.')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

    