import { pinyin } from 'pinyin-pro';
import type { LanguageCode } from '@/types';
import { convertJapaneseToKana } from './kuroshiro-utils';

/**
 * Generate phonetic notation for the given text based on language
 * Now async to support Japanese kana conversion
 */
export async function generatePhonetic(text: string, lang: LanguageCode): Promise<string | undefined> {
  switch (lang) {
    case 'zh':
      return generateChinesePinyin(text);
    case 'ja':
      return await generateJapaneseRomaji(text);
    case 'en':
      return generateEnglishPhonetic(text);
    default:
      return undefined;
  }
}

/**
 * Generate pinyin for Chinese text
 */
function generateChinesePinyin(text: string): string {
  try {
    // Use pinyin-pro to generate pinyin with tone marks
    return pinyin(text, {
      toneType: 'symbol',
      type: 'array',
    }).join(' ');
  } catch (error) {
    console.error('Failed to generate pinyin:', error);
    return '';
  }
}

/**
 * Generate romaji for Japanese text using Kuroshiro
 * Returns format: "ひらがな (romaji)"
 */
async function generateJapaneseRomaji(text: string): Promise<string> {
  try {
    return await convertJapaneseToKana(text);
  } catch (error) {
    console.error('Failed to generate Japanese romaji:', error);
    return '';
  }
}

/**
 * Generate IPA phonetic notation for English text
 * Note: For MVP, returns empty string as IPA requires external dictionary
 */
function generateEnglishPhonetic(_text: string): string {
  // For English, we don't have a comprehensive IPA dictionary
  // Return empty string - the UI will handle display
  return '';
}

/**
 * Convert language code to Web Speech API language code
 */
export function languageCodeToSpeechLang(lang: LanguageCode): 'en-US' | 'ja-JP' | 'zh-CN' {
  const mapping: Record<LanguageCode, 'en-US' | 'ja-JP' | 'zh-CN'> = {
    en: 'en-US',
    ja: 'ja-JP',
    zh: 'zh-CN'
  };
  return mapping[lang];
}
