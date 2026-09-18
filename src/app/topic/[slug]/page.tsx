'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header';
import { useArticles } from '@/context/article-context';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { VecizeCard } from '@/components/VecizeCard';
import { deslugify, slugify, truncateWords } from '@/lib/utils';
import { MoveRight } from 'lucide-react';
import type { Article } from '@/lib/placeholder-data';

const Footer = dynamic(() => import('@/components/footer'));
const TopicsSidebar = dynamic(() => import('@/components/TopicsSidebar').then(mod => mod.TopicsSidebar));
const ShareDialog = dynamic(() => import('@/components/ShareDialog').then(mod => mod.ShareDialog));


export default function TopicPage() {
  const params = useParams();
  const { articles, isLoading } = useArticles();
  const slug = params.slug as string;
  const topicName = deslugify(slug);
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredArticles = articles.filter(article =>
    article.status === 'published' &&
    (article.topics || []).some(topic => slugify(topic) === slug)
  );

  const blogPosts = filteredArticles.filter(a => a.content && a.content.length > 200);
  const vecizeler = filteredArticles.filter(a => a.prompt && (!a.content || a.content.length <= 200));

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

  const hasContent = blogPosts.length > 0 || vecizeler.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/40 py-12 md:py-24">
        <div className="container grid grid-cols-1 gap-12 px-4 md:grid-cols-3 md:px-6 lg:grid-cols-4">
          <div className="space-y-16 md:col-span-2 lg:col-span-3">
            <div className="mb-8">
              <h1 className="mb-2 font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Konu: {topicName}
              </h1>
            </div>

            {!hasContent ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Bu konuyla ilgili henüz bir içerik bulunmamaktadır.</p>
              </div>
            ) : (
              <>
                {vecizeler.length > 0 && (
                  <section className='space-y-8'>
                    <h2 className="font-headline text-3xl font-bold text-foreground">İlgili Vecizeler</h2>
                    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
                      {vecizeler.map((article) => (
                        <Link href={`/posts/${article.id}`} key={article.id}>
                          <div ref={el => cardRefs.current[article.id] = el}>
                              <VecizeCard 
                                  article={article} 
                                  onShareClick={(e) => handleShareClick(e, article)}
                                  isLink={false}
                              />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {blogPosts.length > 0 && (
                  <section className='space-y-8'>
                    <h2 className="font-headline text-3xl font-bold text-foreground">İlgili Makaleler</h2>
                    <div className="grid gap-8 md:grid-cols-1">
                      {blogPosts.map((article) => (
                         <Link key={article.id} href={`/posts/${article.id}`} className="group block">
                            <Card className="flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/50">
                                <div className="p-6 flex flex-col justify-center flex-1">
                                    <h3 className="font-headline text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors text-shadow-drop">
                                    {article.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 line-clamp-2 text-shadow-drop">
                                     {truncateWords(article.content, 100)}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {[...(article.categories || []), ...(article.topics || [])].slice(0, 3).map((tag) => (
                                            <Badge key={tag} variant="secondary">{tag}</Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center text-sm font-semibold text-primary group-hover:underline">
                                        Okumaya devam et <MoveRight className="ml-1 h-4 w-4" />
                                    </div>
                                </div>
                            </Card>
                         </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
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