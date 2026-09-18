'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/header';
import { useArticles } from '@/context/article-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import React, { useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { truncateWords } from '@/lib/utils';
import { MoveRight } from 'lucide-react';
import { VecizeCard } from '@/components/VecizeCard';
import type { Article } from '@/lib/placeholder-data';

const Footer = dynamic(() => import('@/components/footer'));
const TopicsSidebar = dynamic(() => import('@/components/TopicsSidebar').then(mod => mod.TopicsSidebar));
const ShareDialog = dynamic(() => import('@/components/ShareDialog').then(mod => mod.ShareDialog));


export default function ArticlesPage() {
  const { articles, isLoading } = useArticles();
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const cardRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const safeGetDate = (date: any): Date | null => {
    if (!date) return null;
    if (date.toDate) return date.toDate();
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const blogPosts = articles
    .filter((article) => article.status === 'published' && article.prompt && article.content)
    .sort((a, b) => {
        const dateA = safeGetDate(a.createdAt);
        const dateB = safeGetDate(b.createdAt);
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/40 py-12 md:py-16">
          <div className="container space-y-12 px-4 md:px-6">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-8 md:grid-cols-1">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
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
      <main className="flex-1 bg-muted/40 py-12 md:py-16">
        <div className="container grid grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
          <div className="col-span-1 space-y-16 md:col-span-2 lg:col-span-3">
            {blogPosts.length > 0 ? (
              <div>
                <h1 className="mb-8 font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Tüm Makaleler</h1>
                <div className="grid gap-12 md:grid-cols-1">
                  {blogPosts.map((article) => (
                     <Card key={article.id} className="grid grid-cols-1 md:grid-cols-3 transition-all duration-300 hover:shadow-lg hover:border-primary/30 h-full">
                         <div className="md:col-span-1 p-4" ref={el => cardRefs.current[article.id] = el}>
                           <VecizeCard 
                              article={article} 
                              onShareClick={(e) => handleShareClick(e, article)}
                              isLink={false}
                            />
                         </div>
                         <CardContent className="md:col-span-2 p-6 flex flex-col justify-center">
                          <Link href={`/posts/${article.id}`} className="group block">
                            <h3 className="font-headline text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors text-shadow-drop">
                            {article.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow text-shadow-drop">
                                {truncateWords(article.content, 30)}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[...(article.categories || []), ...(article.topics || [])].slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                            <div className="flex items-center text-sm font-semibold text-primary group-hover:underline mt-auto pt-2">
                                Okumaya devam et <MoveRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </Link>
                        </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Henüz yayınlanmış bir makale bulunmamaktadır.</p>
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