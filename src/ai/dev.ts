'use server';
import { config } from 'dotenv';
config();

// Import flows to register them with the AI instance
import '@/ai/flows/generate-article-draft.ts';
import '@/ai/flows/suggest-topic-classification.ts';
import '@/ai/flows/enrich-article.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/generate-image.ts';

import { start } from 'genkit';
import { ai } from './genkit';

// Start the Genkit development server with registered flows and prompts
start({
  flows: ai.flows(),
  prompts: ai.prompts(),
});
