'use server';

/**
 * @fileOverview Bu dosya, modern Türkçe metinleri Osmanlıca'ya çevirmek için bir Genkit akışı tanımlar.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateModernToOttomanInputSchema = z.object({
  modernTurkishText: z
    .string()
    .describe('Çevrilecek olan modern Türkçe metin.'),
});

export type TranslateModernToOttomanInput = z.infer<
  typeof TranslateModernToOttomanInputSchema
>;

const TranslateModernToOttomanOutputSchema = z.object({
  ottomanTurkishText: z
    .string()
    .describe("Osmanlıca'ya (Matbu hattı ile uyumlu) çevrilmiş metin."),
});

export type TranslateModernToOttomanOutput = z.infer<
  typeof TranslateModernToOttomanOutputSchema
>;

export async function translateModernToOttoman(
  input: TranslateModernToOttomanInput
): Promise<TranslateModernToOttomanOutput> {
  return translateModernToOttomanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateModernToOttomanPrompt',
  input: {schema: TranslateModernToOttomanInputSchema},
  output: {schema: TranslateModernToOttomanOutputSchema},
  prompt: `Sen modern Türkçe'den Osmanlıca'ya çeviri yapan bir uzman dilbilimcisin. Görevin, sana verilen modern Türkçe metni Osmanlıca'ya çevirmektir.

Bu çeviriyi yaparken KESİNLİKLE uyman gereken kurallar şunlardır:
1. Modern Türkçe'deki kelimeleri değiştirmeden, sadece Osmanlı alfabesiyle karşılıklarını yaz.
2. Kelimelerin anlamını koru ama formunu ASLA değiştirme.
3. Metni harekesiz (diacritics olmadan) yaz.
4. Orijinal metne harfiyen sadık kal.
5. Çevirinin Matbu hattıyla (klasik basılı Osmanlıca) yazılabilecek şekilde olması önemlidir.

Modern Türkçe Metin: {{{modernTurkishText}}}`,
});

const translateModernToOttomanFlow = ai.defineFlow(
  {
    name: 'translateModernToOttomanFlow',
    inputSchema: TranslateModernToOttomanInputSchema,
    outputSchema: TranslateModernToOttomanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
