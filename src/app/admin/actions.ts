'use server';
import '@/firebase/server-config';
import { generateArticleDraft } from '@/ai/flows/generate-article-draft';
import { enrichArticle } from '@/ai/flows/enrich-article';
import { translateModernToOttoman } from '@/ai/flows/translate-text';
import { generateImage } from '@/ai/flows/generate-image';
import { firestore, storage } from '@/firebase/server-config';
import { FieldValue } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';
import { v4 as uuidv4 } from 'uuid';

/**
 * Teknik hata mesajlarını kullanıcı dostu Türkçe mesajlara dönüştürür.
 */
function formatAiError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    
    if (message.includes('404')) {
        return "Yapay zeka sistemi güncellendi. Lütfen sayfayı yenileyip tekrar deneyin.";
    }
    
    if (message.includes('429') || message.toLowerCase().includes('too many requests') || message.toLowerCase().includes('quota exceeded')) {
        return "Yapay zeka şu an çok yoğun. Lütfen 15-20 saniye bekleyip tekrar deneyin.";
  }
  
  if (message.toLowerCase().includes('overloaded') || message.includes('503')) {
    return "Yapay zeka sunucuları aşırı yüklü. Lütfen biraz bekleyip tekrar deneyin.";
  }

  return message || "Yapay zeka servisinde bir hata oluştu.";
}

export async function handleAiGeneration(prompt: string) {
  try {
    const result = await generateArticleDraft({ prompt });
    if (!result || result.title === 'Hata') {
        throw new Error(result.content || "AI'dan içerik oluşturulamadı.");
    }
    return result;
  } catch (error) {
    console.error('AI oluşturma başarısız oldu:', error);
    throw new Error(formatAiError(error));
  }
}

/**
 * Makale taslağı ve Osmanlıca çeviriyi tek bir akışta birleştiren senkronize eylem.
 */
export async function handleFullAiGeneration(prompt: string) {
    if (!prompt) {
        throw new Error('Vecize alanı boş olamaz.');
    }
    try {
        // Kota hatalarını minimize etmek için işlemleri ardışık yapıyoruz
        const articleResult = await handleAiGeneration(prompt);
        const translationResult = await handleTranslation(prompt);

        return {
            ...articleResult,
            ottomanContent: translationResult.ottomanTurkishText
        };
    } catch (error) {
        console.error('Tam AI oluşturma başarısız oldu:', error);
        throw new Error(formatAiError(error));
    }
}

export async function handleAiEnrichment(content: string) {
    try {
        const result = await enrichArticle({ content });
         if (!result || !result.content) {
            throw new Error("AI zenginleştirmesi boş bir içerik döndürdü.");
        }
        return result;
    } catch (error) {
        console.error('AI zenginleştirme başarısız oldu:', error);
        throw new Error(formatAiError(error));
    }
}

export async function handleEnrichAndSave(articleId: string, content: string) {
    if (!articleId || !content) {
        throw new Error('Makale ID ve içerik gereklidir.');
    }

    try {
        const enrichmentResult = await handleAiEnrichment(content);
        const newContent = enrichmentResult.content;

        const articleRef = firestore.collection('articles').doc(articleId);
        await articleRef.update({
            content: newContent,
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true, newContent };
    } catch (error) {
        console.error('Zenginleştirme ve kaydetme işlemi başarısız oldu:', error);
        throw new Error(formatAiError(error));
    }
}

export async function handleTranslation(text: string) {
    if (!text) {
        throw new Error('Çevrilecek metin boş olamaz.');
    }
    try {
        const result = await translateModernToOttoman({ modernTurkishText: text });
        if (!result || !result.ottomanTurkishText) {
            throw new Error('Çeviri sonucu alınamadı.');
        }
        return result;
    } catch (error) {
        console.error('Çeviri işlemi başarısız oldu:', error);
        throw new Error(formatAiError(error));
    }
}

export async function handleAiImageGeneration(prompt: string) {
  if (!prompt) {
    throw new Error('A prompt is required for image generation.');
  }

  try {
    const genkitResult = await generateImage({ prompt });
    const dataUri = genkitResult.imageDataUri;
    
    if (!dataUri) {
      throw new Error('AI did not return an image.');
    }

    const bucket = storage.bucket(firebaseConfig.storageBucket);
    const fileExtension = dataUri.substring(dataUri.indexOf('/') + 1, dataUri.indexOf(';'));
    const base64Data = dataUri.substring(dataUri.indexOf(',') + 1);
    const buffer = Buffer.from(base64Data, 'base64');
    
    const fileName = `generated-images/${uuidv4()}.${fileExtension}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: {
        contentType: `image/${fileExtension}`,
      },
    });

    await file.makePublic();

    return {
      imageUrl: file.publicUrl(),
      imageHint: prompt.split(' ').slice(0, 2).join(' '),
      description: `AI-generated image for: "${prompt}"`
    };

  } catch (error) {
    console.error('AI image generation and upload failed:', error);
    throw new Error(formatAiError(error));
  }
}
