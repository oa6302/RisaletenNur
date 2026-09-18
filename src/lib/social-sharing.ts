'use client';

import html2canvas from 'html2canvas';
import React from 'react';
import { slugify } from './utils';

/* -------------------------------------------------
    TYPE DEFINITIONS
--------------------------------------------------*/

type ToastFunction = (options: {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}) => void;

interface ShareParams {
  articleTitle: string;
  articlePrompt: string;
  articleUrl: string;
  platform: 'x' | 'whatsapp' | 'telegram' | 'facebook' | 'generic';
  toast: ToastFunction;
}

/* -------------------------------------------------
    SHARE HANDLER
--------------------------------------------------*/

export const handleShare = ({
  articleTitle,
  articlePrompt,
  articleUrl,
  platform,
  toast,
}: ShareParams) => {
  const text = `"${articlePrompt}"\n\n— ${articleTitle}`;
  let shareUrl = '';

  switch (platform) {
    case 'x':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        articleUrl
      )}&text=${encodeURIComponent(text)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        text + '\n\n' + articleUrl
      )}`;
      break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
        articleUrl
      )}&text=${encodeURIComponent(text)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        articleUrl
      )}&quote=${encodeURIComponent(text)}`;
      break;
    case 'generic':
        if (navigator.clipboard) {
            navigator.clipboard.writeText(articleUrl).then(() => {
                toast({
                    title: 'Link Kopyalandı',
                    description: 'Makale linki panoya kopyalandı.',
                });
            }).catch(err => {
                 toast({
                    title: 'Hata',
                    description: 'Link kopyalanamadı.',
                    variant: 'destructive'
                });
            });
        }
      return;
  }

  window.open(shareUrl, '_blank', 'noopener,noreferrer');
};


export const handleDownloadAsPng = async (
  elementToRender: HTMLElement | null,
  articleTitle: string,
  toast: ToastFunction,
  outputWidth: number,
  outputHeight: number,
  theme: string = 'light'
) => {
  if (!elementToRender) {
    toast({
      title: 'Hata',
      description: 'İndirilecek içerik bulunamadı.',
      variant: 'destructive',
    });
    return;
  }
  
  // İçerik düğümünü al
  const contentNode = elementToRender.querySelector('.group\\/card') || elementToRender.firstElementChild;
  if (!contentNode) {
    toast({
      title: 'Hata',
      description: 'İndirilecek içerik bileşeni bulunamadı.',
      variant: 'destructive',
    });
    return;
  }

  toast({
    title: 'Görsel Oluşturuluyor...',
    description: 'Yüksek çözünürlüklü dijital kopya hazırlanıyor.',
  });

  // Render için geçici bir konteynır oluştur
  const renderContainer = document.createElement('div');
  renderContainer.style.position = 'fixed';
  renderContainer.style.left = '0';
  renderContainer.style.top = '0';
  renderContainer.style.width = `${outputWidth}px`;
  renderContainer.style.height = `${outputHeight}px`;
  renderContainer.style.display = 'flex';
  renderContainer.style.alignItems = 'stretch';
  renderContainer.style.justifyContent = 'stretch';
  renderContainer.style.zIndex = '-9999';
  renderContainer.style.visibility = 'visible';
  
  if (theme === 'dark') {
    renderContainer.classList.add('dark');
    renderContainer.style.backgroundColor = '#09090b'; 
  } else {
    renderContainer.style.backgroundColor = '#ffffff';
  }
  
  const clone = contentNode.cloneNode(true) as HTMLElement;
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.margin = '0';
  clone.style.borderRadius = '0'; 
  clone.style.border = 'none';
  clone.style.boxShadow = 'none';
  
  // İndirme sırasında butonları ve Link'leri gizle
  const toIgnore = clone.querySelectorAll('[data-html2canvas-ignore="true"]');
  toIgnore.forEach(el => (el as HTMLElement).style.display = 'none');
  
  renderContainer.appendChild(clone);
  document.body.appendChild(renderContainer);

  try {
    // Fontların tam yüklenmesi için bekleme
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const canvas = await html2canvas(renderContainer, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
      scale: 3, 
      logging: false,
      width: outputWidth,
      height: outputHeight,
      windowWidth: outputWidth,
      windowHeight: outputHeight,
      x: 0,
      y: 0
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.download = `risaleten-nur-${slugify(articleTitle)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ 
      title: 'Başarılı!', 
      description: `Görsel galerinize kaydedildi.` 
    });

  } catch (err) {
    console.error('İndirme hatası:', err);
    toast({ title: 'Başarısız', description: 'Görsel oluşturulurken bir teknik hata oluştu.', variant: 'destructive' });
  } finally {
    if (document.body.contains(renderContainer)) {
      document.body.removeChild(renderContainer);
    }
  }
};
