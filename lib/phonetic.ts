import { pinyin } from 'pinyin-pro';
import type { LanguageCode } from '@/types';

/**
 * Generate phonetic notation for the given text based on language
 */
export function generatePhonetic(text: string, lang: LanguageCode): string | undefined {
  switch (lang) {
    case 'zh':
      return generateChinesePinyin(text);
    case 'ja':
      return generateJapaneseRomaji(text);
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
 * Generate romaji for Japanese text
 * Note: For MVP, we'll return a placeholder. Full implementation would use kuroshiro.
 */
function generateJapaneseRomaji(text: string): string {
  // For MVP: Japanese romaji generation is complex and requires kuroshiro + kuromoji
  // We'll implement a basic version that handles kana

  // Hiragana to romaji mapping (basic, incomplete)
  const hiraganaMap: Record<string, string> = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  };

  // Katakana to romaji (same as hiragana but different Unicode)
  const katakanaMap: Record<string, string> = {
    'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
    'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
    'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
    'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
    'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
    'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
    'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
    'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
    'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
    'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
    'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
    'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
    'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
    'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
    'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
  };

  let result = '';
  for (const char of text) {
    if (hiraganaMap[char]) {
      result += hiraganaMap[char];
    } else if (katakanaMap[char]) {
      result += katakanaMap[char];
    } else {
      result += char;
    }
  }

  return result || text;
}

/**
 * Generate IPA phonetic notation for English text
 * Note: For MVP, we'll use a simple dictionary. Full implementation would use a phonetic library.
 */
function generateEnglishPhonetic(text: string): string {
  // Basic English phonetic dictionary (very limited for MVP)
  const phoneticDict: Record<string, string> = {
    'hello': '/həˈloʊ/',
    'hi': '/haɪ/',
    'bye': '/baɪ/',
    'thank': '/θæŋk/',
    'thanks': '/θæŋks/',
    'yes': '/jɛs/',
    'no': '/noʊ/',
    'please': '/pliːz/',
    'sorry': '/ˈsɒri/',
    'welcome': '/ˈwɛlkəm/',
    'good': '/ɡʊd/',
    'morning': '/ˈmɔːrnɪŋ/',
    'afternoon': '/ˌæftərˈnuːn/',
    'evening': '/ˈiːvnɪŋ/',
    'night': '/naɪt/',
    'day': '/deɪ/',
    'today': '/təˈdeɪ/',
    'tomorrow': '/təˈmɒroʊ/',
    'yesterday': '/ˈjɛstərdeɪ/',
  };

  const normalized = text.toLowerCase().trim();
  return phoneticDict[normalized] || '';
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
