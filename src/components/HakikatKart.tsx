```tsx
'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Download,
  Share2,
  Quote,
  Image as ImageIcon,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { slugify } from '@/lib/utils';

export interface HakikatKartProps {
  no: string;
  title: string;
  badge: string;
  problem: string;

  hikmet?: string;
  hikmetKaynak?: string;

  ayet?: string;
  ayetKaynak?: string;

  hadis?: string;
  hadisKaynak?: string;

  maddeler: {
    simge: string;
    etiket: string;
    aciklama: string;
  }[];

  scale?: number;
}

const DEEP_SHADOW_STYLE =
  'text-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2), 0px 12px 32px rgba(0, 0, 0, 0.15);';

/**
 * HTML içerisine güvenli şekilde metin yerleştirmek için kullanılır.
 */
function escapeHtml(value: string = ''): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function HakikatKart({
  no,
  title,
  badge,
  problem,
  hikmet,
  hikmetKaynak,
  ayet,
  ayetKaynak,
  hadis,
  hadisKaynak,
  maddeler,
  scale = 1,
}: HakikatKartProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Sosyal medya görseli oluşturur.
   *
   * story  -> 1080x1920
   * square -> 1080x1080
   */
  const handleDownload = async (format: 'story' | 'square') => {
    if (isDownloading) return;

    setIsDownloading(true);

    const isStory = format === 'story';

    const width = 1080;
    const height = isStory ? 1920 : 1080;

    let renderNode: HTMLDivElement | null = null;

    try {
      toast({
        title: isStory
          ? 'Hikaye Formatı Hazırlanıyor'
          : 'Kare Post Hazırlanıyor',
        description:
          'Sosyal medya şablonu yüksek çözünürlükte oluşturuluyor...',
      });

      /*
       * Kullanıcı içeriklerini HTML içine bastığımız için
       * escapeHtml ile güvenli hâle getiriyoruz.
       */
      const safeNo = escapeHtml(no);
      const safeTitle = escapeHtml(title);
      const safeBadge = escapeHtml(badge);
      const safeProblem = escapeHtml(problem);

      const safeHikmet = escapeHtml(hikmet);
      const safeHikmetKaynak = escapeHtml(
        hikmetKaynak || 'Bediüzzaman Said Nursî'
      );

      const safeAyet = escapeHtml(ayet);
      const safeAyetKaynak = escapeHtml(ayetKaynak);

      const safeHadis = escapeHtml(hadis);
      const safeHadisKaynak = escapeHtml(hadisKaynak);

      renderNode = document.createElement('div');

      renderNode.className = 'story-card-modern';

      Object.assign(renderNode.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: '99999',
        opacity: '0.01',
        pointerEvents: 'none',
        width: `${width}px`,
        height: `${height}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#090d16',
        color: '#ffffff',
        padding: isStory ? '120px 75px' : '75px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      });

      const hikmetHtml = hikmet
        ? `
          <div
            style="
              background: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.08);
              padding: 35px 40px;
              border-radius: 32px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            "
          >
            <p
              style="
                font-size: ${isStory ? '2rem' : '1.5rem'};
                font-style: italic;
                font-weight: bold;
                line-height: 1.4;
                color: #f8fafc;
                ${DEEP_SHADOW_STYLE}
                margin: 0;
              "
            >
              "${safeHikmet}"
            </p>

            <p
              style="
                font-size: ${isStory ? '1.4rem' : '1.1rem'};
                font-weight: 900;
                color: #f97316;
                text-transform: uppercase;
                text-align: right;
                margin-top: 15px;
                letter-spacing: 2px;
                margin-bottom: 0;
              "
            >
              — ${safeHikmetKaynak}
            </p>
          </div>
        `
        : '';

      const ayetHtml = ayet
        ? `
          <div
            style="
              background: rgba(16,185,129,0.05);
              border: 1px solid rgba(16,185,129,0.2);
              padding: 35px 40px;
              border-radius: 32px;
            "
          >
            <p
              style="
                font-size: ${isStory ? '2rem' : '1.5rem'};
                font-weight: bold;
                line-height: 1.4;
                color: #f8fafc;
                ${DEEP_SHADOW_STYLE}
                margin: 0;
              "
            >
              "${safeAyet}"
            </p>

            ${
              ayetKaynak
                ? `
                  <p
                    style="
                      font-size: ${isStory ? '1.4rem' : '1.1rem'};
                      font-weight: 900;
                      color: #34d399;
                      text-transform: uppercase;
                      text-align: right;
                      margin-top: 15px;
                      margin-bottom: 0;
                    "
                  >
                    — ${safeAyetKaynak}
                  </p>
                `
                : ''
            }
          </div>
        `
        : '';

      const hadisHtml = hadis
        ? `
          <div
            style="
              background: rgba(59,130,246,0.05);
              border: 1px solid rgba(59,130,246,0.2);
              padding: 35px 40px;
              border-radius: 32px;
            "
          >
            <p
              style="
                font-size: ${isStory ? '2rem' : '1.5rem'};
                font-weight: bold;
                line-height: 1.4;
                color: #f8fafc;
                ${DEEP_SHADOW_STYLE}
                margin: 0;
              "
            >
              "${safeHadis}"
            </p>

            ${
              hadisKaynak
                ? `
                  <p
                    style="
                      font-size: ${isStory ? '1.4rem' : '1.1rem'};
                      font-weight: 900;
                      color: #60a5fa;
                      text-transform: uppercase;
                      text-align: right;
                      margin-top: 15px;
                      margin-bottom: 0;
                    "
                  >
                    — ${safeHadisKaynak}
                  </p>
                `
                : ''
            }
          </div>
        `
        : '';

      const maddelerHtml = maddeler
        .map((item) => {
          const safeSimge = escapeHtml(item.simge);
          const safeEtiket = escapeHtml(item.etiket);
          const safeAciklama = escapeHtml(item.aciklama);

          return `
            <div
              style="
                display: flex;
                align-items: center;
                gap: 25px;
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(255,255,255,0.06);
                padding: 25px;
                border-radius: 24px;
              "
            >
              <span
                style="
                  font-size: 3.5rem;
                  flex-shrink: 0;
                  line-height: 1;
                "
              >
                ${safeSimge}
              </span>

              <div
                style="
                  font-size: ${isStory ? '1.8rem' : '1.4rem'};
                  line-height: 1.4;
                "
              >
                <strong
                  style="
                    color: #f97316;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 6px;
                    font-size: ${isStory ? '1.4rem' : '1.1rem'};
                    letter-spacing: 1px;
                  "
                >
                  ${safeEtiket}
                </strong>

                <span
                  style="
                    color: #cbd5e1;
                    font-weight: 700;
                    ${DEEP_SHADOW_STYLE}
                  "
                >
                  ${safeAciklama}
                </span>
              </div>
            </div>
          `;
        })
        .join('');

      renderNode.innerHTML = `
        <!-- HEADER -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          "
        >
          <span
            style="
              background: rgba(249,115,22,0.15);
              color: #f97316;
              border: 1px solid rgba(249,115,22,0.3);
              padding: 12px 32px;
              border-radius: 9999px;
              font-size: 20px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 3px;
              ${DEEP_SHADOW_STYLE}
            "
          >
            ${safeBadge}
          </span>

          <span
            style="
              color: rgba(255,255,255,0.1);
              font-size: 64px;
              font-weight: 900;
            "
          >
            ${safeNo}
          </span>
        </div>

        <!-- CONTENT -->
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: ${isStory ? '50px' : '30px'};
            flex-grow: 1;
            margin: 40px 0;
            min-height: 0;
          "
        >
          <!-- TITLE -->
          <div>
            <h2
              style="
                font-size: ${isStory ? '5rem' : '3.5rem'};
                font-weight: 900;
                margin: 0 0 25px 0;
                text-align: center;
                text-transform: uppercase;
                line-height: 1.1;
                color: #ffffff;
                ${DEEP_SHADOW_STYLE}
              "
            >
              ${safeTitle}
            </h2>

            <p
              style="
                font-size: ${isStory ? '2.4rem' : '1.8rem'};
                line-height: 1.5;
                text-align: center;
                font-style: italic;
                color: #cbd5e1;
                font-weight: 700;
                ${DEEP_SHADOW_STYLE}
                margin: 0;
              "
            >
              ${safeProblem}
            </p>
          </div>

          <!-- SOURCES -->
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 25px;
            "
          >
            ${hikmetHtml}
            ${ayetHtml}
            ${hadisHtml}
          </div>

          <!-- ACTION POINTS -->
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 20px;
            "
          >
            ${maddelerHtml}
          </div>
        </div>

        <!-- FOOTER -->
        <div
          style="
            text-align: center;
            color: #475569;
            font-size: 1.4rem;
            font-weight: 900;
            letter-spacing: 5px;
            text-transform: uppercase;
            ${DEEP_SHADOW_STYLE}
          "
        >
          RISALETENNUR
        </div>
      `;

      document.body.appendChild(renderNode);

      /*
       * Fontların ve DOM'un tamamen hazırlanması için
       * kısa bir bekleme.
       */
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(renderNode, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#090d16',
        width,
        height,
        logging: false,
        imageTimeout: 15000,
        removeContainer: true,
      });

      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');

      link.href = image;
      link.download = `hakikat-${slugify(
        no
      )}-${slugify(title)}-${format}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'İndirme Başarılı',
        description: 'Görsel cihazınıza kaydedildi.',
      });
    } catch (error) {
      console.error('Hakikat kartı indirme hatası:', error);

      toast({
        title: 'Görsel Oluşturulamadı',
        description:
          'Görsel hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      /*
       * Hata oluşsa bile oluşturduğumuz geçici DOM'u temizle.
       */
      if (renderNode?.parentNode) {
        renderNode.parentNode.removeChild(renderNode);
      }

      setIsDownloading(false);
    }
  };

  /**
   * Kartı paylaşır.
   */
  const handleShare = async () => {
    const shareData: ShareData = {
      title,
      text: problem,
      url: window.location.href,
    };

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
        return;
      }

      if (
        typeof navigator !== 'undefined' &&
        navigator.share
      ) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);

        toast({
          title: 'Bağlantı Kopyalandı',
          description: 'Kart bağlantısı panoya kopyalandı.',
        });

        return;
      }

      throw new Error('Paylaşım ve clipboard desteği bulunamadı.');
    } catch (error) {
      /*
       * Kullanıcı paylaşım penceresini kapattıysa hata mesajı
       * göstermiyoruz.
       */
      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      console.error('Paylaşım hatası:', error);

      toast({
        title: 'Paylaşım Başarısız',
        description:
          'Bağlantı paylaşılırken bir sorun oluştu.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className="
        w-full
        max-w-[720px]
        mx-auto
        bg-white
        border
        border-slate-100
        shadow-deep
        flex
        flex-col
        transition-all
        duration-500
        hover:-translate-y-1
        overflow-hidden
      "
      style={{
        borderRadius: `${3.5 * scale}rem`,
        padding: `${(isMobile ? 32 : 64) * scale}px`,
      }}
    >
      {/* HEADER */}
      <div
        className="w-full flex justify-between items-center"
        style={{
          marginBottom: `${40 * scale}px`,
        }}
      >
        <span
          className="
            bg-primary/10
            text-primary
            rounded-full
            font-black
            tracking-[0.2em]
            uppercase
            border
            border-primary/20
            shadow-sm
            text-shadow-heavy
          "
          style={{
            fontSize: `${(isMobile ? 11 : 14) * scale}px`,
            padding: `${(isMobile ? 6 : 10) * scale}px ${
              (isMobile ? 20 : 32) * scale
            }px`,
          }}
        >
          {badge}
        </span>

        <span
          className="text-slate-100 font-black leading-none"
          style={{
            fontSize: `${64 * scale}px`,
          }}
        >
          {no}
        </span>
      </div>

      {/* TITLE */}
      <h2
        className="
          font-black
          text-slate-900
          tracking-tighter
          text-center
          uppercase
          leading-[1.1]
          text-shadow-heavy
        "
        style={{
          fontSize: `${(isMobile ? 28 : 42) * scale}px`,
          marginBottom: `${24 * scale}px`,
        }}
      >
        {title}
      </h2>

      {/* PROBLEM */}
      <p
        className="
          text-slate-700
          leading-relaxed
          font-bold
          italic
          text-center
          text-shadow-heavy
        "
        style={{
          fontSize: `${(isMobile ? 18 : 24) * scale}px`,
          marginBottom: `${48 * scale}px`,
          padding: `0 ${(isMobile ? 8 : 16) * scale}px`,
        }}
      >
        "{problem}"
      </p>

      {/* SOURCES */}
      <div
        className="w-full flex flex-col"
        style={{
          gap: `${32 * scale}px`,
          marginBottom: `${48 * scale}px`,
        }}
      >
        {/* HİKMET */}
        {hikmet && (
          <div
            className="
              bg-slate-50
              border
              border-slate-100
              relative
              text-left
              shadow-deep
            "
            style={{
              padding: `${32 * scale}px`,
              borderRadius: `${2.5 * scale}rem`,
            }}
          >
            <Quote
              className="absolute pointer-events-none"
              style={{
                top: `${20 * scale}px`,
                right: `${24 * scale}px`,
                height: `${48 * scale}px`,
                width: `${48 * scale}px`,
                opacity: 0.03,
              }}
            />

            <p
              className="
                italic
                font-bold
                text-slate-800
                leading-relaxed
                text-shadow-heavy
              "
              style={{
                fontSize: `${20 * scale}px`,
              }}
            >
              "{hikmet}"
            </p>

            {hikmetKaynak && (
              <p
                className="
                  font-black
                  text-primary
                  uppercase
                  tracking-[0.2em]
                  text-right
                "
                style={{
                  fontSize: `${13 * scale}px`,
                  marginTop: `${16 * scale}px`,
                }}
              >
                — {hikmetKaynak}
              </p>
            )}
          </div>
        )}

        {/* AYET */}
        {ayet && (
          <div
            className="
              bg-emerald-50/50
              border
              border-emerald-100
              relative
              text-left
              shadow-sm
            "
            style={{
              padding: `${32 * scale}px`,
              borderRadius: `${2.5 * scale}rem`,
            }}
          >
            <p
              className="
                font-bold
                text-emerald-900
                leading-relaxed
                text-shadow-heavy
              "
              style={{
                fontSize: `${20 * scale}px`,
              }}
            >
              "{ayet}"
            </p>

            {ayetKaynak && (
              <p
                className="
                  font-black
                  text-emerald-600
                  uppercase
                  tracking-widest
                  text-right
                "
                style={{
                  fontSize: `${13 * scale}px`,
                  marginTop: `${16 * scale}px`,
                }}
              >
                — {ayetKaynak}
              </p>
            )}
          </div>
        )}

        {/* HADİS */}
        {hadis && (
          <div
            className="
              bg-blue-50/50
              border
              border-blue-100
              relative
              text-left
              shadow-sm
            "
            style={{
              padding: `${32 * scale}px`,
              borderRadius: `${2.5 * scale}rem`,
            }}
          >
            <p
              className="
                font-bold
                text-blue-900
                leading-relaxed
                text-shadow-heavy
              "
              style={{
                fontSize: `${20 * scale}px`,
              }}
            >
              "{hadis}"
            </p>

            {hadisKaynak && (
              <p
                className="
                  font-black
                  text-blue-600
                  uppercase
                  tracking-widest
                  text-right
                "
                style={{
                  fontSize: `${13 * scale}px`,
                  marginTop: `${16 * scale}px`,
                }}
              >
                — {hadisKaynak}
              </p>
            )}
          </div>
        )}
      </div>

      {/* MADDELER */}
      <div
        className="w-full flex flex-col text-left"
        style={{
          gap: `${24 * scale}px`,
          marginBottom: `${56 * scale}px`,
        }}
      >
        {maddeler.map((item, index) => (
          <div
            key={`${item.etiket}-${index}`}
            className="
              flex
              items-start
              bg-slate-50/40
              hover:bg-slate-50
              transition-colors
              shadow-sm
            "
            style={{
              padding: `${20 * scale}px`,
              borderRadius: `${1.8 * scale}rem`,
              gap: `${24 * scale}px`,
            }}
          >
            <span
              className="shrink-0 mt-1"
              style={{
                fontSize: `${42 * scale}px`,
                lineHeight: 1,
              }}
            >
              {item.simge}
            </span>

            <div className="min-w-0">
              <span
                className="
                  font-black
                  text-primary
                  uppercase
                  tracking-widest
                  block
                "
                style={{
                  fontSize: `${14 * scale}px`,
                  marginBottom: `${6 * scale}px`,
                }}
              >
                {item.etiket}
              </span>

              <p
                className="
                  text-slate-700
                  font-bold
                  leading-relaxed
                  text-shadow-heavy
                  m-0
                "
                style={{
                  fontSize: `${19 * scale}px`,
                }}
              >
                {item.aciklama}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-center
          border-t
          border-slate-100
        "
        style={{
          gap: `${16 * scale}px`,
          paddingTop: `${32 * scale}px`,
        }}
      >
        {/* PAYLAŞ */}
        <button
          type="button"
          onClick={handleShare}
          className="
            flex
            items-center
            gap-2
            font-black
            tracking-widest
            text-slate-400
            hover:text-primary
            transition-all
            uppercase
          "
          style={{
            fontSize: `${14 * scale}px`,
          }}
        >
          <Share2 size={20} />
          PAYLAŞ
        </button>

        {/* KARE */}
        <button
          type="button"
          onClick={() => handleDownload('square')}
          disabled={isDownloading}
          aria-label="1080x1080 kare görsel indir"
          className="
            bg-slate-100
            text-slate-700
            rounded-full
            font-black
            tracking-widest
            hover:bg-slate-200
            transition-all
            uppercase
            flex
            items-center
            gap-2
            shadow-sm
            text-xs
            px-6
            py-4
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <ImageIcon size={18} />

          {isDownloading
            ? 'HAZIRLANIYOR...'
            : '1080x1080 İNDİR'}
        </button>

        {/* STORY */}
        <button
          type="button"
          onClick={() => handleDownload('story')}
          disabled={isDownloading}
          aria-label="1080x1920 hikaye görsel indir"
          className="
            bg-primary/10
            text-primary
            rounded-full
            font-black
            tracking-widest
            hover:bg-primary/20
            transition-all
            uppercase
            flex
            items-center
            gap-2
            shadow-sm
            text-xs
            px-6
            py-4
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <Download size={18} />

          {isDownloading
            ? 'HAZIRLANIYOR...'
            : '1080x1920 HİKAYE'}
        </button>
      </div>
    </div>
  );
}
```
