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
 * Convert Japanese text to kana and romaji using DeepSeek API
 * This is used in production Vercel environment where Kuroshiro doesn't work
 */
async function convertWithDeepSeek(text: string): Promise<string> {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  const DEEPSEEK_ENDPOINT = process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions';

  if (!DEEPSEEK_API_KEY) {
    console.error('[DeepSeek] API key not configured');
    return '';
  }

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a Japanese language expert. Convert Japanese text to hiragana and romaji. Return ONLY in this exact format: "hiragana (romaji)" with no extra text or explanation.'
          },
          {
            role: 'user',
            content: `Convert this Japanese text to hiragana and romaji: ${text}\n\nReturn format: hiragana (romaji)`
          }
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim() || '';
    console.log('[DeepSeek] Converted:', text, '->', result);
    return result;
  } catch (error) {
    console.error('[DeepSeek] Conversion failed:', error);
    return '';
  }
}

/**
 * Convert Japanese text to kana and romaji
 * Returns format: "ひらがな (hiragana)"
 */
export async function convertJapaneseToKana(text: string): Promise<string> {
  // Use DeepSeek API in production Vercel environment
  if (process.env.VERCEL === '1') {
    console.log('[Kuroshiro] Using DeepSeek API in Vercel environment');
    return await convertWithDeepSeek(text);
  }

  // Use Kuroshiro in local development
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
    return '';
  }
}
