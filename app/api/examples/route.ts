import { NextRequest, NextResponse } from 'next/server';
import { generateExamples } from '@/lib/volcengine';
import type { LanguageCode } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ExamplesRequest {
  word: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
}

/**
 * POST /api/examples
 * Generate example sentences asynchronously
 */
export async function POST(request: NextRequest) {
  try {
    const body: ExamplesRequest = await request.json();

    if (!body.word || !body.sourceLang || !body.targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields', examples: [] },
        { status: 400 }
      );
    }

    const examples = await generateExamples(
      body.word,
      body.sourceLang,
      body.targetLang,
      1
    );

    return NextResponse.json({ examples });
  } catch (error) {
    console.error('Examples API error:', error);
    // Return empty examples on error instead of failing
    return NextResponse.json({ examples: [] });
  }
}
