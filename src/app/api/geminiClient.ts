import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
export const genAI = new GoogleGenAI({ apiKey });

export const FALLBACK_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
];

export async function generateContentWithFallback(params: any): Promise<any> {
    try {
        return await genAI.models.generateContent(params);
    } catch (error: any) {
        if (error.status === 503 || error.message?.includes('503') || error.message?.includes('UNAVAILABLE') || error.status === 429 || error.message?.includes('429')) {
            console.warn(`Model ${params.model} failed. Trying fallbacks...`);
            for (const fallback of FALLBACK_MODELS) {
                if (fallback === params.model) continue;
                try {
                    console.warn(`Trying fallback model: ${fallback}`);
                    return await genAI.models.generateContent({
                        ...params,
                        model: fallback
                    });
                } catch (fallbackError: any) {
                    console.warn(`Fallback model ${fallback} also failed.`);
                }
            }
        }
        throw error;
    }
}
