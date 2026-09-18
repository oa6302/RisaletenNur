```tsx
'use client';

import Link from 'next/link';
import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Share2,
  Download,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/placeholder-data';
import { Badge } from './ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface VecizeCardProps {
  article: Article & { card_scale?: number };

  /**
   * Paylaş butonuna basıldığında çalışır.
   */
  onShareClick?: (event: React.MouseEvent) => void;

  /**
   * İndirme butonuna basıldığında çalışır.
   * Eğer verilmezse bilgilendirme mesajı gösterilir.
   */
  onDownloadClick?: (event: React.MouseEvent) => void;

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

  const scale =
    typeof article.card_scale === 'number' && article.card_scale > 0
      ? article.card_scale
      : 1;

  /**
   * Osmanlıca font sınıfları.
   */
  const fontClasses: Record<string, string> = {
    Rika: 'font-rika font-bold',
    Matbu: 'font-osmanlica font-bold',
    'Scheherazade New': 'font-osmanlica font-bold',
  };

  const fontClass =
    fontClasses[article.ottoman_font_family] ||
    'font-osmanlica font-bold';

  /**
   * Kart minimum yüksekliği.
   */
  const getMinHeight = useCallback(() => {
    if (isForDownload) {
      return 'auto';
    }

    const baseMin = isFeatured
      ? isMobile
        ? 320
        : 440
      : isMobile
        ? 280
        : 380;

    return `${baseMin * scale}px`;
  }, [isForDownload, isFeatured, isMobile, scale]);

  /**
   * Osmanlıca metin boyutu.
   */
  const getOttomanFontSize = useCallback(() => {
    const baseSize =
      typeof article.ottoman_font_size === 'number'
        ? article.ottoman_font_size
        : 34;

    if (isForDownload) {
      return `${baseSize * 1.8}px`;
    }

    const mobileScale = isMobile ? 0.8 : 1;

    return `${baseSize * mobileScale * scale}px`;
  }, [
    article.ottoman_font_size,
    isForDownload,
    isMobile,
    scale,
  ]);

  /**
   * Türkçe metin boyutu.
   */
  const getTurkishFontSize = useCallback(() => {
    const baseSize =
      typeof article.content_font_size === 'number'
        ? article.content_font_size
        : 18;

    if (isForDownload) {
      return `${baseSize * 1.5}px`;
    }

    const mobileScale = isMobile ? 0.9 : 1;

    return `${baseSize * mobileScale * scale}px`;
  }, [
    article.content_font_size,
    isForDownload,
    isMobile,
    scale,
  ]);

  /**
   * Prompt içerisindeki gereksiz dış tırnakları temizler.
   */
  const cleanPrompt = useCallback((text: string) => {
    if (!text) return '';

    return text
      .trim()
      .replace(/^["'“”„]+|["'“”„]+$/g, '');
  }, []);

  /**
   * Like / comment gibi henüz aktif olmayan aksiyonlar.
   */
  const handleActionClick = (
    event: React.MouseEvent,
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
  };

  /**
   * Paylaşma işlemi.
   */
  const handleShare = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (onShareClick) {
      onShareClick(event);
      return;
    }

    /**
     * Parent tarafından paylaşım fonksiyonu verilmemişse
     * mevcut URL'yi panoya kopyalamayı deneriz.
     */
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard?.writeText
    ) {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Bağlantı Kopyalandı',
            description:
              'Vecize bağlantısı panoya kopyalandı.',
          });
        })
        .catch(() => {
          toast({
            title: 'Paylaşım Başarısız',
            description:
              'Bağlantı kopyalanırken bir hata oluştu.',
            variant: 'destructive',
          });
        });
    }
  };

  /**
   * İndirme işlemi.
   */
  const handleDownload = (event: React.MouseEvent) => {
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
  };

  /**
   * Kartın ana içeriği.
   */
  const CardContent = (
    <Card
      className={cn(
        `
          relative
          flex
          h-full
          w-full
          flex-col
          justify-between
          bg-white
          text-center
          transition-all
          duration-500
          group/card
          border-none
        `,
        isForDownload
          ? 'rounded-none shadow-none p-16'
          : 'p-6 md:p-8 shadow-deep',
        className
      )}
      style={{
        minHeight: getMinHeight(),
        borderRadius: isForDownload
          ? '0'
          : `${2.5 * scale}rem`,
      }}
    >
      {/* =======================================================
          HOVER AKSİYONLARI
      ======================================================== */}
      {!isForDownload && (
        <div
          className="
            absolute
            top-4
            right-4
            z-10
            flex
            gap-2
            opacity-0
            group-hover/card:opacity-100
            transition-all
            duration-500
          "
          data-html2canvas-ignore="true"
          style={{
            top: `${6 * scale}px`,
            right: `${6 * scale}px`,
          }}
        >
          {/* PAYLAŞ */}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Vecizeyi paylaş"
            className="
              h-8
              w-8
              bg-white/95
              backdrop-blur-md
              hover:bg-primary
              hover:text-white
              border-none
              shadow-md
              rounded-full
              transition-all
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

          {/* İNDİR */}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Vecizeyi indir"
            className="
              h-8
              w-8
              bg-white/95
              backdrop-blur-md
              hover:bg-slate-100
              border-none
              shadow-md
              rounded-full
              transition-all
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

      {/* =======================================================
          ÜST ROZET
      ======================================================== */}
      <div
        className={cn(
          'w-full flex flex-col items-center shrink-0',
          isForDownload ? 'pt-4' : 'pt-2'
        )}
        style={
          !isForDownload
            ? {
                paddingTop: `${4 * scale}px`,
              }
            : undefined
        }
      >
        <Badge
          className="
            bg-[#f97316]
            hover:bg-[#f97316]
            !text-white
            font-black
            uppercase
            tracking-[0.25em]
            rounded-full
            border-none
            shadow-[0_10px_25px_rgba(249,115,22,0.35)]
            text-shadow-heavy
          "
          style={
            !isForDownload
              ? {
                  fontSize: `${
                    (isMobile ? 9 : 11) * scale
                  }px`,
                  paddingTop: `${6 * scale}px`,
                  paddingBottom: `${6 * scale}px`,
                  paddingLeft: `${
                    (isMobile ? 20 : 36) * scale
                  }px`,
                  paddingRight: `${
                    (isMobile ? 20 : 36) * scale
                  }px`,
                }
              : {
                  fontSize: '24px',
                  padding: '16px 64px',
                }
          }
        >
          {isFeatured ? 'GÜNÜN VECİZESİ' : 'HAKİKAT'}
        </Badge>
      </div>

      {/* =======================================================
          ORTA METİN ALANI
      ======================================================== */}
      <div
        className="
          flex-grow
          flex
          flex-col
          items-center
          justify-center
          w-full
          my-4
        "
        style={
          !isForDownload
            ? {
                gap: `${(isMobile ? 8 : 12) * scale}px`,
                paddingLeft: `${
                  (isMobile ? 8 : 24) * scale
                }px`,
                paddingRight: `${
                  (isMobile ? 8 : 24) * scale
                }px`,
              }
            : {
                gap: '24px',
                padding: '16px 48px',
              }
        }
      >
        {/* OSMANLICA / RİKA */}
        {article.ottomanContent && (
          <p
            className={cn(
              `
                leading-[1.8]
                transition-colors
                duration-500
                w-full
                whitespace-pre-wrap
                text-shadow-heavy
                text-slate-900
                tracking-wide
                font-bold
              `,
              fontClass
            )}
            style={{
              direction: 'rtl',
              fontSize: getOttomanFontSize(),
              color:
                article.ottoman_font_color ||
                '#0f172a',
            }}
          >
            {article.ottomanContent}
          </p>
        )}

        {/* TÜRKÇE ANLAMI */}
        <div className="w-full max-w-2xl mx-auto">
          <p
            className="
              text-balance
              text-slate-900
              font-bold
              italic
              leading-relaxed
              whitespace-pre-wrap
              text-shadow-heavy
              px-4
            "
            style={{
              fontSize: getTurkishFontSize(),
              fontFamily:
                'var(--font-inter), sans-serif',
            }}
          >
            "{cleanPrompt(article.prompt || '')}"
          </p>
        </div>
      </div>

      {/* =======================================================
          ALT ETKİLEŞİM
      ======================================================== */}
      <div className="flex flex-col items-center w-full shrink-0 mt-auto">
        {/* LIKE / COMMENT */}
        <div
          className="
            w-full
            flex
            items-center
            justify-center
            text-slate-900/90
          "
          style={
            !isForDownload
              ? {
                  gap: `${24 * scale}px`,
                  marginBottom: `${10 * scale}px`,
                }
              : {
                  gap: '40px',
                  marginBottom: '16px',
                }
          }
        >
          {/* BEĞENİ */}
          <button
            type="button"
            aria-label="Vecizeyi beğen"
            className="
              flex
              items-center
              gap-2
              cursor-pointer
              hover:text-primary
              transition-colors
              bg-transparent
              border-none
              p-0
            "
            onClick={(event) =>
              handleActionClick(event, 'like')
            }
          >
            <Heart
              style={
                !isForDownload
                  ? {
                      width: `${18 * scale}px`,
                      height: `${18 * scale}px`,
                    }
                  : {
                      width: '28px',
                      height: '28px',
                    }
              }
              className="
                stroke-[2.5]
                text-shadow-heavy
              "
            />

            <span
              className="
                font-extrabold
                text-shadow-heavy
              "
              style={
                !isForDownload
                  ? {
                      fontSize: `${15 * scale}px`,
                    }
                  : {
                      fontSize: '22px',
                    }
              }
            >
              0
            </span>
          </button>

          {/* YORUM */}
          <button
            type="button"
            aria-label="Vecizeye yorum yap"
            className="
              flex
              items-center
              gap-2
              cursor-pointer
              hover:text-primary
              transition-colors
              bg-transparent
              border-none
              p-0
            "
            onClick={(event) =>
              handleActionClick(event, 'comment')
            }
          >
            <MessageCircle
              style={
                !isForDownload
                  ? {
                      width: `${18 * scale}px`,
                      height: `${18 * scale}px`,
                    }
                  : {
                      width: '28px',
                      height: '28px',
                    }
              }
              className="
                stroke-[2.5]
                text-shadow-heavy
              "
            />

            <span
              className="
                font-extrabold
                text-shadow-heavy
              "
              style={
                !isForDownload
                  ? {
                      fontSize: `${15 * scale}px`,
                    }
                  : {
                      fontSize: '22px',
                    }
              }
            >
              0
            </span>
          </button>
        </div>

        {/* =====================================================
            KAYNAK
        ====================================================== */}
        <div
          className={cn(
            'w-full flex items-center justify-center',
            isForDownload ? 'pb-4' : 'pb-2'
          )}
          style={
            !isForDownload
              ? {
                  paddingBottom: `${6 * scale}px`,
                }
              : undefined
          }
        >
          <p
            className="
              text-slate-400
              font-black
              tracking-[0.25em]
              uppercase
              text-center
              text-shadow-heavy
              opacity-95
            "
            style={
              !isForDownload
                ? {
                    fontSize: `${
                      (isMobile ? 8 : 10) * scale
                    }px`,
                  }
                : {
                    fontSize: '16px',
                    letterSpacing: '0.3em',
                  }
            }
          >
            {article.source ||
              'BEDİÜZZAMAN SAİD NURSİ'}
          </p>
        </div>
      </div>
    </Card>
  );

  {/* =========================================================
      KARTI LİNK İÇİNE AL
  ========================================================== */}

  return (
    <div
      className={cn(
        'group/outer h-full w-full flex flex-col',
        isForDownload && 'p-0'
      )}
    >
      {isLink && !isForDownload ? (
        <Link
          href={`/posts/${article.id}`}
          className="h-full w-full block"
          aria-label={`${article.title || 'Vecize'} detayını görüntüle`}
        >
          {CardContent}
        </Link>
      ) : (
        CardContent
      )}
    </div>
  );
}
```
