import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/baidu';
import { generatePhonetic } from '@/lib/phonetic';
import type { TranslateRequest, TranslateResponse, LanguageCode } from '@/types';

// Runtime configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/translate
 * Main translation API endpoint that orchestrates the full workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Wrap main workflow in timeout (Fix #3: Add 30-second timeout)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000);
    });

    const workflowPromise = async () => {
      // Parse and validate input
      const body: TranslateRequest = await request.json();

      // Validate required fields
      if (!body.text) {
        return NextResponse.json(
          { error: 'Text is required', code: 'INVALID_INPUT', message: 'The text field cannot be empty' },
          { status: 400 }
        );
      }

      // Validate text length
      if (body.text.length > 500) {
        return NextResponse.json(
          { error: 'Text too long', code: 'INVALID_INPUT', message: 'Text must be 500 characters or less' },
          { status: 400 }
        );
      }

      // Validate target language
      const validLanguages: LanguageCode[] = ['en', 'ja', 'zh'];
      if (!body.targetLang || !validLanguages.includes(body.targetLang)) {
        return NextResponse.json(
          { error: 'Invalid target language', code: 'INVALID_INPUT', message: 'Target language must be one of: en, ja, zh' },
          { status: 400 }
        );
      }

      // Step 1: Translate with Baidu
      const translationResult = await translateText({
        text: body.text,
        targetLang: body.targetLang,
        sourceLang: body.sourceLang,
      });

      const { translation, detectedSourceLang } = translationResult;

      // Fix #4: Validate detected source language
      if (!validLanguages.includes(detectedSourceLang)) {
        return NextResponse.json(
          { error: 'Invalid detected language', code: 'INVALID_INPUT', message: 'Detected source language is not supported' },
          { status: 400 }
        );
      }

      // Step 2: Generate phonetics (synchronous, fast)
      const sourcePhonetic = generatePhonetic(body.text, detectedSourceLang);
      const targetPhonetic = generatePhonetic(translation, body.targetLang);

      // Step 3: Return structured response (examples loaded separately by client)
      const response: TranslateResponse = {
        sourceText: body.text,
        sourceLang: detectedSourceLang,
        targetLang: body.targetLang,
        translation,
        sourcePhonetic,
        targetPhonetic,
        examples: [], // Examples will be loaded asynchronously by the client
      };

      return NextResponse.json(response);
    };

    return await Promise.race([workflowPromise(), timeoutPromise]);
  } catch (error) {
    console.error('Translation API error:', error);

    // Handle timeout error
    if (error instanceof Error && error.message === 'Request timeout') {
      return NextResponse.json(
        { error: 'Request timeout', code: 'TIMEOUT', message: 'The request took too long to process' },
        { status: 408 }
      );
    }

    // Handle specific error cases
    if (error instanceof Error) {
      // Fix #2: Separate configuration errors from service errors
      // First check for configuration errors
      if (error.message.includes('BAIDU_APP_ID') || error.message.includes('BAIDU_SECRET_KEY')) {
        return NextResponse.json(
          { error: 'Configuration error', code: 'CONFIG_ERROR', message: 'Baidu API credentials are not configured' },
          { status: 500 }
        );
      }

      // Then check for service errors
      if (error.message.includes('Baidu')) {
        return NextResponse.json(
          { error: 'Translation service error', code: 'TRANSLATION_ERROR', message: 'Failed to translate text' },
          { status: 502 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
