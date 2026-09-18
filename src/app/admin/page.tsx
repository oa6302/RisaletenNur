'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle, Book, Tag, Clock, Wand2, Sparkles, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import React, { useState, useTransition, useRef, useEffect } from 'react';
import { useArticles } from '@/context/article-context';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { handleEnrichAndSave } from './actions';
import { useToast } from '@/hooks/use-toast';
import { ShareDialog } from '@/components/ShareDialog';
import type { Article } from '@/lib/placeholder-data';
import { VecizeCard } from '@/components/VecizeCard';

export default function AdminDashboard() {
  const { articles, deleteArticle, isLoading } = useArticles();
  const [isEnriching, startEnrichTransition] = useTransition();
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const cardRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeGetDate = (date: any): Date | null => {
    if (!date) return null;
    if (date.toDate) return date.toDate();
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const formatDate = (date: any) => {
    const d = safeGetDate(date);
    if (!d) return { relative: '', absolute: '' };
    return {
      relative: formatDistanceToNow(d, { addSuffix: true, locale: tr }),
      absolute: format(d, 'd MMMM yyyy, HH:mm', { locale: tr }),
    };
  };

  const sortedArticles = React.useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = safeGetDate(a.createdAt);
      const dateB = safeGetDate(b.createdAt);
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });
  }, [articles]);
  
  const handleApiError = (error: unknown, articleId?: string) => {
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
    console.error(`Makale zenginleştirilemedi ${articleId ? `(ID: ${articleId})` : ''}:`, error);

    toast({
      title: 'Zenginleştirme Başarısız',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const onEnrich = (articleId: string, content: string) => {
    setEnrichingId(articleId);
    startEnrichTransition(async () => {
      try {
        await handleEnrichAndSave(articleId, content);
        toast({
          title: 'Başarılı!',
          description: 'Makale içeriği başarıyla güncellendi.',
        });
      } catch (error) {
        handleApiError(error, articleId);
      } finally {
        setEnrichingId(null);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedArticles.map((article) => {
          const { relative, absolute } = isMounted ? formatDate(article.createdAt) : { relative: 'Yükleniyor...', absolute: '' };
          const isCurrentlyEnriching = isEnriching && enrichingId === article.id;
          return (
            <AlertDialog key={article.id}>
              <Card className="flex flex-col shadow-deep transition-all duration-300 hover:translate-y-[-4px] border-primary/5">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                     <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="mb-2 shadow-sm text-shadow-drop">
                        {article.status === 'published' ? 'Yayında' : 'Taslak'}
                      </Badge>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isCurrentlyEnriching}>
                            {isCurrentlyEnriching ? <Sparkles className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="shadow-deep border-primary/10">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/edit/${article.id}`}>Düzenle</Link>
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => onEnrich(article.id, article.content)} disabled={isCurrentlyEnriching}>
                              <Wand2 className="mr-2 h-4 w-4" />
                              <span>Zenginleştir</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/posts/${article.id}`} target="_blank">Görüntüle</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShareArticle(article)}>
                             <Share2 className="mr-2 h-4 w-4" /> Paylaş & İndir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive">
                              Sil
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                  <Link href={`/admin/edit/${article.id}`}>
                    <CardTitle className="text-lg leading-snug hover:text-primary transition-colors text-shadow-heavy font-headline">{article.title}</CardTitle>
                  </Link>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
                    <div className='flex items-center gap-2 text-shadow-drop'>
                        <Book className='h-4 w-4 text-primary/70'/>
                        <p className='truncate'>{article.prompt || <span className='italic'>Prompt yok</span>}</p>
                    </div>
                   <div className='flex items-center gap-2 text-shadow-drop'>
                      <Tag className='h-4 w-4 text-primary/70'/>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {
                          (article.categories || []).slice(0, 2).map(tag => <Badge key={tag} variant='outline' className="text-[10px] shadow-sm text-shadow-drop">{tag}</Badge>)
                        }
                      </div>
                   </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground text-shadow-drop" title={absolute}>
                    <Clock className="h-3.5 w-3.5 text-primary/60"/>
                    <span>{relative}</span>
                  </div>
                </CardFooter>
              </Card>
              <div className="absolute -z-10 opacity-0" style={{ left: '-9999px', top: '0' }} aria-hidden>
                 <div ref={el => cardRefs.current[article.id] = el}>
                   <VecizeCard article={article} isForDownload={true} />
                 </div>
              </div>
              <AlertDialogContent className="shadow-deep">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-shadow-heavy">Emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu eylem geri alınamaz. Makale kalıcı olarak silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteArticle(article.id)}>
                      Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          );
        })}
       </div>
       {sortedArticles.length === 0 && !isLoading && (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg shadow-sm">
            <h3 className='text-lg font-semibold text-foreground text-shadow-heavy'>Henüz İçerik Yok</h3>
            <Link href="/admin/create" className='mt-4 inline-block'>
              <Button className="shadow-deep">
                <PlusCircle className="mr-2 h-4 w-4" />
                Yeni İçerik Oluştur
              </Button>
            </Link>
          </div>
        )}
        {shareArticle && (
            <ShareDialog
            article={shareArticle}
            isOpen={!!shareArticle}
            onOpenChange={(open) => !open && setShareArticle(null)}
            triggerRef={{ current: cardRefs.current[shareArticle.id] }}
            />
        )}
    </div>
  );
}