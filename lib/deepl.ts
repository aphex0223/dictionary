import type { LanguageCode, SourceLanguageCode } from '@/types';

interface DeepLTranslateParams {
  text: string;
  targetLang: LanguageCode;
  sourceLang?: SourceLanguageCode;
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api.deepl-pro.com/v2/translate'; // Pro API (alternate domain)

// Map our language codes to DeepL's format
function mapToDeepLLang(lang: LanguageCode): string {
  const mapping: Record<LanguageCode, string> = {
    en: 'EN',
    ja: 'JA',
    zh: 'ZH'
  };
  return mapping[lang];
}

// Map DeepL's detected language code back to our format
function mapFromDeepLLang(deeplLang: string): LanguageCode {
  const normalized = deeplLang.toUpperCase();

  // Handle language codes with region suffixes (e.g., EN-US, ZH-Hans)
  const baseCode = normalized.split('-')[0];

  if (baseCode === 'EN' || normalized.startsWith('EN')) return 'en';
  if (baseCode === 'JA' || normalized.startsWith('JA')) return 'ja';
  if (baseCode === 'ZH' || normalized.startsWith('ZH')) return 'zh';

  // Default to English for unsupported languages
  console.warn(`Unsupported DeepL language code: ${deeplLang}, defaulting to 'en'`);
  return 'en';
}

export async function translateText(
  params: DeepLTranslateParams
): Promise<{ translation: string; detectedSourceLang: LanguageCode }> {
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY is not configured');
  }

  if (!params.text || params.text.trim().length === 0) {
    throw new Error('Text to translate cannot be empty or whitespace-only');
  }

  const body = new URLSearchParams();
  body.append('auth_key', DEEPL_API_KEY);
  body.append('text', params.text);
  body.append('target_lang', mapToDeepLLang(params.targetLang));

  if (params.sourceLang && params.sourceLang !== 'auto') {
    body.append('source_lang', mapToDeepLLang(params.sourceLang));
  }

  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLResponse = await response.json();

    if (!data.translations || data.translations.length === 0) {
      throw new Error('No translation returned from DeepL');
    }

    const result = data.translations[0];

    return {
      translation: result.text,
      detectedSourceLang: mapFromDeepLLang(result.detected_source_language),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`DeepL translation failed: ${error.message}`, { cause: error });
    }
    throw new Error('DeepL translation failed: Unknown error');
  }
}
