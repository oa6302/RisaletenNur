
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EnrichArticleInputSchema = z.object({
  content: z.string().describe('Yeniden yapılandırılacak mevcut makale içeriği.'),
});
export type EnrichArticleInput = z.infer<typeof EnrichArticleInputSchema>;

const EnrichArticleOutputSchema = z.object({
  content: z
    .string()
    .describe(
      'Yapay zeka tarafından "Karşılaştırma Tablosu, Ayet, Hadis, Soru, Vecize" formatına dönüştürülmüş içerik.'
    ),
});
export type EnrichArticleOutput = z.infer<typeof EnrichArticleOutputSchema>;

export async function enrichArticle(
  input: EnrichArticleInput
): Promise<EnrichArticleOutput> {
  return enrichArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enrichArticlePrompt',
  input: {schema: EnrichArticleInputSchema},
  output: {schema: EnrichArticleOutputSchema},
  prompt: `Sen, Risale-i Nur hakikatlerini pedagojik bir dille sunan bir yapay zeka alimisin. Görevin, sana verilen içeriği "Hakikat Kartları" serisine dönüştürmektir.

Mevcut Icerik: {{{content}}}

Aşağıdaki teknik ve üslup kurallarına uyarak bir HTML yapısı oluştur:

1. Her biri <div class="hakikat-card-inner"> içine alınmış 5 bağımsız blok oluştur.
2. HER BLOKTA ŞU SIRALAMAYI TAKİP ET:
   - Başlık (h2)
   - Karşılaştırma Tablosu (table)
   - Ayet (blockquote)
   - Hadis (blockquote)
   - Günün Sorusu (div.gunun-sorusu)
   - Risale-i Nur Vecizesi (div.nur-vecize)
3. VURGU KURALI: En vurucu kelimeleri <strong> etiketiyle sar.
4. Markdown KESİNLİKLE kullanma. Sadece HTML.`,
});

const enrichArticleFlow = ai.defineFlow(
  {
    name: 'enrichArticleFlow',
    inputSchema: EnrichArticleInputSchema,
    outputSchema: EnrichArticleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
