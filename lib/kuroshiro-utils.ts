import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiroInstance: Kuroshiro | null = null;

/**
 * Initialize Kuroshiro (lazy initialization)
 */
async function getKuroshiro(): Promise<Kuroshiro> {
  if (!kuroshiroInstance) {
    try {
      console.log('[Kuroshiro] Initializing...');
      kuroshiroInstance = new Kuroshiro();
      console.log('[Kuroshiro] Created instance, loading analyzer...');
      await kuroshiroInstance.init(new KuromojiAnalyzer());
      console.log('[Kuroshiro] Analyzer loaded successfully');
    } catch (error) {
      console.error('[Kuroshiro] Initialization failed:', error);
      throw error;
    }
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
    console.error('[Kuroshiro] Conversion failed:', error);
    // Fallback: Return a message indicating the issue
    // In production, you might want to use an external API here
    return `[注音加载失败]`;
  }
}
