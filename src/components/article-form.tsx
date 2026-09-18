'use client';

import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Article } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { handleFullAiGeneration, handleAiEnrichment, handleTranslation } from '@/app/admin/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { useArticles } from '@/context/article-context';
import { useRouter } from 'next/navigation';
import { categories, ottomanChars } from './article-form-topics';
import { Save, Loader2, BrainCircuit, Wand2, Languages, Keyboard } from 'lucide-react';
import { VecizeCard } from './VecizeCard';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık gerekli.'),
  prompt: z.string().optional(),
  ottomanContent: z.string().optional(),
  ottoman_font_size: z.number().min(12).max(100).default(32),
  content_font_size: z.number().min(12).max(60).default(24),
  ottoman_font_color: z.string().default('#0f172a'),
  ottoman_font_family: z.enum(['Rika', 'Matbu', 'Scheherazade New']).default('Matbu'),
  source: z.string().default('Risale-i Nur Külliyatı'),
  cardStyle: z.number().min(1).max(10).default(1),
  content: z.string().min(1, 'İçerik gerekli.'),
  imageUrl: z.string().optional(),
  imageRatio: z.string().default('16/9'),
  categories: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  tags: z.string().optional(),
  status: z.string().default('draft'),
});

type ArticleFormProps = {
  article?: Article;
};

