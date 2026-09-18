'use client';

import { ArticleForm } from '@/components/article-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

export default function CreateArticlePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Yeni İçerik Oluştur</h1>
        <p className="text-muted-foreground">Yeni bir gönderi oluşturmak için ayrıntıları doldurun.</p>
      </div>
      {isClient ? (
        <ArticleForm />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-4">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
             <div className="grid auto-rows-max items-start gap-4 lg:col-span-3">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      )}
    </div>
  );
}
