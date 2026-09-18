'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useTransition, useEffect } from 'react';
import { Home, BookOpen, PanelLeft, PlusCircle, Wand2, Sparkles } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useArticles } from '@/context/article-context';
import { handleEnrichAndSave } from './actions';
import { useToast } from '@/hooks/use-toast';

const navLinks = [{ href: '/admin', label: 'İçerik Yönetimi', icon: BookOpen }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { articles } = useArticles();
  const [isEnrichingAll, startEnrichTransition] = useTransition();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApiError = (error: unknown, articleId?: string) => {
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    console.error(`Makale zenginleştirilemedi ${articleId ? `(ID: ${articleId})` : ''}:`, error);

    toast({
      title: 'Zenginleştirme Başarısız',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const onEnrichAll = () => {
    startEnrichTransition(async () => {
      toast({
        title: 'Toplu Zenginleştirme Başladı',
        description: `${articles.length} makale güncelleniyor. Bu işlem zaman alabilir.`,
      });

      let successCount = 0;
      let errorCount = 0;

      for (const article of articles) {
        if (article.id === 'static-her-dertliye-derman' || article.id.startsWith('static-')) continue;
        try {
          await handleEnrichAndSave(article.id, article.content);
          successCount++;
        } catch (error) {
          errorCount++;
          handleApiError(error, article.id);
        }
      }

      toast({
        title: 'Toplu Zenginleştirme Tamamlandı',
        description: `${successCount} makale başarıyla güncellendi. ${errorCount} makalede hata oluştu.`,
        variant: errorCount > 0 ? 'destructive' : 'default',
      });
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo simple />
            <span className="sr-only">RisaletenNur</span>
          </Link>
          <TooltipProvider>
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                      pathname === href ? 'bg-accent text-accent-foreground' : ''
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            {mounted ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Navigasyonu Aç</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                  </SheetHeader>
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link
                      href="/"
                      className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                      <Logo simple />
                      <span className="sr-only">RisaletenNur</span>
                    </Link>
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                            pathname === href && "text-foreground"
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            ) : (
              <div className="h-10 w-10 sm:hidden" />
            )}
            <div className="hidden md:block">
                <h1 className="font-headline text-2xl font-bold tracking-tight text-shadow-heavy">İçerik Yönetimi</h1>
                <p className="text-muted-foreground text-sm">Makalelerinizi ve gönderilerinizi yönetin.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/" className="hidden sm:inline-flex">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Ana Sayfa
              </Button>
            </Link>
            {mounted ? (
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isEnrichingAll || articles.length === 0}>
                    {isEnrichingAll ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Tümünü Zenginleştir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tüm makaleleri zenginleştirmek istediğinizden emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem, mevcut tüm makalelerin içeriğini yapay zeka ile yeniden yazacaktır.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={onEnrichAll} disabled={isEnrichingAll}>
                      {isEnrichingAll ? 'Zenginleştiriliyor...' : 'Evet, Tümünü Zenginleştir'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div className="h-10 w-32 bg-muted rounded-md animate-pulse hidden sm:block" />
            )}
            <Link href="/admin/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni İçerik
              </Button>
            </Link>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
