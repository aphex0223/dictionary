import type { LanguageCode, Example } from '@/types';

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_ENDPOINT = process.env.DEEPSEEK_ENDPOINT;

/**
 * Build a prompt for generating example sentences
 */
function buildPrompt(word: string, sourceLang: LanguageCode, targetLang: LanguageCode, count: number): string {
  const langNames: Record<LanguageCode, string> = {
    en: 'English',
    ja: 'Japanese',
    zh: 'Chinese'
  };

  const sourceName = langNames[sourceLang];
  const targetName = langNames[targetLang];

  return `Generate ${count} short example sentences with "${word}" in ${targetName}. Format: ${targetName} sentence | ${sourceName} translation\nExamples only, no numbering.`;
}

/**
 * Parse generated examples from the AI response
 */
function parseGeneratedExamples(content: string): Example[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const examples: Example[] = [];

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length === 2 && parts[0].length > 0 && parts[1].length > 0) {
      examples.push({
        source: parts[0],
        translation: parts[1],
        isGenerated: true
      });
    }
  }

  return examples;
}

/**
 * Generate fallback example sentences when API is not available
 */
function generateFallbackExamples(
  word: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  count: number
): Example[] {
  // Create simple contextual examples - source is targetLang, translation is sourceLang
  const examples: Example[] = [];

  // Create basic sentence patterns based on the word
  const patterns = [
    { en: `I use ${word} every day.`, zh: `我每天都使用${word}。`, ja: `私は毎日${word}を使います。` },
    { en: `This ${word} is very useful.`, zh: `这个${word}非常有用。`, ja: `この${word}はとても便利です。` },
    { en: `Please tell me about ${word}.`, zh: `请告诉我关于${word}的信息。`, ja: `${word}について教えてください。` },
  ];

  for (let i = 0; i < count && i < patterns.length; i++) {
    const pattern = patterns[i];
    examples.push({
      source: pattern[targetLang],  // Example in target language
      translation: pattern[sourceLang],  // Translation in source language
      isGenerated: true
    });
  }

  return examples;
}

/**
 * Generate example sentences using DeepSeek API
 */
export async function generateExamples(
  word: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  count: number = 3
): Promise<Example[]> {
  // Check if API credentials are configured
  if (!DEEPSEEK_API_KEY || !DEEPSEEK_ENDPOINT || DEEPSEEK_API_KEY === 'your_deepseek_api_key') {
    console.warn('DeepSeek API not configured, using fallback examples');
    return generateFallbackExamples(word, sourceLang, targetLang, count);
  }

  try {
    const prompt = buildPrompt(word, sourceLang, targetLang, count);

    const request: DeepSeekRequest = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    };

    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const error = `DeepSeek API error: ${response.status}`;
      console.error(error);
      return generateFallbackExamples(word, sourceLang, targetLang, count);
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
      return generateFallbackExamples(word, sourceLang, targetLang, count);
    }

    const content = data.choices[0].message.content;
    const examples = parseGeneratedExamples(content);

    // Limit to requested count
    return examples.slice(0, count);
  } catch (error) {
    console.error('Failed to generate examples with DeepSeek:', error);
    return generateFallbackExamples(word, sourceLang, targetLang, count);
  }
}
