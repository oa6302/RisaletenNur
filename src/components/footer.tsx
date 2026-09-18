'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import Link from 'next/link';
import { navItems } from './article-form-topics';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import React from 'react';

export default function Footer() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) {
        toast({
            title: 'Hata',
            description: 'Veritabanı bağlantısı kurulamadı.',
            variant: 'destructive',
        });
        return;
    }
    const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    
    if (!email) {
        toast({
            title: 'Hata',
            description: 'Lütfen geçerli bir e-posta adresi girin.',
            variant: 'destructive',
        });
        return;
    }

    try {
        const subscriptionsCol = collection(firestore, 'newsletterSubscriptions');
        await addDoc(subscriptionsCol, {
            email: email,
            subscriptionDate: serverTimestamp(),
            isSubscribed: true,
        });
        
        toast({
            title: 'Başarılı!',
            description: 'Bültenimize abone olduğunuz için teşekkür ederiz!',
        });
        (event.target as HTMLFormElement).reset();

    } catch (error) {
        console.error("Subscription error: ", error);
        toast({
            title: 'Abonelik Başarısız',
            description: 'Bültene abone olurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            variant: 'destructive',
        });
    }
  };
  
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-4 md:col-span-3">
            <Link href="/" aria-label="Risaletennur Ana Sayfa">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Bilgi, maneviyat ve aydınlanmayı keşfetmek.
            </p>
          </div>
          <div className="md:col-span-9">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mb-4 font-headline text-base font-semibold">Gezin</h3>
                <ul className="space-y-2">
                  {navItems.map(item => (
                     <li key={item.name}>
                        <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {item.name}
                        </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Yönetici
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="md:col-span-3">
                <h3 className="mb-4 font-headline text-base font-semibold">Bültenimize Abone Olun</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Yeni makaleler ve özel içerikler hakkında güncellemeler alın.
                </p>
                <form className="flex gap-2" onSubmit={handleSubscribe}>
                  <Input
                    type="email"
                    name="email"
                    placeholder="E-postanızı girin"
                    className="border-primary/20 bg-background text-foreground focus-visible:ring-primary/50"
                    aria-label="Bülten için e-posta"
                  />
                  <Button type="submit" variant="default">
                    Abone Ol
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RisaletenNur Platformu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
