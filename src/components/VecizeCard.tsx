'use client';
import Link from 'next/navigation';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, MessageCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/placeholder-data';
import { Badge } from './ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface VecizeCardProps {
  article: Article & { card_scale?: number };
  onShareClick?: (event: React.MouseEvent) => void;
  className?: string;
  isFeatured?: boolean;
  isForDownload?: boolean;
  isLink?: boolean;
}

export function VecizeCard({
  article,
  onShareClick,
  className,
  isFeatured = false,
  isForDownload = false,
  isLink = true,
}: VecizeCardProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const scale = article.card_scale || 1.0;

  const fontClasses = {
    Rika: 'font-rika font-bold',
    Matbu: 'font-osmanlica font-bold',
    'Scheherazade New': 'font-osmanlica font-bold',
  };

  const fontClass = fontClasses[article.ottoman_font_family] || 'font-osmanlica font-bold';
  
  const getMinHeight = () => {
    if (isForDownload) return 'auto';
    const baseMin = isFeatured ? (isMobile ? 320 : 440) : (isMobile ? 280 : 380);
    return `${baseMin * scale}px`;
  };

  const getOttomanFontSize = () => {
    const baseSize = article.ottoman_font_size || 34;
    if (isForDownload) return `${baseSize * 1.8}px`;
    const mobileScale = isMobile ? 0.8 : 1.0;
    return `${baseSize * mobileScale * scale}px`;
  };

  const getTurkishFontSize = () => {
    const baseSize = article.content_font_size || 18;
    if (isForDownload) return `${baseSize * 1.5}px`;
    const mobileScale = isMobile ? 0.9 : 1.0;
    return `${baseSize * mobileScale * scale}px`;
  };

  const cleanPrompt = (text: string) => {
    if (!text) return '';
    return text.trim().replace(/^["'“”„]+|["'“”„]+$/g, '');
  };

  const handleActionClick = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'comment' || type === 'like') {
      toast({
        title: 'Yakında Sizlerle',
        description: 'Bu özellik çok yakında eklenecektir.',
      });
    } else if (type === 'download' && onShareClick) {
      onShareClick(e);
    }
  };

  const CardContent = (
    <Card
      className={cn(
        'relative flex h-full w-full flex-col transition-all duration-500 bg-white text-center group/card justify-between border-none shadow-modern',
        isForDownload ? 'rounded-none shadow-none p-16' : 'p-6 md:p-8 shadow-deep',
        className
      )}
      style={{
        minHeight: getMinHeight(),
        borderRadius: isForDownload ? '0' : `${2.5 * scale}rem`
      }}
    >
      {!isForDownload && (
        <div 
          className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-all duration-500" 
          data-html2canvas-ignore="true"
          style={{ top: `${6 * scale}px`, right: `${6 * scale}px` }}
        >
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/95 backdrop-blur-md hover:bg-primary hover:text-white border-none shadow-md rounded-full transition-all"
            style={{ width: `${32 * scale}px`, height: `${32 * scale}px` }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShareClick?.(e);
            }}
          >
            <Share2 style={{ width: `${14 * scale}px`, height: `${14 * scale}px` }} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/95 backdrop-blur-md hover:bg-slate-100 border-none shadow-md rounded-full transition-all"
            style={{ width: `${32 * scale}px`, height: `${32 * scale}px` }}
            onClick={(e) => handleActionClick(e, 'download')}
          >
            <Download style={{ width: `${14 * scale}px`, height: `${14 * scale}px` }} className="text-slate-600" />
          </Button>
        </div>
      )}

      {/* Üst Rozet Bölümü */}
      <div 
        className={cn("w-full flex flex-col items-center shrink-0", isForDownload ? "pt-4" : "pt-2")}
        style={!isForDownload ? { paddingTop: `${4 * scale}px` } : undefined}
      >
        <Badge 
          className="bg-[#f97316] hover:bg-[#f97316] !text-white font-black uppercase tracking-[0.25em] rounded-full border-none shadow-[0_10px_25px_rgba(249,115,22,0.35)] text-shadow-heavy"
          style={!isForDownload ? {
            fontSize: `${(isMobile ? 9 : 11) * scale}px`,
            paddingTop: `${6 * scale}px`,
            paddingBottom: `${6 * scale}px`,
            paddingLeft: `${(isMobile ? 20 : 36) * scale}px`,
            paddingRight: `${(isMobile ? 20 : 36) * scale}px`
          } : {
            fontSize: '24px',
            padding: '16px 64px'
          }}
        >
          {isFeatured ? "GÜNÜN VECİZESİ" : "HAKİKAT"}
        </Badge>
      </div>

      {/* Orta Metin Alanı */}
      <div 
        className="flex-grow flex flex-col items-center w-full justify-center my-4"
        style={!isForDownload ? {
          gap: `${(isMobile ? 8 : 12) * scale}px`,
          paddingLeft: `${(isMobile ? 8 : 24) * scale}px`,
          paddingRight: `${(isMobile ? 8 : 24) * scale}px`
        } : { 
          gap: '24px', 
          padding: '16px 48px' 
        }}
      >
        {article.ottomanContent && (
          <p
            className={cn(
              'leading-[1.8] transition-colors duration-500 w-full whitespace-pre-wrap text-shadow-heavy text-slate-900 tracking-wide font-bold',
              fontClass
            )}
            style={{
              direction: 'rtl',
              fontSize: getOttomanFontSize(),
              color: article.ottoman_font_color || '#0f172a'
            }}
          >
            {article.ottomanContent}
          </p>
        )}

        <div className="w-full max-w-2xl mx-auto">
          <p
            className="text-balance text-slate-900 font-bold italic leading-relaxed whitespace-pre-wrap text-shadow-heavy px-4"
            style={{ 
              fontSize: getTurkishFontSize(),
              fontFamily: 'var(--font-inter), sans-serif'
            }}
          >
            "{cleanPrompt(article.prompt || '')}"
          </p>
        </div>
      </div>

      {/* Alt Etkileşim ve Kaynak Bilgisi */}
      <div className="flex flex-col items-center w-full shrink-0 mt-auto">
        
        {/* İkonlar */}
        <div 
          className="w-full flex items-center justify-center gap-6 text-slate-900/90 mb-3"
          style={!isForDownload ? { 
            gap: `${24 * scale}px`,
            marginBottom: `${10 * scale}px`
          } : { gap: '40px', marginBottom: '16px' }}
        >
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={(e) => handleActionClick(e, 'like')}>
            <Heart style={!isForDownload ? { width: `${18 * scale}px`, height: `${18 * scale}px` } : { width: '28px', height: '28px' }} className="stroke-[2.5] text-shadow-heavy" />
            <span className="font-extrabold text-shadow-heavy" style={!isForDownload ? { fontSize: `${15 * scale}px` } : { fontSize: '22px' }}>0</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={(e) => handleActionClick(e, 'comment')}>
            <MessageCircle style={!isForDownload ? { width: `${18 * scale}px`, height: `${18 * scale}px` } : { width: '28px', height: '28px' }} className="stroke-[2.5] text-shadow-heavy" />
            <span className="font-extrabold text-shadow-heavy" style={!isForDownload ? { fontSize: `${15 * scale}px` } : { fontSize: '22px' }}>0</span>
          </div>
        </div>

        {/* Kaynak Metni */}
        <div 
          className={cn("w-full flex items-center justify-center", isForDownload ? "pb-4" : "pb-2")}
          style={!isForDownload ? { paddingBottom: `${6 * scale}px` } : undefined}
        >
          <p 
            className="text-slate-400 font-black tracking-[0.25em] uppercase text-center text-shadow-heavy opacity-95"
            style={!isForDownload ? { 
              fontSize: `${(isMobile ? 8 : 10) * scale}px` 
            } : {
              fontSize: '16px',
              letterSpacing: '0.3em'
            }}
          >
            {article.source || 'BEDİÜZZAMAN SAİD NURSİ'}
          </p>
        </div>

      </div>
    </Card>
  );

  return (
    <div className={cn("group/outer h-full w-full flex flex-col", isForDownload && "p-0")}>
      {isLink && !isForDownload ? (
        <a href={`/posts/${article.id}`} className="h-full w-full block">
          {CardContent}
        </a>
      ) : (
        CardContent
      )}
    </div>
  );
}
