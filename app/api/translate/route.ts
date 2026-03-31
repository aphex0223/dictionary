import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/deepl';
import { generatePhonetic } from '@/lib/phonetic';
import { fetchExamples } from '@/lib/tatoeba';
import { generateExamples } from '@/lib/volcengine';
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

    // Step 1: Translate with DeepL
    const translationResult = await translateText({
      text: body.text,
      targetLang: body.targetLang,
    });

    const { translation, detectedSourceLang } = translationResult;

    // Step 2: Generate phonetic notations in parallel
    const [sourcePhonetic, targetPhonetic] = await Promise.all([
      Promise.resolve(generatePhonetic(body.text, detectedSourceLang)),
      Promise.resolve(generatePhonetic(translation, body.targetLang)),
    ]);

    // Step 3: Fetch Tatoeba examples
    const { examples: tatoebaExamples } = await fetchExamples(
      body.text,
      detectedSourceLang,
      body.targetLang
    );

    // Step 4: Generate AI examples if needed (to reach 3 total)
    let allExamples = [...tatoebaExamples];
    const neededExamples = 3 - allExamples.length;

    if (neededExamples > 0) {
      const aiExamples = await generateExamples(
        body.text,
        detectedSourceLang,
        body.targetLang,
        neededExamples
      );
      allExamples = [...allExamples, ...aiExamples];
    }

    // Step 5: Limit to 3 examples max
    const finalExamples = allExamples.slice(0, 3);

    // Step 6: Return structured response
    const response: TranslateResponse = {
      sourceText: body.text,
      sourceLang: detectedSourceLang,
      targetLang: body.targetLang,
      translation,
      sourcePhonetic,
      targetPhonetic,
      examples: finalExamples,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Translation API error:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      // Check for configuration errors
      if (error.message.includes('DEEPL_API_KEY')) {
        return NextResponse.json(
          { error: 'Service configuration error', code: 'CONFIG_ERROR', message: 'Translation service is not configured' },
          { status: 500 }
        );
      }

      // Check for DeepL API errors
      if (error.message.includes('DeepL')) {
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
