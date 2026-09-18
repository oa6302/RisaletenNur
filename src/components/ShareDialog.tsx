'use client';

import {
  Facebook,
  Instagram,
  Link as LinkIcon,
  Share2,
  Smartphone,
  Square,
  RectangleVertical,
  Download,
  Send,
  MessageCircle,
  Twitter,
} from 'lucide-react';

import React, {
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { Article } from '@/lib/placeholder-data';
import { VecizeCard } from './VecizeCard';
import { handleDownloadAsPng, handleShare } from '@/lib/social-sharing';
import { Label } from './ui/label';
import { useTheme } from 'next-themes';

type PlatformPreset =
  | 'instagram-story'
  | 'instagram-reel'
  | 'tiktok'
  | 'x'
  | 'facebook';

const PRESETS = {
  'instagram-story': {
    ratio: 9 / 16,
    width: 1080,
    height: 1920,
    font: 'Inter, sans-serif',
    lineHeight: 1.25,
    safeArea: true,
    hashtags: '#vecize #gününsözü #edebiyat',
  },
  'instagram-reel': {
    ratio: 9 / 16,
    width: 1080,
    height: 1920,
    font: 'Inter, sans-serif',
    lineHeight: 1.25,
    safeArea: true,
    hashtags: '#reels #vecize #söz',
  },
  tiktok: {
    ratio: 9 / 16,
    width: 1080,
    height: 1920,
    font: 'Inter, sans-serif',
    lineHeight: 1.3,
    safeArea: true,
    hashtags: '#tiktok #vecize',
  },
  x: {
    ratio: 1,
    width: 1080,
    height: 1080,
    font: 'system-ui',
    lineHeight: 1.4,
    safeArea: false,
    hashtags: '#vecize',
  },
  facebook: {
    ratio: 4 / 5,
    width: 1080,
    height: 1350,
    font: 'Inter, sans-serif',
    lineHeight: 1.4,
    safeArea: false,
    hashtags: '#edebiyat #vecize',
  },
};

interface ShareDialogProps {
  article: Article;
  htmlContent?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

export function ShareDialog({
  article,
  htmlContent,
  isOpen,
  onOpenChange,
  triggerRef,
}: ShareDialogProps) {
  const { toast } = useToast();
  const { theme } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [preset, setPreset] = useState<PlatformPreset>('instagram-story');
  
  const config = PRESETS[preset];

  /* ---------- FIT & OVERFLOW FOR PREVIEW ---------- */
  useLayoutEffect(() => {
    if (!previewRef.current || !contentRef.current) return;

    const container = previewRef.current;
    const content = contentRef.current;

    // Apply the aspect ratio to ensure correct proportions before scaling
    content.style.aspectRatio = `${config.width} / ${config.height}`;

    // Calculate scale to fit the content within the container
    const scale =
      Math.min(
        container.offsetWidth / content.offsetWidth,
        container.offsetHeight / content.offsetHeight
      );

    content.style.transform = `scale(${scale})`;
    content.style.transformOrigin = 'center center';
    
  }, [preset, htmlContent, article, isOpen, config.width, config.height]);


  const onDownload = () => {
    handleDownloadAsPng(
      contentRef.current, 
      article.title, 
      toast, 
      config.width, 
      config.height,
      theme === 'dark' ? 'dark' : 'light'
    );
  };

  const onShare = (platform: 'x' | 'whatsapp' | 'telegram' | 'facebook' | 'generic') => {
    handleShare({
      articleTitle: article.title,
      articlePrompt: article.prompt || '',
      articleUrl: `${window.location.origin}/posts/${article.id}`,
      platform,
      toast,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Paylaş &amp; İndir</DialogTitle>
          <DialogDescription>
            Platforma göre otomatik optimize edilmiş paylaşım.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="download" className="flex-grow flex flex-col min-h-0">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="share">Paylaş</TabsTrigger>
            <TabsTrigger value="download">İndir</TabsTrigger>
          </TabsList>

          <TabsContent value="download" className="space-y-4 flex-grow flex flex-col min-h-0">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {Object.keys(PRESETS).map((p) => (
                <Button
                  key={p}
                  variant={preset === p ? 'default' : 'outline'}
                  onClick={() => setPreset(p as PlatformPreset)}
                >
                  {p}
                </Button>
              ))}
            </div>

            <div
              ref={previewRef}
              className="relative mx-auto flex flex-grow items-center justify-center border rounded-md bg-muted overflow-hidden w-full"
            >
              {config.safeArea && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-[14%] bg-black/5 pointer-events-none z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-black/5 pointer-events-none z-10" />
                </>
              )}

              <div
                ref={contentRef}
                className="w-[1080px] h-full flex items-stretch justify-stretch"
              >
                {htmlContent ? (
                  <div
                    className="post-content prose max-w-none h-full w-full bg-card p-12 text-card-foreground"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                ) : (
                  <VecizeCard article={article} isForDownload />
                )}
              </div>
            </div>

            <Button className="w-full shrink-0" onClick={onDownload}>
              <Download className="mr-2 h-4 w-4" />
              PNG Olarak İndir
            </Button>
          </TabsContent>

          <TabsContent value="share" className="space-y-2">
             <p className="text-sm text-muted-foreground">Bu içeriği aşağıdaki platformlarda paylaşın.</p>
              <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => onShare('x')}><Twitter className="mr-2" /> Twitter (X)</Button>
                  <Button variant="outline" onClick={() => onShare('whatsapp')}><MessageCircle className="mr-2" /> WhatsApp</Button>
                  <Button variant="outline" onClick={() => onShare('facebook')}><Facebook className="mr-2" /> Facebook</Button>
                  <Button variant="outline" onClick={() => onShare('telegram')}><Send className="mr-2" /> Telegram</Button>
              </div>
               <Button variant="outline" className="w-full" onClick={() => onShare('generic')}>
                    <LinkIcon className="mr-2" /> Link Kopyala
                </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}