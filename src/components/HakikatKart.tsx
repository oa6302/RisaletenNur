'use client';

import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, Quote, Sparkles, BookOpen, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
  maddeler: { simge: string; etiket: string; aciklama: string }[];
  scale?: number;
}

const DEEP_SHADOW_STYLE = "text-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2), 0px 12px 32px rgba(0, 0, 0, 0.15);";

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
  scale = 1.0,
}: HakikatKartProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (format: 'story' | 'square') => {
    if (isDownloading) return;
    setIsDownloading(true);

    const isStory = format === 'story';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    toast({
      title: isStory ? 'Hikaye Formatı Hazırlanıyor' : 'Kare Post Hazırlanıyor',
      description: 'Sosyal medya şablonu yüksek çözünürlükte oluşturuluyor...',
    });

    const renderNode = document.createElement('div');
    renderNode.className = 'story-card-modern';
    renderNode.style.position = 'fixed';
    renderNode.style.left = '0';
    renderNode.style.top = '0';
    renderNode.style.zIndex = '99999';
    renderNode.style.opacity = '0.01';
    renderNode.style.pointerEvents = 'none';
    renderNode.style.width = `${width}px`;
    renderNode.style.height = `${height}px`;
    renderNode.style.display = 'flex';
    renderNode.style.flexDirection = 'column';
    renderNode.style.justifyContent = 'space-between';
    renderNode.style.backgroundColor = '#090d16';
    renderNode.style.color = '#ffffff';
    renderNode.style.padding = isStory ? '120px 75px' : '75px';
    renderNode.style.boxSizing = 'border-box';
    renderNode.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    renderNode.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span style="background: rgba(249, 115, 22, 0.15); color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3); padding: 12px 32px; border-radius: 9999px; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; ${DEEP_SHADOW_STYLE}">${badge}</span>
        <span style="color: rgba(255,255,255,0.1); font-size: 64px; font-weight: 900;">${no}</span>
      </div>

      <div style="display: flex; flex-direction: column; justify-content: center; gap: ${isStory ? '50px' : '30px'}; flex-grow: 1; margin: 40px 0;">
        <div>
          <h2 style="font-size: ${isStory ? '5rem' : '3.5rem'}; font-weight: 900; margin-bottom: 25px; text-align: center; text-transform: uppercase; line-height: 1.1; color: #ffffff; ${DEEP_SHADOW_STYLE}">${title}</h2>
          <p style="font-size: ${isStory ? '2.4rem' : '1.8rem'}; line-height: 1.5; text-align: center; font-style: italic; color: #cbd5e1; font-weight: 700; ${DEEP_SHADOW_STYLE}">${problem}</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 25px;">
          ${hikmet ? `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 35px 40px; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
              <p style="font-size: ${isStory ? '2rem' : '1.5rem'}; font-style: italic; font-weight: bold; line-height: 1.4; color: #f8fafc; ${DEEP_SHADOW_STYLE}">"${hikmet}"</p>
              <p style="font-size: ${isStory ? '1.4rem' : '1.1rem'}; font-weight: 900; color: #f97316; text-transform: uppercase; text-align: right; margin-top: 15px; letter-spacing: 2px;">— ${hikmetKaynak || 'Bediüzzaman Said Nursî'}</p>
            </div>
          ` : ''}
          ${ayet ? `
            <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 35px 40px; border-radius: 32px;">
              <p style="font-size: ${isStory ? '2rem' : '1.5rem'}; font-weight: bold; line-height: 1.4; color: #f8fafc; ${DEEP_SHADOW_STYLE}">"${ayet}"</p>
              <p style="font-size: ${isStory ? '1.4rem' : '1.1rem'}; font-weight: 900; color: #34d399; text-transform: uppercase; text-align: right; margin-top: 15px;">— ${ayetKaynak}</p>
            </div>
          ` : ''}
        </div>

        <div style="display: flex; flex-direction: column; gap: 20px;">
          ${maddeler.map(m => `
            <div style="display: flex; align-items: center; gap: 25px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 25px; border-radius: 24px;">
              <span style="font-size: 3.5rem; flex-shrink: 0;">${m.simge}</span>
              <div style="font-size: ${isStory ? '1.8rem' : '1.4rem'}; line-height: 1.4;">
                <strong style="color: #f97316; text-transform: uppercase; display: block; margin-bottom: 6px; font-size: ${isStory ? '1.4rem' : '1.1rem'}; letter-spacing: 1px;">${m.etiket}</strong>
                <span style="color: #cbd5e1; font-weight: 700; ${DEEP_SHADOW_STYLE}">${m.aciklama}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="text-align: center; color: #475569; font-size: 1.4rem; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; ${DEEP_SHADOW_STYLE}">
        RISALETENNUR
      </div>
    `;

    document.body.appendChild(renderNode);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(renderNode, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#090d16',
        width: width,
        height: height,
        logging: false,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `hakikat-${no}-${slugify(title)}-${format}.png`;
      link.click();

      toast({ title: 'İndirme Başarılı', description: 'Görsel cihazınıza kaydedildi!' });
    } catch (err) {
      console.error('Download error:', err);
      toast({ title: 'Hata', description: 'Görsel oluşturulamadı.', variant: 'destructive' });
    } finally {
      document.body.removeChild(renderNode);
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: problem,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Bağlantı Kopyalandı' });
    }
  };

  return (
    <div 
      className="w-full max-w-[720px] mx-auto bg-white border border-slate-100 shadow-deep flex flex-col transition-all duration-500 hover:-translate-y-1 overflow-hidden"
      style={{
        borderRadius: `${3.5 * scale}rem`,
        padding: `${(isMobile ? 32 : 64) * scale}px`,
      }}
    >
      <div className="w-full flex justify-between items-center mb-8" style={{ marginBottom: `${40 * scale}px` }}>
        <span 
          className="bg-primary/10 text-primary rounded-full font-black tracking-[0.2em] uppercase border border-primary/20 shadow-sm text-shadow-heavy"
          style={{
            fontSize: `${(isMobile ? 11 : 14) * scale}px`,
            padding: `${(isMobile ? 6 : 10) * scale}px ${(isMobile ? 20 : 32) * scale}px`,
          }}
        >
          {badge}
        </span>
        <span className="text-slate-100 font-black leading-none" style={{ fontSize: `${64 * scale}px` }}>{no}</span>
      </div>

      <h2 
        className="font-black text-slate-900 tracking-tighter mb-6 text-center uppercase leading-[1.1] text-shadow-heavy"
        style={{
          fontSize: `${(isMobile ? 28 : 42) * scale}px`,
          marginBottom: `${24 * scale}px`,
        }}
      >
        {title}
      </h2>
      
      <p 
        className="text-slate-700 leading-relaxed font-bold italic text-center mb-10 text-shadow-heavy"
        style={{
          fontSize: `${(isMobile ? 18 : 24) * scale}px`,
          marginBottom: `${48 * scale}px`,
          padding: `0 ${(isMobile ? 8 : 16) * scale}px`,
        }}
      >
        "{problem}"
      </p>

      <div className="w-full space-y-8 mb-10" style={{ gap: `${32 * scale}px`, marginBottom: `${48 * scale}px` }}>
        {hikmet && (
          <div className="bg-slate-50 border border-slate-100 relative text-left shadow-deep" style={{ padding: `${32 * scale}px`, borderRadius: `${2.5 * scale}rem` }}>
            <Quote className="absolute pointer-events-none" style={{ top: `${20 * scale}px`, right: `${24 * scale}px`, height: `${48 * scale}px`, width: `${48 * scale}px`, opacity: 0.03 }} />
            <p className="italic font-bold text-slate-800 leading-relaxed text-shadow-heavy" style={{ fontSize: `${20 * scale}px` }}>"{hikmet}"</p>
            <p className="font-black text-primary uppercase tracking-[0.2em] mt-4 text-right" style={{ fontSize: `${13 * scale}px`, marginTop: `${16 * scale}px` }}>— {hikmetKaynak}</p>
          </div>
        )}
        
        {ayet && (
          <div className="bg-emerald-50/50 border border-emerald-100 relative text-left shadow-sm" style={{ padding: `${32 * scale}px`, borderRadius: `${2.5 * scale}rem` }}>
            <p className="font-bold text-emerald-900 leading-relaxed text-shadow-heavy" style={{ fontSize: `${20 * scale}px` }}>"{ayet}"</p>
            <p className="font-black text-emerald-600 uppercase tracking-widest mt-4 text-right" style={{ fontSize: `${13 * scale}px` }}>— {ayetKaynak}</p>
          </div>
        )}
      </div>

      <div className="w-full space-y-6 mb-10 text-left" style={{ gap: `${24 * scale}px`, marginBottom: `${56 * scale}px` }}>
        {maddeler.map((item, index) => (
          <div key={index} className="flex items-start gap-6 bg-slate-50/40 hover:bg-slate-50 transition-colors shadow-sm" style={{ padding: `${20 * scale}px`, borderRadius: `${1.8 * scale}rem`, gap: `${24 * scale}px` }}>
            <span className="shrink-0 mt-1" style={{ fontSize: `${42 * scale}px` }}>{item.simge}</span>
            <div className="space-y-1.5" style={{ gap: `${6 * scale}px` }}>
              <span className="font-black text-primary uppercase tracking-widest block" style={{ fontSize: `${14 * scale}px` }}>{item.etiket}</span>
              <p className="text-slate-700 font-bold leading-relaxed text-shadow-heavy" style={{ fontSize: `${19 * scale}px` }}>{item.aciklama}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t border-slate-100" style={{ paddingTop: `${32 * scale}px` }}>
        <button 
          onClick={handleShare} 
          className="flex items-center gap-2 font-black tracking-widest text-slate-400 hover:text-primary transition-all uppercase"
          style={{ fontSize: `${14 * scale}px` }}
        >
          <Share2 size={20} /> PAYLAŞ
        </button>
        <button 
          onClick={() => handleDownload('square')}
          disabled={isDownloading}
          className="bg-slate-100 text-slate-700 rounded-full font-black tracking-widest hover:bg-slate-200 transition-all uppercase flex items-center gap-2 shadow-sm text-xs px-6 py-4"
        >
          <ImageIcon size={18} /> 1080x1080 İNDİR
        </button>
        <button 
          onClick={() => handleDownload('story')}
          disabled={isDownloading}
          className="bg-primary/10 text-primary rounded-full font-black tracking-widest hover:bg-primary/20 transition-all uppercase flex items-center gap-2 shadow-sm text-xs px-6 py-4"
        >
          <Download size={18} /> 1080x1920 HİKAYE
        </button>
      </div>
    </div>
  );
}
