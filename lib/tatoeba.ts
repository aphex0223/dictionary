import type { LanguageCode, Example } from '@/types';

interface TatoebaResult {
  text: string;
  translations?: Array<{
    text: string;
  }>;
}

interface TatoebaResponse {
  results: TatoebaResult[];
}

const TATOEBA_API_URL = 'https://tatoeba.org/en/api_v0/search';

/**
 * Map our language codes to Tatoeba's 3-letter codes
 */
function mapToTatoebaLang(lang: LanguageCode): string {
  const mapping: Record<LanguageCode, string> = {
    en: 'eng',
    ja: 'jpn',
    zh: 'cmn' // Mandarin Chinese
  };
  return mapping[lang];
}

/**
 * Fetch example sentences from Tatoeba
 */
export async function fetchExamples(
  word: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode
): Promise<Example[]> {
  try {
    const params = new URLSearchParams({
      from: mapToTatoebaLang(sourceLang),
      to: mapToTatoebaLang(targetLang),
      query: word,
      limit: '3'
    });

    const response = await fetch(`${TATOEBA_API_URL}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout of 5 seconds
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`Tatoeba API error: ${response.status}`);
      return [];
    }

    const data: TatoebaResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return [];
    }

    const examples: Example[] = [];

    for (const result of data.results) {
      if (!result.translations || result.translations.length === 0) {
        continue;
      }

      examples.push({
        source: result.text,
        translation: result.translations[0].text,
        isGenerated: false
      });

      // Limit to 3 examples
      if (examples.length >= 3) {
        break;
      }
    }

    return examples;
  } catch (error) {
    console.error('Failed to fetch Tatoeba examples:', error);
    return [];
  }
}
