'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header';
import { ArrowLeft, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useArticles } from '@/context/article-context';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { VecizeCard } from '@/components/VecizeCard';
import { HakikatKart, HakikatKartProps } from '@/components/HakikatKart';
import { Separator } from '@/components/ui/separator';

const Footer = dynamic(() => import('@/components/footer'));
const ShareDialog = dynamic(() => import('@/components/ShareDialog').then(mod => mod.ShareDialog));

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { articles, isLoading } = useArticles();
  const article = articles.find((a) => a.id === id);
  const [isMounted, setIsMounted] = useState(false);
  const [viewScale, setViewScale] = useState(100);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container mx-auto max-w-4xl space-y-8">
            <Skeleton className="h-[600px] w-full rounded-[4rem]" />
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">İçerik Bulunamadı</h2>
            <Button variant="outline" onClick={() => router.back()}>Geri Dön</Button>
          </div>
        </main>
      </div>
    );
  }

  const handleZoomIn = () => {
    setViewScale((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setViewScale((prev) => Math.max(prev - 10, 60));
  };

  let hakikatKartlari: HakikatKartProps[] = [];
  try {
    if (article.content.startsWith('[')) {
      hakikatKartlari = JSON.parse(article.content);
    }
  } catch (e) {
    console.warn("Kart verisi çözümlenemedi, standart HTML olarak işleniyor.");
  }

  const zoomedArticle = {
    ...article,
    ottoman_font_size: (article.ottoman_font_size || 36) * (viewScale / 100),
    content_font_size: (article.content_font_size || 24) * (viewScale / 100),
    card_scale: viewScale / 100
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfc]">
      <Header />
      <main className="flex-1 py-6 md:py-12">
        <div className="container mx-auto max-w-xl space-y-8 px-4" ref={containerRef}>
          
          <div className="space-y-4">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-3 text-slate-700 font-semibold text-lg hover:opacity-80 transition-all pt-2"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800" /> Geri
            </button>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center bg-white border border-slate-100 rounded-full shadow-sm px-3 py-1.5 gap-4">
                <button 
                  onClick={handleZoomOut} 
                  className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Küçült"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs font-black text-amber-500 min-w-[35px] text-center tracking-wide">
                  %{viewScale}
                </span>
                <button 
                  onClick={handleZoomIn} 
                  className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Büyüt"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              <button 
                onClick={() => setIsShareOpen(true)}
                className="flex items-center gap-2 bg-[#f97316] text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-full shadow-md hover:bg-[#f97316]/90 transition-all"
              >
                <Share2 className="h-4 w-4" /> TÜMÜNÜ PAYLAŞ
              </button>
            </div>
          </div>

          <div className="w-full transition-all duration-300">
            <VecizeCard 
              article={zoomedArticle} 
              isFeatured={true}
              isLink={false}
            />
          </div>

          <div className="space-y-20 pt-8">
              {hakikatKartlari.length > 0 ? (
                <div className="grid gap-16 justify-center">
                  {hakikatKartlari.map((card, idx) => (
                    <HakikatKart 
                      key={idx} 
                      {...card} 
                      scale={viewScale / 100}
                    />
                  ))}
                </div>
              ) : (
                <div className="post-content bg-white p-8 rounded-[2.5rem] shadow-modern border border-slate-50" dangerouslySetInnerHTML={{ __html: article.content }} />
              )}
          </div>

          <Separator className="bg-slate-100" />

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-12">
              {article.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="px-5 py-1.5 rounded-full bg-slate-100 text-slate-500 border-none font-bold text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {isShareOpen && (
        <Suspense>
          <ShareDialog
            article={article}
            isOpen={isShareOpen}
            onOpenChange={setIsShareOpen}
            triggerRef={containerRef}
          />
        </Suspense>
      )}

      <Suspense>
        <Footer />
      </Suspense>
    </div>
  );
}
