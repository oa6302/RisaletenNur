'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import { useArticles } from '@/context/article-context';
import { navItems } from '@/components/article-form-topics';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { VecizeCard } from '@/components/VecizeCard';
import { MoveRight } from 'lucide-react';
import { deslugify, slugify } from '@/lib/utils';
import type { Article } from '@/lib/placeholder-data';

const Footer = dynamic(() => import('@/components/footer'));
const TopicsSidebar = dynamic(() => import('@/components/TopicsSidebar').then(mod => mod.TopicsSidebar));
const ShareDialog = dynamic(() => import('@/components/ShareDialog').then(mod => mod.ShareDialog));


export default function CategoryPage() {
  const params = useParams();
  const { articles, isLoading } = useArticles();
  const slug = params.slug as string;
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const cardRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const categoryName = deslugify(slug);

  const vecizeler = articles.filter(article => {
    if (article.status !== 'published') return false;

    // For other categories, check if the article's categories array includes the current category slug
    return (article.categories || []).map(c => slugify(c)).includes(slug);
  });

  const handleShareClick = (e: React.MouseEvent, article: Article) => {
    e.preventDefault();
    e.stopPropagation();
    setShareArticle(article);
  };


  if (isLoading) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-muted/40 py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="mb-12">
                        <Skeleton className="h-12 w-1/3 mb-4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                     <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                           <Card key={i}>
                               <CardContent className="p-6 space-y-3">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Skeleton className="h-[300px] w-full" />
        </div>
    )
  }

  const hasContent = vecizeler.length > 0;
  const pageTitle = categoryName;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/40 py-12 md:py-24">
        <div className="container grid grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
          <div className="space-y-12 md:col-span-2 lg:col-span-3">
            <div className="mb-12">
              <h1 className="mb-2 font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                {pageTitle}
              </h1>
            </div>
            
            {!hasContent ? (
                 <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">Bu kategoride henüz yayınlanmış bir içerik bulunmamaktadır.</p>
                </div>
            ) : (
                <div className='space-y-16'>
                    {vecizeler.length > 0 && (
                        <section className='space-y-8'>
                            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                                {vecizeler.map((article) => (
                                  <div key={article.id} ref={el => cardRefs.current[article.id] = el}>
                                    <VecizeCard
                                      article={article}
                                      onShareClick={(e) => handleShareClick(e, article)}
                                    />
                                  </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
          </div>
          <aside className="hidden md:block md:col-span-1">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
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

    