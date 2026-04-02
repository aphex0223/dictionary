import crypto from 'crypto';
import type { LanguageCode, SourceLanguageCode } from '@/types';

interface BaiduTranslateParams {
  text: string;
  targetLang: LanguageCode;
  sourceLang?: SourceLanguageCode;
}

interface BaiduResponse {
  trans_result: Array<{
    src: string;
    dst: string;
  }>;
  from: string;
  to: string;
}

const BAIDU_APP_ID = process.env.BAIDU_APP_ID;
const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY;
const BAIDU_API_URL = 'https://fanyi-api.baidu.com/api/trans/vip/translate';

// Map our language codes to Baidu's format
function mapToBaiduLang(lang: LanguageCode | SourceLanguageCode): string {
  const mapping: Record<string, string> = {
    en: 'en',
    ja: 'jp',
    zh: 'zh',
    auto: 'auto'
  };
  return mapping[lang] || 'auto';
}

// Map Baidu's detected language code back to our format
function mapFromBaiduLang(baiduLang: string): LanguageCode {
  const normalized = baiduLang.toLowerCase();

  if (normalized === 'en') return 'en';
  if (normalized === 'jp') return 'ja';
  if (normalized === 'zh') return 'zh';

  // Default to English for unsupported languages
  console.warn(`Unsupported Baidu language code: ${baiduLang}, defaulting to 'en'`);
  return 'en';
}

/**
 * Generate MD5 signature for Baidu API
 */
function generateSign(query: string, salt: string): string {
  const str = `${BAIDU_APP_ID}${query}${salt}${BAIDU_SECRET_KEY}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Translate text using Baidu Translate API
 */
export async function translateText(params: BaiduTranslateParams): Promise<{
  translation: string;
  detectedSourceLang: LanguageCode;
}> {
  if (!BAIDU_APP_ID || !BAIDU_SECRET_KEY) {
    throw new Error('BAIDU_APP_ID or BAIDU_SECRET_KEY is not configured');
  }

  if (!params.text || params.text.trim().length === 0) {
    throw new Error('Text to translate cannot be empty or whitespace-only');
  }

  const salt = Date.now().toString();
  const sign = generateSign(params.text, salt);

  const sourceLang = params.sourceLang && params.sourceLang !== 'auto'
    ? mapToBaiduLang(params.sourceLang)
    : 'auto';
  const targetLang = mapToBaiduLang(params.targetLang);

  const url = new URL(BAIDU_API_URL);
  url.searchParams.append('q', params.text);
  url.searchParams.append('from', sourceLang);
  url.searchParams.append('to', targetLang);
  url.searchParams.append('appid', BAIDU_APP_ID);
  url.searchParams.append('salt', salt);
  url.searchParams.append('sign', sign);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Baidu API error response:', errorText);
      throw new Error(`Baidu API error: ${response.status} - ${errorText}`);
    }

    const data: BaiduResponse = await response.json();
    console.log('Baidu API response:', JSON.stringify(data));

    if (!data.trans_result || data.trans_result.length === 0) {
      console.error('Invalid Baidu response:', JSON.stringify(data));
      throw new Error('No translation returned from Baidu');
    }

    const result = data.trans_result[0];
    const detectedLang = mapFromBaiduLang(data.from);

    return {
      translation: result.dst,
      detectedSourceLang: detectedLang,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Baidu translation failed: ${error.message}`);
    }
    throw new Error('Baidu translation failed: Unknown error');
  }
}
