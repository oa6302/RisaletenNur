'use server';

/**
 * @fileOverview Bu dosya, içerik için konu sınıflandırmaları önermek için bir Genkit akışı tanımlar.
 *
 * - suggestTopicClassification - İçerik için ilgili konuları öneren bir fonksiyon.
 * - SuggestTopicClassificationInput - suggestTopicClassification fonksiyonu için giriş türü.
 * - SuggestTopicClassificationOutput - suggestTopicClassification fonksiyonu için dönüş türü.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const SuggestTopicClassificationInputSchema = z.object({
  content: z
    .string()
    .describe('Konu sınıflandırmalarının önerileceği içerik.'),
});
export type SuggestTopicClassificationInput = z.infer<
  typeof SuggestTopicClassificationInputSchema
>;

const SuggestTopicClassificationOutputSchema = z.object({
  suggestedTopics: z
    .array(z.string())
    .describe('İçerik için önerilen konuların bir dizisi.'),
});
export type SuggestTopicClassificationOutput = z.infer<
  typeof SuggestTopicClassificationOutputSchema
>;

export async function suggestTopicClassification(
  input: SuggestTopicClassificationInput
): Promise<SuggestTopicClassificationOutput> {
  return suggestTopicClassificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTopicClassificationPrompt',
  input: {schema: SuggestTopicClassificationInputSchema},
  output: {schema: SuggestTopicClassificationOutputSchema},
  prompt: `Aşağıdaki içerik için ilgili konuları önerin. Konuları bir JSON dize dizisi olarak döndürün.

İçerik: {{{content}}}`,
});

const suggestTopicClassificationFlow = ai.defineFlow(
  {
    name: 'suggestTopicClassificationFlow',
    inputSchema: SuggestTopicClassificationInputSchema,
    outputSchema: SuggestTopicClassificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
