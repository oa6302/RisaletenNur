```tsx
'use client';

import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Share2,
  Download,
  MessageCircle,
  Heart,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { Article } from '@/lib/placeholder-data';

import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface VecizeCardProps {
  article: Article & {
    card_scale?: number;
  };

  onShareClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;

  onDownloadClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;

  className?: string;
  isFeatured?: boolean;
  isForDownload?: boolean;
  isLink?: boolean;
}

export function VecizeCard({
  article,
  onShareClick,
  onDownloadClick,
  className,
  isFeatured = false,
  isForDownload = false,
  isLink = true,
}: VecizeCardProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // =========================================================
  // ÖLÇEK
  // =========================================================

  const scale = useMemo(() => {
    return typeof article.card_scale === 'number' &&
      article.card_scale > 0
      ? article.card_scale
      : 1;
  }, [article.card_scale]);

  // =========================================================
  // FONT
  // =========================================================

  const fontClass = useMemo(() => {
    const fontMap: Record<string, string> = {
      Rika: 'font-rika font-bold',
      Matbu: 'font-osmanlica font-bold',
      'Scheherazade New':
        'font-osmanlica font-bold',
    };

    return (
      fontMap[article.ottoman_font_family] ??
      'font-osmanlica font-bold'
    );
  }, [article.ottoman_font_family]);

  // =========================================================
  // KART YÜKSEKLİĞİ
  // =========================================================

  const minHeight = useMemo(() => {
    if (isForDownload) {
      return 'auto';
    }

    const baseHeight = isFeatured
      ? isMobile
        ? 320
        : 440
      : isMobile
        ? 280
        : 380;

    return `${baseHeight * scale}px`;
  }, [
    isForDownload,
    isFeatured,
    isMobile,
    scale,
  ]);

  // =========================================================
  // OSMANLICA FONT BOYUTU
  // =========================================================

  const ottomanFontSize = useMemo(() => {
    const baseSize =
      typeof article.ottoman_font_size === 'number'
        ? article.ottoman_font_size
        : 34;

    if (isForDownload) {
      return `${baseSize * 1.8}px`;
    }

    const responsiveScale = isMobile ? 0.8 : 1;

    return `${
      baseSize * responsiveScale * scale
    }px`;
  }, [
    article.ottoman_font_size,
    isForDownload,
    isMobile,
    scale,
  ]);

  // =========================================================
  // TÜRKÇE FONT BOYUTU
  // =========================================================

  const turkishFontSize = useMemo(() => {
    const baseSize =
      typeof article.content_font_size === 'number'
        ? article.content_font_size
        : 18;

    if (isForDownload) {
      return `${baseSize * 1.5}px`;
    }

    const responsiveScale = isMobile ? 0.9 : 1;

    return `${
      baseSize * responsiveScale * scale
    }px`;
  }, [
    article.content_font_size,
    isForDownload,
    isMobile,
    scale,
  ]);

  // =========================================================
  // PROMPT TEMİZLEME
  // =========================================================

  const cleanPrompt = useCallback(
    (text: string) => {
      if (!text) return '';

      return text
        .trim()
        .replace(
          /^["'“”„]+|["'“”„]+$/g,
          ''
        );
    },
    []
  );

  // =========================================================
  // AKSİYONLAR
  // =========================================================

  const handleActionClick = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>,
      type: 'comment' | 'like'
    ) => {
      event.preventDefault();
      event.stopPropagation();

      const messages = {
        like: {
          title: 'Beğeni Sistemi',
          description:
            'Beğeni özelliği çok yakında sizlerle olacaktır.',
        },
        comment: {
          title: 'Yorum Sistemi',
          description:
            'Yorum özelliği çok yakında sizlerle olacaktır.',
        },
      };

      toast(messages[type]);
    },
    [toast]
  );

  // =========================================================
  // PAYLAŞ
  // =========================================================

  const handleShare = useCallback(
    async (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (onShareClick) {
        onShareClick(event);
        return;
      }

      if (
        typeof window === 'undefined' ||
        typeof navigator === 'undefined'
      ) {
        return;
      }

      const url = window.location.href;

      // Native Share API
      if (
        navigator.share &&
        isMobile
      ) {
        try {
          await navigator.share({
            title:
              article.title ||
              'RisaletenNur Platformu',
            text:
              cleanPrompt(article.prompt || ''),
            url,
          });

          return;
        } catch {
          // Kullanıcı paylaşımı iptal ettiyse
          return;
        }
      }

      // Clipboard fallback
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);

          toast({
            title: 'Bağlantı Kopyalandı',
            description:
              'Vecize bağlantısı panoya kopyalandı.',
          });
        } catch {
          toast({
            title: 'Paylaşım Başarısız',
            description:
              'Bağlantı kopyalanırken bir hata oluştu.',
            variant: 'destructive',
          });
        }
      }
    },
    [
      article.title,
      article.prompt,
      cleanPrompt,
      isMobile,
      onShareClick,
      toast,
    ]
  );

  // =========================================================
  // İNDİR
  // =========================================================

  const handleDownload = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (onDownloadClick) {
        onDownloadClick(event);
        return;
      }

      toast({
        title: 'İndirme Sistemi',
        description:
          'Görsel indirme işlemi için indirme fonksiyonu bağlanmalıdır.',
      });
    },
    [onDownloadClick, toast]
  );

  // =========================================================
  // KART İÇERİĞİ
  // =========================================================

  const card = (
    <Card
      className={cn(
        'relative flex h-full w-full flex-col',
        'justify-between overflow-hidden',
        'bg-white text-center',
        'border-none',
        'transition-all duration-500',
        'group/card',

        isForDownload
          ? 'rounded-none p-16 shadow-none'
          : 'rounded-[2.5rem] p-6 md:p-8 shadow-deep',

        className
      )}
      style={{
        minHeight,
        borderRadius: isForDownload
          ? 0
          : `${2.5 * scale}rem`,
      }}
    >
      {/* =====================================================
          HOVER AKSİYONLARI
      ====================================================== */}

      {!isForDownload && (
        <div
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            gap-2
            opacity-0
            transition-all
            duration-300
            group-hover/card:opacity-100
          "
          data-html2canvas-ignore="true"
          style={{
            top: `${6 * scale}px`,
            right: `${6 * scale}px`,
          }}
        >
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Vecizeyi paylaş"
            className="
              rounded-full
              border-none
              bg-white/95
              shadow-md
              backdrop-blur-md
              transition-all
              hover:bg-primary
              hover:text-white
            "
            style={{
              width: `${32 * scale}px`,
              height: `${32 * scale}px`,
            }}
            onClick={handleShare}
          >
            <Share2
              style={{
                width: `${14 * scale}px`,
                height: `${14 * scale}px`,
              }}
            />
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Vecizeyi indir"
            className="
              rounded-full
              border-none
              bg-white/95
              shadow-md
              backdrop-blur-md
              transition-all
              hover:bg-slate-100
            "
            style={{
              width: `${32 * scale}px`,
              height: `${32 * scale}px`,
            }}
            onClick={handleDownload}
          >
            <Download
              style={{
                width: `${14 * scale}px`,
                height: `${14 * scale}px`,
              }}
              className="text-slate-600"
            />
          </Button>
        </div>
      )}

      {/* =====================================================
          ÜST ROZET
      ====================================================== */}

      <div
        className="
          flex
          w-full
          shrink-0
          flex-col
          items-center
        "
        style={{
          paddingTop: isForDownload
            ? '16px'
            : `${4 * scale}px`,
        }}
      >
        <Badge
          className="
            rounded-full
            border-none
            bg-[#f97316]
            font-black
            uppercase
            tracking-[0.25em]
            !text-white
            shadow-[0_10px_25px_rgba(249,115,22,0.35)]
            text-shadow-heavy
          "
          style={
            isForDownload
              ? {
                  fontSize: '24px',
                  padding: '16px 64px',
                }
              : {
                  fontSize: `${
                    (isMobile ? 9 : 11) *
                    scale
                  }px`,
                  paddingTop: `${
                    6 * scale
                  }px`,
                  paddingBottom: `${
                    6 * scale
                  }px`,
                  paddingLeft: `${
                    (isMobile ? 20 : 36) *
                    scale
                  }px`,
                  paddingRight: `${
                    (isMobile ? 20 : 36) *
                    scale
                  }px`,
                }
          }
        >
          {isFeatured
            ? 'GÜNÜN VECİZESİ'
            : 'HAKİKAT'}
        </Badge>
      </div>

      {/* =====================================================
          ANA METİN
      ====================================================== */}

      <div
        className="
          flex
          flex-1
          w-full
          flex-col
          items-center
          justify-center
          text-center
        "
        style={{
          gap: isForDownload
            ? '24px'
            : `${(isMobile ? 8 : 12) * scale}px`,
          marginTop: isForDownload
            ? '24px'
            : `${16 * scale}px`,
          marginBottom: isForDownload
            ? '24px'
            : `${16 * scale}px`,
          paddingLeft: isForDownload
            ? '48px'
            : `${(isMobile ? 8 : 24) * scale}px`,
          paddingRight: isForDownload
            ? '48px'
            : `${(isMobile ? 8 : 24) * scale}px`,
        }}
      >
        {/* =================================================
            OSMANLICA
        ================================================== */}

        {article.ottomanContent && (
          <p
            className={cn(
              'w-full',
              'whitespace-pre-wrap',
              'leading-[1.8]',
              'tracking-wide',
              'font-bold',
              'text-slate-900',
              'text-shadow-heavy',
              fontClass
            )}
            style={{
              direction: 'rtl',
              fontSize: ottomanFontSize,
              color:
                article.ottoman_font_color ||
                '#0f172a',
            }}
          >
            {article.ottomanContent}
          </p>
        )}

        {/* =================================================
            TÜRKÇE ANLAM
        ================================================== */}

        <div className="mx-auto w-full max-w-2xl">
          <p
            className="
              px-4
              text-balance
              font-bold
              italic
              leading-relaxed
              whitespace-pre-wrap
              text-slate-900
              text-shadow-heavy
            "
            style={{
              fontSize: turkishFontSize,
              fontFamily:
                'var(--font-inter), sans-serif',
            }}
          >
            "{cleanPrompt(article.prompt || '')}"
          </p>
        </div>
      </div>

      {/* =====================================================
          ALT ALAN
      ====================================================== */}

      <div className="mt-auto flex w-full shrink-0 flex-col items-center">
        {/* LIKE / COMMENT */}

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            text-slate-900/90
          "
          style={{
            gap: isForDownload
              ? '40px'
              : `${24 * scale}px`,
            marginBottom: isForDownload
              ? '16px'
              : `${10 * scale}px`,
          }}
        >
          {/* LIKE */}

          <button
            type="button"
            aria-label="Vecizeyi beğen"
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              border-none
              bg-transparent
              p-0
              transition-colors
              hover:text-primary
            "
            onClick={(event) =>
              handleActionClick(event, 'like')
            }
          >
            <Heart
              className="
                stroke-[2.5]
                text-shadow-heavy
              "
              style={{
                width: isForDownload
                  ? '28px'
                  : `${18 * scale}px`,
                height: isForDownload
                  ? '28px'
                  : `${18 * scale}px`,
              }}
            />

            <span
              className="
                font-extrabold
                text-shadow-heavy
              "
              style={{
                fontSize: isForDownload
                  ? '22px'
                  : `${15 * scale}px`,
              }}
            >
              0
            </span>
          </button>

          {/* COMMENT */}

          <button
            type="button"
            aria-label="Vecizeye yorum yap"
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              border-none
              bg-transparent
              p-0
              transition-colors
              hover:text-primary
            "
            onClick={(event) =>
              handleActionClick(
                event,
                'comment'
              )
            }
          >
            <MessageCircle
              className="
                stroke-[2.5]
                text-shadow-heavy
              "
              style={{
                width: isForDownload
                  ? '28px'
                  : `${18 * scale}px`,
                height: isForDownload
                  ? '28px'
                  : `${18 * scale}px`,
              }}
            />

            <span
              className="
                font-extrabold
                text-shadow-heavy
              "
              style={{
                fontSize: isForDownload
                  ? '22px'
                  : `${15 * scale}px`,
              }}
            >
              0
            </span>
          </button>
        </div>

        {/* =================================================
            KAYNAK
        ================================================== */}

        <div
          className="flex w-full items-center justify-center"
          style={{
            paddingBottom: isForDownload
              ? '16px'
              : `${6 * scale}px`,
          }}
        >
          <p
            className="
              text-center
              font-black
              uppercase
              tracking-[0.25em]
              text-slate-400
              text-shadow-heavy
              opacity-95
            "
            style={{
              fontSize: isForDownload
                ? '16px'
                : `${
                    (isMobile ? 8 : 10) *
                    scale
                  }px`,
              letterSpacing:
                isForDownload
                  ? '0.3em'
                  : undefined,
            }}
          >
            {article.source ||
              'BEDİÜZZAMAN SAİD NURSİ'}
          </p>
        </div>
      </div>
    </Card>
  );

  // =========================================================
  // LINK
  // =========================================================

  if (isLink && !isForDownload) {
    return (
      <div
        className={cn(
          'group/outer h-full w-full'
        )}
      >
        <Link
          href={`/posts/${article.id}`}
          className="
            block
            h-full
            w-full
            rounded-[2.5rem]
            outline-none
            focus-visible:ring-2
            focus-visible:ring-primary
            focus-visible:ring-offset-2
          "
          aria-label={
            article.title
              ? `${article.title} detayını görüntüle`
              : 'Vecize detayını görüntüle'
          }
        >
          {card}
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'h-full w-full',
        isForDownload && 'p-0'
      )}
    >
      {card}
    </div>
  );
}
```