export function ArticleForm({ article }: ArticleFormProps) {
  const [isAiProcessing, startAiTransition] = useTransition();
  const [isTranslating, startTranslateTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'icerik' | 'siniflandirma' | 'gorunum'>('icerik');
  const { toast } = useToast();
  const { addArticle, updateArticle } = useArticles();
  const router = useRouter();

  // Osmanlıca textarea için DOM referansı
  const ottomanTextareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article?.title || '',
      prompt: article?.prompt || '',
      ottomanContent: article?.ottomanContent || '',
      ottoman_font_size: article?.ottoman_font_size || 32,
      content_font_size: article?.content_font_size || 24,
      ottoman_font_color: article?.ottoman_font_color || '#0f172a',
      ottoman_font_family: article?.ottoman_font_family || 'Matbu',
      source: article?.source || 'Risale-i Nur Külliyatı',
      cardStyle: article?.cardStyle || 1,
      content: article?.content || '',
      imageUrl: article?.imageUrl || '',
      imageRatio: article?.imageRatio || '16/9',
      categories: article?.categories || [],
      topics: article?.topics || [],
      tags: article?.tags?.join(', ') || '',
      status: article?.status || 'draft',
    },
  });

  const formData = form.watch();
  
  const previewArticle = {
    ...formData,
    id: 'preview',
    createdAt: new Date(),
    tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
  } as Article;

  const onGenerate = () => {
    const promptValue = form.getValues('prompt');
    if (!promptValue) {
      toast({ title: 'Vecize alanı boş olamaz.', variant: 'destructive' });
      return;
    }

    startAiTransition(async () => {
      try {
        const result = await handleFullAiGeneration(promptValue);
        form.setValue('title', result.title, { shouldValidate: true });
        form.setValue('content', result.content, { shouldValidate: true });
        form.setValue('source', result.source || 'Risale-i Nur Külliyatı', { shouldValidate: true });
        form.setValue('ottomanContent', result.ottomanContent || '', { shouldValidate: true });
        if (result.categories) form.setValue('categories', result.categories);
        if (result.topics) form.setValue('topics', result.topics);

        toast({
          title: 'İçerik Hazırlandı',
          description: '5 Kartlık bütünlüklü manevî gelişim zinciri başarıyla yüklendi.',
        });
      } catch (error) {
        toast({
          title: 'İşlem Başarısız',
          description: error instanceof Error ? error.message : 'Yapay zeka kotası dolu olabilir.',
          variant: 'destructive',
        });
      }
    });
  };

  const onTranslateAuto = () => {
    const promptValue = form.getValues('prompt');
    if (!promptValue) {
      toast({ title: 'Çevrilecek kaynak vecize bulunamadı.', variant: 'destructive' });
      return;
    }
    startTranslateTransition(async () => {
      try {
        const result = await handleTranslation(promptValue);
        if (result && result.ottomanTurkishText) {
          form.setValue('ottomanContent', result.ottomanTurkishText, { shouldValidate: true });
          toast({ title: 'Osmanlıca matbu çevirisi tamamlandı' });
        }
      } catch (error) {
        toast({ title: 'Çeviri başarısız oldu.', variant: 'destructive' });
      }
    });
  };

  const onEnrich = () => {
    const content = form.getValues('content');
    if (!content) return;
    startAiTransition(async () => {
      try {
        const result = await handleAiEnrichment(content);
        if (result) {
          form.setValue('content', result.content, { shouldValidate: true });
          toast({ title: 'İçerik asil manifesto yapısına dönüştürüldü' });
        }
      } catch (error) {
        toast({ title: 'Zenginleştirme Başarısız', variant: 'destructive' });
      }
    });
  };

  const handleCustomSubmit = (status: 'published' | 'draft') => {
    setIsSaving(true);
    const values = form.getValues();

    if (!values.title || !values.content) {
      toast({
        title: 'Form Hatalı',
        description: 'Lütfen Başlık ve İçerik alanlarını doldurun.',
        variant: 'destructive',
      });
      setIsSaving(false);
      return;
    }

    const processedValues = {
      ...values,
      ottoman_font_size: Number(values.ottoman_font_size),
      content_font_size: Number(values.content_font_size),
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      status: status,
    };

    if (article?.id && !article.id.startsWith('static-')) {
      updateArticle({ id: article.id, ...processedValues });
    } else {
      addArticle(processedValues);
    }

    toast({
      title: status === 'published' ? 'Yayınlandı' : 'Taslak Olarak Kaydedildi',
      description: 'İçerik listesine yönlendiriliyorsunuz.',
    });

    setTimeout(() => {
      router.push('/admin');
    }, 400);
  };

  // Harfi imlecin olduğu yere ekleme fonksiyonu
  const insertOttomanChar = (char: string) => {
    const textarea = ottomanTextareaRef.current;
    if (!textarea) {
      const current = form.getValues('ottomanContent') || '';
      form.setValue('ottomanContent', current + char, { shouldValidate: true });
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = form.getValues('ottomanContent') || '';
    
    // Metni imleç konumundan böl ve harfi araya ekle
    const newText = currentText.substring(0, start) + char + currentText.substring(end);
    
    form.setValue('ottomanContent', newText, { shouldValidate: true });

    // React'ın state güncellemesini bekle ve odağı/imleci geri yükle
    setTimeout(() => {
      textarea.focus();
      const newPos = start + char.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  return (
    <Form {...form}>
      <div className="w-full max-w-5xl mx-auto space-y-6 px-2 sm:px-4 pb-20">
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight font-headline text-slate-900 text-shadow-heavy">
                {article ? "İçeriği Düzenle" : "Yeni İçerik Oluştur"}
              </h1>
              <p className="text-sm text-slate-400 mt-1 text-shadow-drop">Yeni bir gönderi oluşturmak için ayrıntıları doldurun.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" onClick={() => router.push('/admin')} type="button" disabled={isSaving} className="rounded-full px-6 shadow-sm">
              İptal
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => handleCustomSubmit('draft')}
              disabled={isSaving}
              className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Taslak Kaydet
            </Button>
            <Button 
              type="button" 
              onClick={() => handleCustomSubmit('published')}
              disabled={isSaving}
              className="bg-[#f97316] hover:bg-[#f97316]/90 text-white rounded-full px-8 font-bold shadow-deep"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yayınla
            </Button>
          </div>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-full w-full max-w-md mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('icerik')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'icerik' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            İçerik
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('siniflandirma')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'siniflandirma' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Sınıflandırma
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gorunum')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'gorunum' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Görünüm
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          <div className="space-y-6 lg:col-span-7">
            
            {activeTab === 'icerik' && (
              <>
                <Card className="border-none shadow-modern rounded-[2rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline text-2xl font-black text-slate-900 text-shadow-heavy">Vecize / Prompt</CardTitle>
                    <CardDescription className="text-xs text-slate-400 text-shadow-drop">İçeriğin temelini oluşturan özlü söz.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Vecizenizi buraya girin..." 
                              {...field} 
                              rows={3} 
                              className="text-base rounded-2xl border-slate-100 bg-slate-50/50 p-4 focus-visible:ring-primary/20 resize-none font-medium placeholder:text-slate-300 shadow-inner" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onTranslateAuto} 
                      disabled={isTranslating} 
                      className="w-full h-11 text-xs font-bold rounded-xl bg-slate-50 border-none text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                      Osmanlıca'ya Çevir
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-modern rounded-[2rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline text-2xl font-black text-slate-900 text-shadow-heavy">Makale Detayları</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider text-shadow-drop">Başlık</FormLabel>
                          <FormControl>
                            <Input placeholder="Başlık" {...field} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 shadow-inner" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider text-shadow-drop">Makale Gövdesi (HTML Destekli)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Makale içeriği..." 
                              {...field} 
                              rows={10} 
                              className="rounded-2xl border-slate-100 bg-slate-50/50 p-4 min-h-[250px] font-mono text-sm shadow-inner" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        type="button" 
                        onClick={onGenerate} 
                        disabled={isAiProcessing} 
                        className="h-12 text-xs font-black shadow-deep bg-[#f97316] text-white rounded-xl flex items-center justify-center gap-2"
                      >
                        {isAiProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                        Yapay Zeka ile Oluştur
                      </Button>
                      <Button 
                        type="button" 
                        onClick={onEnrich} 
                        disabled={isAiProcessing} 
                        variant="outline" 
                        className="h-12 text-xs font-bold border-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 shadow-sm"
                      >
                        <Wand2 className="h-4 w-4" />
                        Zenginleştir
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-modern rounded-[2rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline text-2xl font-black text-slate-900 text-shadow-heavy">Osmanlıca Metin</CardTitle>
                    <CardDescription className="text-xs text-slate-400 text-shadow-drop">Metni düzenleyin ve canlı önizlemede görünümünü özelleştirin.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-6 space-y-6">
                    
                    <FormField
                      control={form.control}
                      name="ottoman_font_family"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider text-shadow-drop">Yazı Tipi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 h-11 text-sm font-semibold shadow-inner">
                                <SelectValue placeholder="Yazı tipi seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Matbu" className="font-semibold">Matbu (Geleneksel)</SelectItem>
                              <SelectItem value="Rika" className="font-semibold">Rika (El Yazısı)</SelectItem>
                              <SelectItem value="Scheherazade New" className="font-semibold">Klasik Nesih</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ottoman_font_size"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <div className="flex justify-between items-center">
                            <FormLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider text-shadow-drop">Boyut: {field.value}px</FormLabel>
                          </div>
                          <Slider min={16} max={80} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} className="py-2" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ottomanContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Textarea 
                                placeholder="...Osmanlıca metin" 
                                {...field} 
                                ref={(e) => {
                                  field.ref(e);
                                  (ottomanTextareaRef as any).current = e;
                                }}
                                rows={6} 
                                dir="rtl" 
                                className="bg-slate-50/30 font-osmanlica text-3xl border-slate-100 rounded-2xl p-6 min-h-[180px] focus-visible:ring-primary/20 placeholder:text-slate-300 text-right shadow-inner text-shadow-heavy" 
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3 text-shadow-drop">
                        <Keyboard className="h-3.5 w-3.5" /> Sanal Harf Tuş Takımı
                      </div>
                      <div className="grid grid-cols-8 gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner" dir="rtl">
                        {ottomanChars.map((char) => (
                          <button
                            key={char}
                            type="button"
                            onClick={() => insertOttomanChar(char)}
                            className="h-10 text-lg font-osmanlica bg-white hover:bg-primary hover:text-white rounded-lg shadow-sm flex items-center justify-center transition-all font-bold border border-slate-100 active:scale-95 text-shadow-drop"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-modern rounded-[2rem] overflow-hidden bg-white">
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline text-2xl font-black text-slate-900 text-shadow-heavy">Kaynak & Bilgi</CardTitle>
                    <CardDescription className="text-xs text-slate-400 text-shadow-drop">Eser ve kişi bilgisini detaylandırın.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-6">
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              placeholder="Risale-i Nur Külliyatı, Sözler..." 
                              {...field} 
                              className="rounded-full border-slate-100 bg-slate-50/50 h-11 px-6 text-sm font-bold text-slate-600 shadow-inner focus-visible:ring-primary/20" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'siniflandirma' && (
              <Card className="border-none shadow-modern rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="font-headline text-2xl font-black text-slate-900 text-shadow-heavy">Kategoriler</CardTitle>
                  <CardDescription className="text-xs text-slate-400 text-shadow-drop">İçeriğin sergileneceği ana manevi kategorileri belirleyin.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 p-8">
                  {categories.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-xl bg-slate-50/60 border border-slate-100/50 shadow-sm">
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              const newValue = checked ? [...(field.value || []), item] : (field.value || []).filter((v) => v !== item);
                              field.onChange(newValue);
                            }}
                          />
                          <FormLabel className="text-sm font-bold text-slate-700 cursor-pointer text-shadow-drop">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'gorunum' && (
              <Card className="border-none shadow-modern rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="font-headline text-2xl font-black text-slate-900 text-shadow-heavy">Görsel Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <FormField
                    control={form.control}
                    name="content_font_size"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider text-shadow-drop">Türkçe Metin Boyutu: {field.value}px</FormLabel>
                        <Slider min={14} max={40} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-slate-800 uppercase tracking-wider text-shadow-drop">Etiketler (Virgülle Ayırın)</FormLabel>
                        <FormControl>
                          <Input placeholder="tahribat, ümit, tefekkür" {...field} className="rounded-xl border-slate-100 bg-slate-50/50 h-11 shadow-inner" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 text-shadow-drop">Canlı Önizleme</h2>
              <Badge variant="outline" className="text-[10px] text-[#f97316] border-[#f97316]/20 bg-white font-bold px-3 py-1 rounded-full shadow-sm">Anlık Senkronizasyon</Badge>
            </div>
            <div className="w-full drop-shadow-2xl">
              <VecizeCard article={previewArticle} isFeatured={true} isLink={false} />
            </div>
            <p className="text-[10px] text-center text-slate-400 italic px-4 text-shadow-drop">
              * Tasarladığınız bu şablon, indirme yöneticisi tarafından otomatik olarak 1080x1920 Instagram Story formatına dönüştürülecektir.
            </p>
          </div>

        </div>

      </div>
    </Form>
  );
}
