'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFirebase, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useTranslation } from '@/hooks/useTranslation';
import { BusinessInsights } from '@/components/BusinessInsights';
import { generateArtisanStory } from '@/ai/flows/artisan-story-generation';
import { Sparkles, Loader2 } from 'lucide-react';

export default function MyProfilePage() {
  const { user, isUserLoading, firestore } = useFirebase();
  const router = useRouter();
  const [name, setName] = useState('');
  const [craft, setCraft] = useState('');
  const [region, setRegion] = useState('');
  const [story, setStory] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const artisanDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'artisan_profiles', user.uid) : null),
    [user, firestore]
  );

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (artisanDocRef) {
      getDoc(artisanDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Handling translatable objects from Hybrid Engine
          setName(typeof data.name === 'object' ? data.name.en : (data.name || ''));
          setCraft(typeof data.craft === 'object' ? data.craft.en : (data.craft || ''));
          setRegion(typeof data.region === 'object' ? data.region.en : (data.region || ''));
          setStory(typeof data.story === 'object' ? data.story.en : (data.story || ''));
        }
      });
    }
  }, [artisanDocRef]);

  const handleGenerateStory = async () => {
    if (!name || !craft || !region) {
      toast({
        variant: 'destructive',
        title: t('Missing Details'),
        description: t('Please fill in your name, craft, and region first so the AI can craft your story.'),
      });
      return;
    }

    setIsGeneratingStory(true);
    try {
      const result = await generateArtisanStory({ name, craft, region });
      setStory(result.story);
      toast({
        title: t('Story Generated'),
        description: t('Your heritage narrative has been crafted by AI.'),
      });
    } catch (error) {
      console.error('Failed to generate story:', error);
      toast({
        variant: 'destructive',
        title: t('Generation Failed'),
        description: t('Could not generate your story. Please try again.'),
      });
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleSaveChanges = () => {
    if (!artisanDocRef) return;
    
    // Maintain translatable structure for Hybrid Engine
    const artisanData = {
        name: { en: name, hi: '', ta: '' },
        craft: { en: craft, hi: '', ta: '' },
        region: { en: region, hi: '', ta: '' },
        story: { en: story, hi: '', ta: '' },
    };

    setDoc(artisanDocRef, artisanData, { merge: true })
      .then(() => {
        toast({
          title: t('Profile Updated'),
          description: t('Your public profile has been saved.'),
        });
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: artisanDocRef.path,
          operation: 'update',
          requestResourceData: artisanData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: t('Update failed'),
          description: t('Could not save your profile.'),
        });
      });
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12 max-w-4xl">
        <p>{t('Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <Card className="border-primary/10 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-headline text-3xl">{t('Edit Your Public Profile')}</CardTitle>
          <CardDescription>
            {t("This information will be displayed on your public artisan page.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Your Name / Brand Name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-2xl py-6 bg-background border-primary/10 focus:border-primary transition-all text-lg"
              placeholder={t('e.g. Master Rajesh Kumar')}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="craft" className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Your Craft')}</Label>
            <Input
              id="craft"
              value={craft}
              onChange={(e) => setCraft(e.target.value)}
              className="rounded-2xl py-6 bg-background border-primary/10 focus:border-primary transition-all text-lg"
              placeholder={t('e.g. Blue Pottery')}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="region" className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Your Region')}</Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-2xl py-6 bg-background border-primary/10 focus:border-primary transition-all text-lg"
              placeholder={t('e.g. Jaipur, Rajasthan')}
            />
          </div>
           <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
                <Label htmlFor="story" className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Your Story')}</Label>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 font-bold h-auto p-0 flex items-center gap-1 group"
                    onClick={handleGenerateStory}
                    disabled={isGeneratingStory}
                >
                    {isGeneratingStory ? (
                        <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {t('Crafting...')}
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-3 w-3 group-hover:scale-110 transition-transform" />
                            {t('Write My Story (AI)')}
                        </>
                    )}
                </Button>
            </div>
            <Textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="min-h-[200px] rounded-2xl bg-background border-primary/10 focus:border-primary transition-all text-lg leading-relaxed"
              placeholder={t('Tell the world about your heritage and craft...')}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex justify-end">
          <Button onClick={handleSaveChanges} className="px-12 py-7 rounded-2xl text-lg shadow-lg">
            {t('Save Profile')}
          </Button>
        </CardFooter>
      </Card>

      <BusinessInsights />
    </div>
  );
}
