'use client';
import { useParams } from 'next/navigation';
import { ArticleForm } from '@/components/article-form';
import { useArticles } from '@/context/article-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditArticlePage() {
  const params = useParams();
  const { articles, isLoading } = useArticles();
  const id = params.id as string;
  
  const article = articles.find((a) => a.id === id);

  if (isLoading) {
    return (
       <div>
        <div className="mb-8">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="mt-2 h-5 w-80" />
        </div>
        <Skeleton className="h-[80vh] w-full" />
      </div>
    );
  }

  if (!article) {
    return <p>Makale bulunamadı.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">İçeriği Düzenle</h1>
        <p className="text-muted-foreground">Makalenizde değişiklik yapın.</p>
      </div>
      {/* ArticleForm'u sadece 'article' mevcut olduğunda render et */}
      <ArticleForm article={article} />
    </div>
  );
}
