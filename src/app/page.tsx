'use client';
import Header from '@/components/header';
import { useArticles } from '@/context/article-context';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useRef, Suspense, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { VecizeCard } from '@/components/VecizeCard';
import type { Article } from '@/lib/placeholder-data';
import { MoveRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { truncateWords } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const Footer = dynamic(() => import('@/components/footer'), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});
const TopicsSidebar = dynamic(() => import('@/components/TopicsSidebar').then(mod => mod.TopicsSidebar), {
  loading: () => <Skeleton className="h-[500px] w-full" />,
});
const ShareDialog = dynamic(() => import('@/components/ShareDialog').then(mod => mod.ShareDialog));

export default function Home() {
  const { articles, isLoading } = useArticles();
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const cardRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  const safeGetDate = (date: any): Date | null => {
    if (!date) return null;
    if (date.toDate) return date.toDate();
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const publishedArticles = articles
    .filter((article) => article.status === 'published')
    .sort((a, b) => {
        const dateA = safeGetDate(a.createdAt);
        const dateB = safeGetDate(b.createdAt);
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });

  const gununIcerigi: Article | null = publishedArticles.length > 0 ? publishedArticles[0] : null;

  // Dinamik özet verilerini ayrıştır
  const summaryData = useMemo(() => {
    if (!gununIcerigi || !gununIcerigi.content.startsWith('[')) {
      return {
        mesele: "Nefsin perdelerini aralayan derin bir manevi farkındalık yolculuğu.",
        dayanak: "Kur'an ve Sünnet-i Seniyye'nin sarsılmaz hakikatleriyle temellenmiş burhanlar.",
        amel: "Soyut tefekkürü, bugün tatbik edilebilecek somut ve devrimci adımlara dönüştürüyoruz."
      };
    }
    try {
      const cards = JSON.parse(gununIcerigi.content);
      return {
        mesele: cards[0]?.problem ? truncateWords(cards[0].problem, 18) : "Nefsin perdelerini aralayan derin bir manevi farkındalık yolculuğu.",
        dayanak: (cards[0]?.ayet || cards[0]?.hikmet) ? truncateWords(cards[0]?.ayet || cards[0]?.hikmet, 18) : "Kur'an ve Sünnet-i Seniyye'nin sarsılmaz hakikatleriyle temellenmiş burhanlar.",
        amel: (cards[4]?.maddeler?.[0]?.aciklama || cards[0]?.maddeler?.[0]?.aciklama) ? truncateWords(cards[4]?.maddeler?.[0]?.aciklama || cards[0]?.maddeler?.[0]?.aciklama, 18) : "Soyut tefekkürü, bugün tatbik edilebilecek somut ve devrimci adımlara dönüştürüyoruz."
      };
    } catch (e) {
      return {
        mesele: "Nefsin perdelerini aralayan derin bir manevi farkındalık yolculuğu.",
        dayanak: "Kur'an ve Sünnet-i Seniyye'nin sarsılmaz hakikatleriyle temellenmiş burhanlar.",
        amel: "Soyut tefekkürü, bugün tatbik edilebilecek somut ve devrimci adımlara dönüştürüyoruz."
      };
    }
  }, [gununIcerigi]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="container px-4 md:px-6 py-12 md:py-16 space-y-16">
             <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
             <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
          </div>
        </main>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const handleShareClick = (e: React.MouseEvent, article: Article) => {
    e.preventDefault();
    e.stopPropagation();
    setShareArticle(article);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-[#fcfcfc] py-8 md:py-16">
        <div className="container grid grid-cols-1 gap-16 px-4 md:px-6 lg:grid-cols-4">
          
          <div className="col-span-1 space-y-20 md:space-y-32 lg:col-span-3">
            
            {gununIcerigi ? (
              <section className="space-y-16 md:space-y-24">
                  <div className="flex justify-center w-full" ref={el => cardRefs.current[gununIcerigi.id] = el}>
                    <VecizeCard 
                      article={gununIcerigi} 
                      isFeatured={true} 
                      onShareClick={(e) => handleShareClick(e, gununIcerigi)}
                      isLink={true}
                      className="max-w-5xl w-full"
                    />
                  </div>

                  <Card className="shadow-deep border-primary/5 rounded-[3.5rem] md:rounded-[4.5rem] bg-white overflow-hidden transition-all duration-700 hover:shadow-deep group">
                    <CardContent className="p-10 md:p-24">
                        <div className="space-y-10 md:space-y-16">
                            <div className="flex items-center gap-4 text-primary font-black text-[11px] md:text-sm uppercase tracking-[0.3em] text-shadow-heavy">
                               <Sparkles className="h-4 w-4 md:h-6 md:w-6" />
                               HAKİKATİN YENİ DİLİ: 5 ADIMDA TEFEKKÜR
                            </div>
                            
                            <Link href={`/posts/${gununIcerigi.id}`} className="group block">
                                <h2 className="font-headline text-3xl md:text-6xl font-black text-slate-900 group-hover:text-primary transition-colors leading-[1.1] text-shadow-heavy uppercase tracking-tighter">
                                    {gununIcerigi.title}
                                </h2>
                            </Link>

                            <div className="grid gap-8 md:gap-12 pt-4">
                                <div className="flex items-start gap-6 group/item">
                                    <div className="h-12 w-12 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-2xl shadow-deep border border-slate-100 group-hover/item:scale-110 transition-transform">🧭</div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase opacity-70 text-shadow-drop">Mesele & Teşhis</p>
                                        <p className="text-slate-700 font-bold text-lg md:text-2xl leading-snug text-shadow-heavy">
                                          {summaryData.mesele}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group/item">
                                    <div className="h-12 w-12 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-2xl shadow-deep border border-slate-100 group-hover/item:scale-110 transition-transform">📚</div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase opacity-70 text-shadow-drop">Dayanak & Delil</p>
                                        <p className="text-slate-700 font-bold text-lg md:text-2xl leading-snug text-shadow-heavy">
                                          {summaryData.dayanak}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6 group/item">
                                    <div className="h-12 w-12 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-2xl shadow-deep border border-slate-100 group-hover/item:scale-110 transition-transform">🚀</div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-primary tracking-[0.2em] uppercase opacity-70 text-shadow-drop">Amel & İstikamet</p>
                                        <p className="text-slate-700 font-bold text-lg md:text-2xl leading-snug text-shadow-heavy">
                                          {summaryData.amel}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 md:gap-4 pt-4 md:pt-8 border-t border-slate-100 mt-8">
                                {[...(gununIcerigi.categories || []), ...(gununIcerigi.topics || [])].slice(0, 5).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="bg-slate-50 text-slate-500 border border-slate-200 px-6 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-[12px] font-black tracking-widest uppercase shadow-deep text-shadow-drop">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <Link href={`/posts/${gununIcerigi.id}`} className="inline-flex items-center text-[11px] md:text-base font-black text-primary hover:underline group pt-4 md:pt-8 uppercase tracking-[0.4em] text-shadow-heavy">
                               Manifestonun Tamamını Oku <MoveRight className="ml-4 h-4 w-4 md:h-7 md:w-7 transition-transform group-hover:translate-x-3" />
                            </Link>
                        </div>
                    </CardContent>
                  </Card>
              </section>
            ) : (
              <div className="text-center py-32">
                <p className="text-muted-foreground text-xl italic font-medium text-shadow-drop">Henüz yayınlanmış bir içerik bulunmamaktadır.</p>
              </div>
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-1">
            <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3.5rem]" />}>
              <TopicsSidebar />
            </Suspense>
          </aside>

        </div>
        {shareArticle && (
          <Suspense>
            <ShareDialog
              article={shareArticle}
              isOpen={!!shareArticle}
              onOpenChange={(open) => !open && setShareArticle(null)}
              triggerRef={{ current: cardRefs.current[shareArticle.id] }}
            />
          </Suspense>
        )}
      </main>
       <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
