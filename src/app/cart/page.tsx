'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Trash2, ShoppingCart, Minus, Plus, CreditCard, Heart, ScrollText, CheckCircle2, ShieldCheck, Truck, Sparkles, MoveRight, Info, MapPin, Phone, Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOrdered, setIsOrdered] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 150.0 : 0;
  const tax = subtotal * 0.12; // 12% GST for handicrafts
  const total = subtotal + shipping + tax;

  const handleMoveToWishlist = (item: any) => {
    addToWishlist(item);
    removeFromCart(item.id);
    toast({ 
        title: t('Moved to Collection'),
        description: t('{name} has been saved to your heritage gallery.').replace('{name}', t(item.name))
    });
  };

  const handlePlaceOrder = () => {
    setIsOrdered(true);
    setTimeout(() => {
        clearCart();
    }, 1000);
  };

  if (isOrdered) {
      return (
          <div className="container mx-auto max-w-4xl py-32 px-4 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-32 h-32 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"
              >
                  <CheckCircle2 className="h-16 w-16" />
              </motion.div>
              <h1 className="text-6xl font-bold font-headline mb-6 tracking-tight">{t('Heritage Secured!')}</h1>
              <p className="text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                  {t('You have successfully acquired authentic Indian heritage. Your master artisan has been notified and will begin preparing your piece with the care it deserves.')}
              </p>
              
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 max-w-xl mx-auto mb-16 flex items-start gap-4 text-left">
                  <div className="bg-primary/20 p-3 rounded-2xl">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t('Digital Passport Issued')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t('A unique authenticity certificate with GI tracking details has been sent to your registered email.')}</p>
                  </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" className="rounded-2xl px-12 py-8 text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                      <Link href="/products">{t('Discover More Legacy')}</Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="rounded-2xl px-12 py-8 text-xl border-primary/20 text-primary">
                      <Link href="/account">{t('My Heritage Hub')}</Link>
                  </Button>
              </div>
          </div>
      )
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-24">
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-primary/10 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs">
                        <ShoppingCart className="h-4 w-4" /> {t('Procurement Hub')}
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-headline leading-none">{t('Your Shopping Bag')}</h1>
                    <p className="text-xl text-muted-foreground font-light">{t('Securing pieces of history directly from master hands.')}</p>
                </div>
                <Button variant="ghost" asChild className="rounded-full text-muted-foreground hover:text-primary font-bold uppercase tracking-widest text-xs">
                    <Link href="/mission">
                        <ScrollText className="mr-2 h-4 w-4" /> {t('Back to Mission')}
                    </Link>
                </Button>
            </div>
        
            <div className="grid lg:grid-cols-3 lg:gap-16">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-12">
                {cart.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-6 py-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <span className="font-black uppercase tracking-widest text-xs text-primary/70">{t('Verified GI Items')} ({cart.length})</span>
                            <Button variant="link" onClick={clearCart} className="text-xs font-bold text-muted-foreground hover:text-destructive p-0 h-auto uppercase tracking-widest">{t('Clear Procurement List')}</Button>
                        </div>
                        
                        <ul className="space-y-6">
                            <AnimatePresence mode='popLayout'>
                            {cart.map((item) => {
                                const image = PlaceHolderImages.find((img) => img.id === item.imageId);
                                return (
                                    <motion.li 
                                        key={item.id} 
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-card p-6 rounded-3xl border border-primary/5 shadow-sm group hover:shadow-xl transition-all flex flex-col sm:flex-row gap-8 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        
                                        <div className="relative w-40 h-40 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                            {image && (
                                            <Image
                                                src={image.imageUrl}
                                                alt={t(item.name)}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-110 duration-500"
                                                sizes="160px"
                                            />
                                            )}
                                        </div>

                                        <div className="flex-grow space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className="font-bold font-headline text-2xl leading-none">
                                                        <Link href={`/products/${item.slug}`} className="hover:text-primary transition-colors">{t(item.name)}</Link>
                                                    </h2>
                                                    <p className="text-sm text-primary font-bold mt-1 uppercase tracking-widest">{t('Handcrafted in {region}').replace('{region}', t(item.region))}</p>
                                                </div>
                                                <p className="text-2xl font-bold font-headline text-primary">₹{item.price.toLocaleString()}</p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-2">
                                                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> {t('GI Verified')}</span>
                                                <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-amber-600" /> {t('Insured Delivery')}</span>
                                            </div>

                                            <div className="flex items-center gap-6 pt-4">
                                                <div className="flex items-center border rounded-2xl bg-muted/20 overflow-hidden">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none hover:bg-white" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none hover:bg-white" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary p-0 h-auto font-black uppercase tracking-widest text-[10px]" onClick={() => handleMoveToWishlist(item)}>
                                                        <Heart className="h-3 w-3 mr-1" /> {t('Move to Collection')}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive p-0 h-auto font-black uppercase tracking-widest text-[10px]" onClick={() => removeFromCart(item.id)}>
                                                        <Trash2 className="h-3 w-3 mr-1" /> {t('Remove')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                            </AnimatePresence>
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-primary/10">
                        <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h2 className="text-4xl font-bold font-headline mb-4">{t('Your procurement bag is empty')}</h2>
                        <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto">{t('Our master artisans are waiting to share their legacy with you.')}</p>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-12 py-7 text-xl rounded-2xl shadow-xl shadow-primary/20">
                            <Link href="/products">{t('Discover Heritage Crafts')}</Link>
                        </Button>
                    </div>
                )}

                {/* Detailed Checkout Form */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                         <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                            <MapPin className="h-6 w-6" />
                         </div>
                         <h3 className="text-3xl font-bold font-headline leading-none">{t('Shipping & Acquisition Details')}</h3>
                    </div>

                    <Card className="border-primary/5 shadow-2xl rounded-[2.5rem] bg-card/80 backdrop-blur-sm p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('First Name')}</Label>
                                    <Input placeholder={t('e.g. Ananya')} className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Last Name')}</Label>
                                    <Input placeholder={t('e.g. Sharma')} className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1 flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> {t('Logistics Email')}
                                    </Label>
                                    <Input type="email" placeholder="collector@heritage.com" className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1 flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> {t('Contact Number')}
                                    </Label>
                                    <Input type="tel" placeholder="+91 00000 00000" className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Full Heritage Address')}</Label>
                                    <Textarea placeholder={t('Flat/House No, Street, Landmark')} className="rounded-2xl min-h-[120px] bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('City')}</Label>
                                        <Input placeholder={t('New Delhi')} className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('ZIP Code')}</Label>
                                        <Input placeholder="110001" className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('State / Region')}</Label>
                                    <Select>
                                        <SelectTrigger className="rounded-2xl py-7 bg-background border-primary/5 focus:border-primary transition-all text-lg h-auto">
                                            <SelectValue placeholder={t('Select Heritage State')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="delhi">Delhi</SelectItem>
                                            <SelectItem value="rajasthan">Rajasthan</SelectItem>
                                            <SelectItem value="odisha">Odisha</SelectItem>
                                            <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                                            <SelectItem value="kerala">Kerala</SelectItem>
                                            <SelectItem value="westbengal">West Bengal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-4">
                            <Label className="text-xs uppercase tracking-widest font-black opacity-60 ml-1">{t('Special Acquisition Instructions')}</Label>
                            <Textarea placeholder={t('Any details for the artisan or delivery team regarding safe handling...')} className="rounded-2xl min-h-[100px] bg-muted/20 border-primary/5 text-lg" />
                        </div>
                    </Card>
                </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                         <Card className="bg-primary text-primary-foreground shadow-2xl border-0 overflow-hidden rounded-[2.5rem] relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Sparkles className="h-24 w-24 rotate-12" />
                            </div>
                            <CardHeader className="pt-10 pb-6 px-10">
                                <CardTitle className="font-headline text-4xl leading-none">{t('Heritage Summary')}</CardTitle>
                                <CardDescription className="text-primary-foreground/60 text-lg">{t('Finalize your legacy acquisition.')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 px-10 text-xl font-light">
                                <div className="flex justify-between items-center text-primary-foreground/70">
                                    <span>{t('Authentic Pieces')}</span>
                                    <span className="font-bold text-primary-foreground">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-primary-foreground/70">
                                    <div className="flex items-center gap-2">
                                        <span>{t('Heritage Tax (12%)')}</span>
                                        <Info className="h-4 w-4 opacity-50" />
                                    </div>
                                    <span className="font-bold text-primary-foreground">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-primary-foreground/70">
                                    <span>{t('Insured Logistics')}</span>
                                    <span className="font-bold text-primary-foreground">₹{shipping.toLocaleString()}</span>
                                </div>
                                <Separator className="bg-primary-foreground/20 h-0.5" />
                                <div className="flex justify-between items-end pt-4">
                                    <span className="font-bold text-2xl uppercase tracking-tighter opacity-80">{t('Grand Total')}</span>
                                    <span className="font-bold text-5xl font-headline leading-none">₹{total.toLocaleString()}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="px-10 pb-12 pt-6 flex flex-col gap-6">
                                <Button 
                                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-8 text-2xl rounded-2xl shadow-xl shadow-accent/20 group" 
                                    size="lg" 
                                    disabled={cart.length === 0}
                                    onClick={handlePlaceOrder}
                                >
                                    <CreditCard className="mr-3 h-6 w-6" />
                                    {t('Confirm Acquisition')}
                                    <MoveRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                                </Button>
                                <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4 border border-white/10">
                                    <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                                    <p className="text-[10px] uppercase tracking-widest font-black leading-relaxed">
                                        {t('Every rupee supports the master artisan and their regional heritage cluster.')}
                                    </p>
                                </div>
                            </CardFooter>
                        </Card>
                        
                        {/* Trust Badges Sidebar */}
                        <div className="space-y-4">
                            <div className="p-6 bg-white rounded-3xl border border-primary/5 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-[10px] uppercase tracking-widest">{t('Authenticity Guaranteed')}</p>
                                    <p className="text-xs text-muted-foreground">{t('Legal GI protection on all items.')}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-primary/5 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-black text-[10px] uppercase tracking-widest">{t('Insured Transit')}</p>
                                    <p className="text-xs text-muted-foreground">{t('Global door-to-door protection.')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
