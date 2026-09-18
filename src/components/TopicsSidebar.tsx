'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { topicsData } from '@/components/article-form-topics';
import { slugify } from '@/lib/utils';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export function TopicsSidebar() {
  return (
    <aside className="space-y-8 sticky top-28">
      <Card className="border-none bg-white shadow-deep rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-12">
          <h2 className="mb-10 font-headline text-3xl font-black tracking-tight text-foreground text-shadow-heavy">Kategoriler</h2>
          
          <ScrollArea className="h-[80vh] pr-6">
            <div className="space-y-12">
              <div>
                <ul className="space-y-6">
                   <li>
                      <Link href="/vecizeler" className="flex items-center text-xl font-bold text-primary transition-all hover:translate-x-1 text-shadow-heavy">
                          Vecize Kartları
                      </Link>
                   </li>
                   <li>
                      <Link href="/makaleler" className="flex items-center text-xl font-bold text-primary transition-all hover:translate-x-1 text-shadow-heavy">
                          Tüm Makaleler
                      </Link>
                   </li>
                </ul>
              </div>
              
              <Separator className="bg-primary/10" />
              
              {Object.entries(topicsData).map(([category, subTopics]) => (
                <div key={category} className="space-y-6">
                  <h3 className="font-headline text-xs font-black text-foreground/30 uppercase tracking-[0.2em] text-shadow-drop">{category}</h3>
                  <ul className="space-y-4">
                    {subTopics.map((topic) => (
                       <li key={topic}>
                        <Link 
                          href={`/topic/${slugify(topic)}`} 
                          className="block text-sm font-semibold text-muted-foreground/70 transition-all hover:text-primary hover:translate-x-1 leading-tight text-shadow-drop"
                        >
                          {topic}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </aside>
  );
}
