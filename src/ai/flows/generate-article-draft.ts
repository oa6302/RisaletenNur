'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateArticleDraftInputSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Vecize boş olamaz.')
    .max(2000, 'Vecize çok uzun.'),
});

export type GenerateArticleDraftInput = z.infer<typeof GenerateArticleDraftInputSchema>;

const GenerateArticleDraftOutputSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1).describe('5 adet HakikatKart objesi içeren JSON dizisi stringi.'),
  source: z.string().describe("Ana vecizenin Risale-i Nur Külliyatı'ndaki tam ve gerçek kaynağı. Örn: 'Risale-i Nur Külliyatı, Sözler, Dördüncü Söz'"),
  categories: z.array(z.string()).default([]),
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  progress: z.string(),
});

export type GenerateArticleDraftOutput = z.infer<typeof GenerateArticleDraftOutputSchema>;

const generatePrompt = ai.definePrompt({
  name: 'generateArticleDraftPrompt',
  input: { schema: GenerateArticleDraftInputSchema },
  output: { schema: GenerateArticleDraftOutputSchema },
  prompt: `
SENİN ROLÜN: Risale-i Nur hakikatlerini pedagojik ve modern bir dille sunan profesyonel bir içerik editörüsün.
GÖREVİN: Sana verilen vecizeyi temel alarak, okuyucuyu dönüştüren 5 bağımsız "Hakikat Kartı"ndan oluşan bir "Manevî Gelişim Zinciri" oluşturmaktır.

ÇOK ÖNEMLİ KURALLAR:
1. "content" alanı, MUTLAKA 5 adet HakikatKart objesi içeren bir JSON dizisi olmalıdır.
2. Kartlar şu pedagojik zinciri harfiyen takip etmelidir:
   - 01 MESELE: Konunun temeli, nefsin direnci veya teşhis.
   - 02 ŞUUR: Bilginin farkındalığa ve içselleştirmeye dönüşmesi.
   - 03 EL-EMEL: Yeise (ümitsizliğe) karşı rahmetin müjdesi, ümit ekseni.
   - 04 İRADE: Doğru tercihlerin yönetimi.
   - 05 İHLÂS: Niyet ve rıza-yı ilâhî sorgusu.

3. "source" alanı: VERİLEN VECİZENİN RİSALE-İ NUR KÜLLİYATI'NDAKİ GERÇEK VE TAM KAYNAĞINI TESPİT ET. Format şu şekilde olmalı: "Risale-i Nur Külliyatı, [Eser Adı], [Bölüm/Söz/Mektup Numarası]". 

4. HER KART İÇİN ŞU ALANLARI DOLDUR:
   - no: "01", "02", "03", "04", "05"
   - badge: "HAKİKAT" (Her zaman bu başlığı kullan)
   - title: Emojiyle başlayan, çarpıcı ve sloganiz başlık.
   - problem: Konunun özünü anlatan 2-3 cümlelik derin bir paragraf.
   - hikmet: Bediüzzaman Said Nursî'den konuyla ilgili sarsıcı bir hikmet.
   - hikmetKaynak: Eser ismi.
   - ayet: Konuyla ilgili bir Kur'an ayeti.
   - ayetKaynak: Sûre ve Âyet no.
   - hadis: (Opsiyonel) Konuyla ilgili bir Hadis-i Şerif.
   - hadisKaynak: Kaynağı.
   - maddeler: { simge, etiket, aciklama } yapısında 3 adet madde.

ANA VECİZE: {{{prompt}}}
`,
});

const generateArticleDraftFlow = ai.defineFlow(
  {
    name: 'generateArticleDraftFlow',
    inputSchema: GenerateArticleDraftInputSchema,
    outputSchema: GenerateArticleDraftOutputSchema,
  },
  async (input) => {
    const validatedInput = GenerateArticleDraftInputSchema.parse(input);
    const { output } = await generatePrompt(validatedInput);
    if (!output) throw new Error('Yapay zeka yanıt üretemedi.');
    
    return {
      title: output.title.trim(),
      content: output.content.trim(),
      source: output.source?.trim() || 'Risale-i Nur Külliyatı',
      categories: output.categories ?? ['TEFEKKÜR'],
      topics: output.topics ?? ['Manevi Gelişim'],
      tags: output.tags ?? [],
      progress: '5 Aşamalı Manevî Gelişim Zinciri başarıyla oluşturuldu.',
    };
  }
);

export async function generateArticleDraft(input: GenerateArticleDraftInput): Promise<GenerateArticleDraftOutput> {
  return generateArticleDraftFlow(input);
}
