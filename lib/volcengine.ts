import type { LanguageCode, Example } from '@/types';

interface VolcengineMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface VolcengineRequest {
  model: string;
  messages: VolcengineMessage[];
  temperature: number;
}

interface VolcengineResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const VOLCENGINE_API_KEY = process.env.VOLCENGINE_API_KEY;
const VOLCENGINE_ENDPOINT = process.env.VOLCENGINE_ENDPOINT;

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

  return `Generate ${count} example sentences using the word "${word}" in ${sourceName}. For each example, provide both the ${sourceName} sentence and its ${targetName} translation.

Format each example as: source sentence | target translation

Return only the examples, one per line, with no additional text or numbering.`;
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
 * Generate example sentences using Volcengine Doubao API
 */
export async function generateExamples(
  word: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  count: number = 3
): Promise<Example[]> {
  // Check if API credentials are configured
  if (!VOLCENGINE_API_KEY || !VOLCENGINE_ENDPOINT) {
    return [];
  }

  try {
    const prompt = buildPrompt(word, sourceLang, targetLang, count);

    const request: VolcengineRequest = {
      model: 'doubao-pro-32k',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    };

    const response = await fetch(VOLCENGINE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VOLCENGINE_API_KEY}`
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const error = `Volcengine API error: ${response.status}`;
      console.error(error);
      return [];
    }

    const data: VolcengineResponse = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
      return [];
    }

    const content = data.choices[0].message.content;
    const examples = parseGeneratedExamples(content);

    // Limit to requested count
    return examples.slice(0, count);
  } catch (error) {
    console.error('Failed to generate examples with Volcengine:', error);
    return [];
  }
}
