import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
export const genAI = new GoogleGenAI({ apiKey });

export const FALLBACK_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
];

export async function generateContentWithFallback(params: any): Promise<any> {
    const TIMEOUT_MS = 5000;

    const withTimeout = (promise: Promise<any>, timeoutMs: number) => {
        let timeoutHandle: NodeJS.Timeout;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutHandle = setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
        });

        return Promise.race([
            promise,
            timeoutPromise
        ]).finally(() => clearTimeout(timeoutHandle));
    };

    try {
        return await withTimeout(genAI.models.generateContent(params), TIMEOUT_MS);
    } catch (error: any) {
        if (error.message === 'TIMEOUT' || error.status === 503 || error.message?.includes('503') || error.message?.includes('UNAVAILABLE') || error.status === 429 || error.message?.includes('429')) {
            console.warn(`Model ${params.model} failed or timed out. Trying fallbacks...`);
            for (const fallback of FALLBACK_MODELS) {
                if (fallback === params.model) continue;
                try {
                    console.warn(`Trying fallback model: ${fallback}`);
                    return await withTimeout(genAI.models.generateContent({
                        ...params,
                        model: fallback
                    }), TIMEOUT_MS);
                } catch (fallbackError: any) {
                    console.warn(`Fallback model ${fallback} also failed.`);
                }
            }
        }
        throw error;
    }
}
