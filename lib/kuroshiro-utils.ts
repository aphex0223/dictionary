import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiroInstance: Kuroshiro | null = null;

/**
 * Initialize Kuroshiro (lazy initialization)
 */
async function getKuroshiro(): Promise<Kuroshiro> {
  if (!kuroshiroInstance) {
    kuroshiroInstance = new Kuroshiro();
    await kuroshiroInstance.init(new KuromojiAnalyzer());
  }
  return kuroshiroInstance;
}

/**
 * Convert Japanese text to kana and romaji
 * Returns format: "ひらがな (hiragana)"
 */
export async function convertJapaneseToKana(text: string): Promise<string> {
  try {
    const kuroshiro = await getKuroshiro();

    // Convert to hiragana
    const hiragana = await kuroshiro.convert(text, {
      to: 'hiragana',
      mode: 'normal'
    });

    // Convert to romaji
    const romaji = await kuroshiro.convert(text, {
      to: 'romaji',
      mode: 'normal'
    });

    // Return format: "hiragana (romaji)"
    return `${hiragana} (${romaji})`;
  } catch (error) {
    console.error('Failed to convert Japanese:', error);
    return '';
  }
}
