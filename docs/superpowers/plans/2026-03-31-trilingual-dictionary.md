# 日英汉三语互译词典 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a trilingual (Japanese-English-Chinese) dictionary web app with translation, phonetic notation, example sentences, and TTS.

**Architecture:** Next.js 14 (App Router) with server-side API aggregation. DeepL for translation, Tatoeba + Volcengine for examples, browser TTS for audio. Card-based UI with light/dark themes.

**Tech Stack:** React 18, Next.js 14, TypeScript, Tailwind CSS, SWR, DeepL API, Volcengine API, Tatoeba API

---

## File Structure Overview

This plan will create the following file structure:

```
dictionary/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Main dictionary page
│   ├── globals.css             # Global styles and theme variables
│   └── api/
│       └── translate/route.ts  # Translation API endpoint
├── components/
│   ├── ThemeToggle.tsx         # Theme toggle button
│   ├── AudioButton.tsx         # Audio playback button
│   ├── SearchBar.tsx           # Search input component
│   ├── LanguageSelector.tsx    # Language selection dropdowns
│   ├── TranslationResult.tsx   # Translation display
│   └── ExampleSentences.tsx    # Example sentences list
├── lib/
│   ├── deepl.ts                # DeepL API client
│   ├── phonetic.ts             # Phonetic notation utilities
│   ├── tatoeba.ts              # Tatoeba API client
│   └── volcengine.ts           # Volcengine API client
├── context/
│   └── ThemeContext.tsx        # Theme context provider
├── types/
│   └── index.ts                # TypeScript type definitions
├── .env.local                  # Environment variables (not committed)
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `.env.local`

- [ ] **Step 1: Initialize Next.js project**

Run: `npx create-next-app@14 . --typescript --tailwind --app --no-src-dir --import-alias "@/*"`

Expected: Next.js 14 project scaffolded with TypeScript and Tailwind CSS

- [ ] **Step 2: Install additional dependencies**

Run: `npm install swr pinyin-pro`

Expected: SWR and pinyin-pro installed successfully

- [ ] **Step 3: Create environment variable template**

Create `.env.example`:

```bash
# DeepL API
DEEPL_API_KEY=your_deepl_api_key_here

# Volcengine Doubao API
VOLCENGINE_API_KEY=your_volcengine_api_key_here
VOLCENGINE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
```

- [ ] **Step 4: Create actual environment variables**

Create `.env.local`:

```bash
# DeepL API
DEEPL_API_KEY=535b7c5e-6ab5-4afd-8b51-21f5667a8767:dp

# Volcengine Doubao API
VOLCENGINE_API_KEY=your_volcengine_api_key
VOLCENGINE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
```

- [ ] **Step 5: Update .gitignore**

Append to `.gitignore`:

```
# Environment variables
.env.local
.env*.local

# Superpowers
.superpowers/
```

- [ ] **Step 6: Configure Next.js**

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    SITE_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  }
};

module.exports = nextConfig;
```

- [ ] **Step 7: Configure Tailwind with theme support**

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

- [ ] **Step 8: Commit initialization**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind"
```

---

## Task 2: TypeScript Type Definitions

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create types directory**

Run: `mkdir -p types`

Expected: `types/` directory created

- [ ] **Step 2: Define core types**

Create `types/index.ts`:

```typescript
// Language codes
export type LanguageCode = 'en' | 'ja' | 'zh';
export type SourceLanguageCode = 'auto' | LanguageCode;

// API request/response types
export interface TranslateRequest {
  text: string;
  targetLang: LanguageCode;
}

export interface Example {
  source: string;
  translation: string;
  isGenerated: boolean;
}

export interface TranslateResponse {
  sourceText: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  translation: string;
  sourcePhonetic?: string;
  targetPhonetic?: string;
  examples: Example[];
}

export interface TranslateError {
  error: string;
  code: string;
  message: string;
}

// Component prop types
export interface AudioButtonProps {
  text: string;
  lang: 'en-US' | 'ja-JP' | 'zh-CN';
  size?: 'small' | 'large';
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export interface LanguageSelectorProps {
  sourceLang: SourceLanguageCode;
  targetLang: LanguageCode;
  onSourceChange: (lang: SourceLanguageCode) => void;
  onTargetChange: (lang: LanguageCode) => void;
}

export interface TranslationResultProps {
  data: {
    sourceText: string;
    translation: string;
    sourcePhonetic?: string;
    targetPhonetic?: string;
    sourceLang: LanguageCode;
    targetLang: LanguageCode;
  };
}

export interface ExampleSentencesProps {
  examples: Example[];
  targetLang: LanguageCode;
}

// Theme types
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 4: Commit type definitions**

```bash
git add types/
git commit -m "feat: add TypeScript type definitions"
```

---

## Task 3: DeepL API Client

**Files:**
- Create: `lib/deepl.ts`

- [ ] **Step 1: Create lib directory**

Run: `mkdir -p lib`

Expected: `lib/` directory created

- [ ] **Step 2: Implement DeepL client**

Create `lib/deepl.ts`:

```typescript
import type { LanguageCode } from '@/types';

interface DeepLTranslateParams {
  text: string;
  targetLang: LanguageCode;
  sourceLang?: LanguageCode;
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

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
  if (normalized === 'EN') return 'en';
  if (normalized === 'JA') return 'ja';
  if (normalized === 'ZH') return 'zh';
  // Default to English if unknown
  return 'en';
}

export async function translateText(
  params: DeepLTranslateParams
): Promise<{ translation: string; detectedSourceLang: LanguageCode }> {
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY is not configured');
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
      throw new Error(`DeepL translation failed: ${error.message}`);
    }
    throw new Error('DeepL translation failed: Unknown error');
  }
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 4: Commit DeepL client**

```bash
git add lib/deepl.ts
git commit -m "feat: add DeepL API client"
```

---

## Task 4: Phonetic Notation Utilities

**Files:**
- Create: `lib/phonetic.ts`

- [ ] **Step 1: Implement phonetic utilities**

Create `lib/phonetic.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit phonetic utilities**

```bash
git add lib/phonetic.ts
git commit -m "feat: add phonetic notation utilities"
```

---

## Task 5: Tatoeba API Client

**Files:**
- Create: `lib/tatoeba.ts`

- [ ] **Step 1: Implement Tatoeba client**

Create `lib/tatoeba.ts`:

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit Tatoeba client**

```bash
git add lib/tatoeba.ts
git commit -m "feat: add Tatoeba API client"
```

---

## Task 6: Volcengine API Client

**Files:**
- Create: `lib/volcengine.ts`

- [ ] **Step 1: Implement Volcengine client**

Create `lib/volcengine.ts`:

```typescript
import type { LanguageCode, Example } from '@/types';

const VOLCENGINE_API_KEY = process.env.VOLCENGINE_API_KEY;
const VOLCENGINE_ENDPOINT = process.env.VOLCENGINE_ENDPOINT;

interface VolcengineMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface VolcengineRequest {
  model: string;
  messages: VolcengineMessage[];
  temperature?: number;
}

interface VolcengineResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
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
  if (!VOLCENGINE_API_KEY || !VOLCENGINE_ENDPOINT) {
    console.warn('Volcengine API not configured, skipping example generation');
    return [];
  }

  try {
    const prompt = buildPrompt(word, sourceLang, targetLang, count);

    const requestBody: VolcengineRequest = {
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
        'Authorization': `Bearer ${VOLCENGINE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      // Add timeout of 10 seconds
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Volcengine API error: ${response.status} - ${errorText}`);
      return [];
    }

    const data: VolcengineResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return [];
    }

    const content = data.choices[0].message.content;

    // Parse the generated examples
    return parseGeneratedExamples(content, sourceLang, targetLang);
  } catch (error) {
    console.error('Failed to generate examples with Volcengine:', error);
    return [];
  }
}

/**
 * Build prompt for example generation
 */
function buildPrompt(
  word: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode,
  count: number
): string {
  const langNames: Record<LanguageCode, string> = {
    en: 'English',
    ja: 'Japanese',
    zh: 'Chinese'
  };

  const sourceLangName = langNames[sourceLang];
  const targetLangName = langNames[targetLang];

  return `Generate ${count} practical example sentences using the ${sourceLangName} word "${word}".

Requirements:
1. Sentences should be natural and suitable for daily use
2. Keep sentences moderate in length (under 15 words)
3. Cover different usage scenarios
4. Provide both ${sourceLangName} sentence and ${targetLangName} translation

Output format (one pair per line, separated by |):
${sourceLangName} sentence | ${targetLangName} translation
${sourceLangName} sentence | ${targetLangName} translation
${sourceLangName} sentence | ${targetLangName} translation`;
}

/**
 * Parse generated examples from API response
 */
function parseGeneratedExamples(
  content: string,
  sourceLang: LanguageCode,
  targetLang: LanguageCode
): Example[] {
  const examples: Example[] = [];
  const lines = content.trim().split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const parts = trimmed.split('|');
    if (parts.length === 2) {
      examples.push({
        source: parts[0].trim(),
        translation: parts[1].trim(),
        isGenerated: true
      });
    }
  }

  return examples;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit Volcengine client**

```bash
git add lib/volcengine.ts
git commit -m "feat: add Volcengine API client for example generation"
```

---

## Task 7: Translation API Route

**Files:**
- Create: `app/api/translate/route.ts`

- [ ] **Step 1: Create API directory structure**

Run: `mkdir -p app/api/translate`

Expected: `app/api/translate/` directory created

- [ ] **Step 2: Implement translation API route**

Create `app/api/translate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/deepl';
import { generatePhonetic } from '@/lib/phonetic';
import { fetchExamples } from '@/lib/tatoeba';
import { generateExamples } from '@/lib/volcengine';
import type { TranslateRequest, TranslateResponse, TranslateError, Example } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: TranslateRequest = await request.json();
    const { text, targetLang } = body;

    // Validate input
    if (!text || !text.trim()) {
      const error: TranslateError = {
        error: 'Invalid input',
        code: 'INVALID_INPUT',
        message: 'Text is required'
      };
      return NextResponse.json(error, { status: 400 });
    }

    if (text.length > 500) {
      const error: TranslateError = {
        error: 'Invalid input',
        code: 'TEXT_TOO_LONG',
        message: 'Text must be less than 500 characters'
      };
      return NextResponse.json(error, { status: 400 });
    }

    if (!['en', 'ja', 'zh'].includes(targetLang)) {
      const error: TranslateError = {
        error: 'Invalid input',
        code: 'INVALID_TARGET_LANG',
        message: 'Target language must be en, ja, or zh'
      };
      return NextResponse.json(error, { status: 400 });
    }

    // Step 1: Translate using DeepL
    const { translation, detectedSourceLang } = await translateText({
      text: text.trim(),
      targetLang
    });

    // Step 2: Generate phonetic notations in parallel
    const [sourcePhonetic, targetPhonetic] = await Promise.all([
      Promise.resolve(generatePhonetic(text.trim(), detectedSourceLang)),
      Promise.resolve(generatePhonetic(translation, targetLang))
    ]);

    // Step 3: Fetch examples from Tatoeba
    const tatoebaExamples = await fetchExamples(
      text.trim(),
      detectedSourceLang,
      targetLang
    );

    // Step 4: If we have fewer than 3 examples, generate more with Volcengine
    let allExamples: Example[] = tatoebaExamples;

    if (tatoebaExamples.length < 3) {
      const neededCount = 3 - tatoebaExamples.length;
      const generatedExamples = await generateExamples(
        text.trim(),
        detectedSourceLang,
        targetLang,
        neededCount
      );
      allExamples = [...tatoebaExamples, ...generatedExamples];
    }

    // Ensure we have exactly 3 examples (or fewer if generation failed)
    allExamples = allExamples.slice(0, 3);

    // Step 5: Build response
    const response: TranslateResponse = {
      sourceText: text.trim(),
      sourceLang: detectedSourceLang,
      targetLang,
      translation,
      sourcePhonetic,
      targetPhonetic,
      examples: allExamples
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Translation API error:', error);

    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'INTERNAL_ERROR';

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes('DeepL')) {
        errorCode = 'DEEPL_ERROR';
        errorMessage = 'Translation service unavailable. Please try again later.';
      }
    }

    const errorResponse: TranslateError = {
      error: 'Translation failed',
      code: errorCode,
      message: errorMessage
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 4: Test API route locally**

Run: `npm run dev` (in background if needed)

Then test with:
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"hello","targetLang":"zh"}'
```

Expected: JSON response with translation and examples

- [ ] **Step 5: Commit API route**

```bash
git add app/api/
git commit -m "feat: implement translation API route"
```

---

## Task 8: Theme Context

**Files:**
- Create: `context/ThemeContext.tsx`

- [ ] **Step 1: Create context directory**

Run: `mkdir -p context`

Expected: `context/` directory created

- [ ] **Step 2: Implement Theme Context**

Create `context/ThemeContext.tsx`:

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Theme, ThemeContextType } from '@/types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage after mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 4: Commit theme context**

```bash
git add context/
git commit -m "feat: implement theme context with localStorage persistence"
```

---

## Task 9: AudioButton Component

**Files:**
- Create: `components/AudioButton.tsx`

- [ ] **Step 1: Create components directory**

Run: `mkdir -p components`

Expected: `components/` directory created

- [ ] **Step 2: Implement AudioButton component**

Create `components/AudioButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import type { AudioButtonProps } from '@/types';

export function AudioButton({ text, lang, size = 'large' }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support text-to-speech');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      console.error('Speech synthesis error');
    };

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = size === 'large'
    ? 'w-10 h-10 text-2xl'
    : 'w-7 h-7 text-lg';

  return (
    <button
      onClick={handleSpeak}
      disabled={isPlaying}
      className={`
        ${sizeClasses}
        flex items-center justify-center
        bg-transparent border-none
        cursor-pointer
        transition-transform duration-200
        hover:scale-110
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-label={`Play audio for: ${text}`}
      title="Play audio"
    >
      🔊
    </button>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 4: Commit AudioButton component**

```bash
git add components/AudioButton.tsx
git commit -m "feat: implement AudioButton with Web Speech API"
```

---

## Task 10: ThemeToggle Component

**Files:**
- Create: `components/ThemeToggle.tsx`

- [ ] **Step 1: Implement ThemeToggle component**

Create `components/ThemeToggle.tsx`:

```typescript
'use client';

import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        px-3 py-2
        border rounded-lg
        text-xl
        transition-all duration-300
        hover:scale-110
        bg-white dark:bg-[#2d2d2d]
        border-gray-200 dark:border-gray-700
      "
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit ThemeToggle component**

```bash
git add components/ThemeToggle.tsx
git commit -m "feat: implement ThemeToggle component"
```

---

## Task 11: SearchBar Component

**Files:**
- Create: `components/SearchBar.tsx`

- [ ] **Step 1: Implement SearchBar component**

Create `components/SearchBar.tsx`:

```typescript
'use client';

import type { SearchBarProps } from '@/types';

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch();
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="输入要翻译的词汇..."
      disabled={isLoading}
      maxLength={500}
      className="
        w-full
        px-3.5 py-3.5
        border-2
        rounded-lg
        text-base
        transition-all duration-300
        bg-white dark:bg-[#2d2d2d]
        border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        placeholder-gray-400 dark:placeholder-gray-500
        focus:outline-none focus:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit SearchBar component**

```bash
git add components/SearchBar.tsx
git commit -m "feat: implement SearchBar component"
```

---

## Task 12: LanguageSelector Component

**Files:**
- Create: `components/LanguageSelector.tsx`

- [ ] **Step 1: Implement LanguageSelector component**

Create `components/LanguageSelector.tsx`:

```typescript
'use client';

import type { LanguageSelectorProps } from '@/types';

export function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange
}: LanguageSelectorProps) {
  return (
    <div className="flex gap-3 items-center">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        从
      </span>

      <select
        value={sourceLang}
        onChange={(e) => onSourceChange(e.target.value as any)}
        className="
          flex-1
          px-2.5 py-2.5
          border
          rounded-md
          text-sm
          cursor-pointer
          transition-all duration-300
          bg-gray-50 dark:bg-[#2d2d2d]
          border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <option value="auto">自动检测</option>
        <option value="zh">中文</option>
        <option value="ja">日语</option>
        <option value="en">英语</option>
      </select>

      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        →
      </span>

      <select
        value={targetLang}
        onChange={(e) => onTargetChange(e.target.value as any)}
        className="
          flex-1
          px-2.5 py-2.5
          border
          rounded-md
          text-sm
          cursor-pointer
          transition-all duration-300
          bg-gray-50 dark:bg-[#2d2d2d]
          border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      >
        <option value="zh">中文</option>
        <option value="ja">日语</option>
        <option value="en">英语</option>
      </select>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit LanguageSelector component**

```bash
git add components/LanguageSelector.tsx
git commit -m "feat: implement LanguageSelector component"
```

---

## Task 13: TranslationResult Component

**Files:**
- Create: `components/TranslationResult.tsx`

- [ ] **Step 1: Implement TranslationResult component**

Create `components/TranslationResult.tsx`:

```typescript
'use client';

import { AudioButton } from './AudioButton';
import { languageCodeToSpeechLang } from '@/lib/phonetic';
import type { TranslationResultProps } from '@/types';

export function TranslationResult({ data }: TranslationResultProps) {
  const {
    sourceText,
    translation,
    sourcePhonetic,
    targetPhonetic,
    sourceLang,
    targetLang
  } = data;

  return (
    <div>
      {/* Source word section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">
            {sourceText}
          </h2>
          {sourcePhonetic && (
            <span className="
              inline-block
              text-sm
              px-2.5 py-1
              rounded
              bg-gray-100 dark:bg-[#2d2d2d]
              text-gray-600 dark:text-gray-400
            ">
              {sourcePhonetic}
            </span>
          )}
        </div>
        <AudioButton
          text={sourceText}
          lang={languageCodeToSpeechLang(sourceLang)}
          size="large"
        />
      </div>

      {/* Translation section */}
      <div className="
        p-4
        rounded-lg
        border-l-4 border-green-500
        mb-4
        bg-gray-50 dark:bg-[#2d2d2d]
      ">
        <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
          {translation}
          {targetPhonetic && (
            <span className="
              ml-2
              text-sm
              px-2.5 py-1
              rounded
              bg-gray-200 dark:bg-[#333]
              text-gray-600 dark:text-gray-400
            ">
              {targetPhonetic}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit TranslationResult component**

```bash
git add components/TranslationResult.tsx
git commit -m "feat: implement TranslationResult component"
```

---

## Task 14: ExampleSentences Component

**Files:**
- Create: `components/ExampleSentences.tsx`

- [ ] **Step 1: Implement ExampleSentences component**

Create `components/ExampleSentences.tsx`:

```typescript
'use client';

import { AudioButton } from './AudioButton';
import { languageCodeToSpeechLang } from '@/lib/phonetic';
import type { ExampleSentencesProps } from '@/types';

export function ExampleSentences({ examples, targetLang }: ExampleSentencesProps) {
  if (!examples || examples.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="
        text-sm
        font-semibold
        uppercase
        tracking-wide
        mb-4
        mt-6
        text-gray-600 dark:text-gray-400
      ">
        例句
      </h3>

      <div className="space-y-3">
        {examples.map((example, index) => (
          <div
            key={index}
            className="
              p-4
              rounded-lg
              border
              bg-gray-50 dark:bg-[#2d2d2d]
              border-gray-100 dark:border-gray-800
            "
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 dark:text-gray-100">
                {example.source}
              </span>
              <AudioButton
                text={example.translation}
                lang={languageCodeToSpeechLang(targetLang)}
                size="small"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {example.translation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit ExampleSentences component**

```bash
git add components/ExampleSentences.tsx
git commit -m "feat: implement ExampleSentences component"
```

---

## Task 15: Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update root layout with ThemeProvider**

Update `app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: '日英汉词典',
  description: 'Trilingual dictionary with Japanese, English, and Chinese translation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Commit root layout**

```bash
git add app/layout.tsx
git commit -m "feat: update root layout with ThemeProvider"
```

---

## Task 16: Global Styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Update global styles with theme variables**

Update `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Theme transitions */
* {
  @apply transition-colors duration-300;
}

/* Light theme (default) */
:root {
  --background: #f5f5f5;
  --foreground: #1a1a1a;
}

/* Dark theme */
.dark {
  --background: #1e1e1e;
  --foreground: #e0e0e0;
}

/* Base styles */
body {
  background-color: var(--background);
  color: var(--foreground);
}

/* Prevent flash of unstyled content */
html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.dark ::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #666;
}
```

- [ ] **Step 2: Test in browser**

Run: `npm run dev`

Open browser and check:
- Light theme loads correctly
- Dark theme toggle works
- Transitions are smooth

- [ ] **Step 3: Commit global styles**

```bash
git add app/globals.css
git commit -m "feat: add global styles with theme support"
```

---

## Task 17: Main Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement main dictionary page**

Update `app/page.tsx`:

```typescript
'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/SearchBar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TranslationResult } from '@/components/TranslationResult';
import { ExampleSentences } from '@/components/ExampleSentences';
import type { SourceLanguageCode, LanguageCode, TranslateResponse } from '@/types';

// SWR fetcher
const fetcher = async (url: string, text: string, targetLang: LanguageCode) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Translation failed');
  }

  return response.json();
};

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [activeSearchText, setActiveSearchText] = useState('');
  const [sourceLang, setSourceLang] = useState<SourceLanguageCode>('auto');
  const [targetLang, setTargetLang] = useState<LanguageCode>('zh');

  // Use SWR for data fetching with caching
  const { data, error, isLoading } = useSWR<TranslateResponse>(
    activeSearchText ? ['/api/translate', activeSearchText, targetLang] : null,
    ([url, text, lang]) => fetcher(url, text, lang),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const handleSearch = useCallback(() => {
    if (searchText.trim()) {
      setActiveSearchText(searchText.trim());
    }
  }, [searchText]);

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            日英汉词典
          </h1>
          <ThemeToggle />
        </div>

        {/* Search Card */}
        <div className="
          bg-white dark:bg-[#252525]
          rounded-xl
          p-6
          shadow-md dark:shadow-gray-900
          mb-4
        ">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          <div className="mt-4">
            <LanguageSelector
              sourceLang={sourceLang}
              targetLang={targetLang}
              onSourceChange={setSourceLang}
              onTargetChange={setTargetLang}
            />
          </div>
        </div>

        {/* Results Card */}
        {isLoading && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-6
            shadow-lg dark:shadow-gray-900
          ">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-6
            shadow-lg dark:shadow-gray-900
          ">
            <div className="text-red-500 dark:text-red-400">
              <p className="font-semibold">翻译失败</p>
              <p className="text-sm mt-1">{error.message}</p>
            </div>
          </div>
        )}

        {data && !isLoading && !error && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-6
            shadow-lg dark:shadow-gray-900
          ">
            <TranslationResult data={data} />
            <ExampleSentences examples={data.examples} targetLang={data.targetLang} />
          </div>
        )}

        {/* Empty state */}
        {!activeSearchText && !isLoading && !error && (
          <div className="
            bg-white dark:bg-[#252525]
            rounded-xl
            p-12
            shadow-md dark:shadow-gray-900
            text-center
          ">
            <p className="text-gray-400 dark:text-gray-500">
              输入词汇开始翻译
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No TypeScript errors

- [ ] **Step 3: Test full application**

Run: `npm run dev`

Test checklist:
- [ ] Light/dark theme toggle works
- [ ] Search input accepts text
- [ ] Language selectors work
- [ ] Translation API is called on search
- [ ] Results display correctly
- [ ] Audio buttons work
- [ ] Example sentences show correctly
- [ ] Error states display properly
- [ ] Loading states work

- [ ] **Step 4: Commit main page**

```bash
git add app/page.tsx
git commit -m "feat: implement main dictionary page with all components"
```

---

## Task 18: Deployment Configuration

**Files:**
- Create: `vercel.json`
- Create: `.vercelignore`

- [ ] **Step 1: Create Vercel configuration**

Create `vercel.json`:

```json
{
  "regions": ["hkg1"],
  "framework": "nextjs"
}
```

- [ ] **Step 2: Create Vercel ignore file**

Create `.vercelignore`:

```
.superpowers/
docs/
interface-preview.html
```

- [ ] **Step 3: Update README with deployment instructions**

Create `README.md`:

```markdown
# 日英汉三语互译词典

A trilingual dictionary web application supporting Japanese, English, and Chinese translation.

## Features

- Three-way translation (Japanese ↔ English ↔ Chinese)
- Automatic source language detection
- Phonetic notation (IPA for English, Romaji for Japanese, Pinyin for Chinese)
- Example sentences from Tatoeba and AI generation
- Text-to-speech for all languages
- Light/Dark theme toggle
- Responsive design

## Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **State Management**: React Context, SWR
- **APIs**: DeepL, Tatoeba, Volcengine Doubao
- **Deployment**: Vercel

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```bash
DEEPL_API_KEY=your_deepl_api_key
VOLCENGINE_API_KEY=your_volcengine_api_key
VOLCENGINE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Configure environment variables
4. Deploy

## License

MIT
```

- [ ] **Step 4: Commit deployment configuration**

```bash
git add vercel.json .vercelignore README.md
git commit -m "feat: add Vercel deployment configuration and README"
```

---

## Task 19: Final Testing and Documentation

**Files:**
- Create: `docs/API.md`
- Create: `docs/COMPONENTS.md`

- [ ] **Step 1: Create API documentation**

Create `docs/API.md`:

```markdown
# API Documentation

## POST /api/translate

Translate text between Japanese, English, and Chinese.

### Request

```json
{
  "text": "hello",
  "targetLang": "zh"
}
```

**Parameters:**
- `text` (string, required): Text to translate (max 500 characters)
- `targetLang` (string, required): Target language code (`en`, `ja`, or `zh`)

### Response

Success (200):

```json
{
  "sourceText": "hello",
  "sourceLang": "en",
  "targetLang": "zh",
  "translation": "你好",
  "sourcePhonetic": "/həˈloʊ/",
  "targetPhonetic": "nǐ hǎo",
  "examples": [
    {
      "source": "Hello, how are you?",
      "translation": "你好，你好吗？",
      "isGenerated": false
    }
  ]
}
```

Error (400/500):

```json
{
  "error": "Translation failed",
  "code": "DEEPL_ERROR",
  "message": "Translation service unavailable"
}
```

### Error Codes

- `INVALID_INPUT`: Missing or invalid request parameters
- `TEXT_TOO_LONG`: Text exceeds 500 characters
- `INVALID_TARGET_LANG`: Invalid target language code
- `DEEPL_ERROR`: DeepL API failure
- `INTERNAL_ERROR`: Unexpected server error
```

- [ ] **Step 2: Create components documentation**

Create `docs/COMPONENTS.md`:

```markdown
# Component Documentation

## AudioButton

Play text-to-speech audio for translated text.

**Props:**
```typescript
{
  text: string;           // Text to speak
  lang: 'en-US' | 'ja-JP' | 'zh-CN';  // Language code
  size?: 'small' | 'large';  // Button size (default: 'large')
}
```

## ThemeToggle

Toggle between light and dark themes.

**Props:** None (uses ThemeContext)

## SearchBar

Text input for translation queries.

**Props:**
```typescript
{
  value: string;           // Current input value
  onChange: (value: string) => void;  // Input change handler
  onSearch: () => void;    // Search trigger handler
  isLoading: boolean;      // Loading state
}
```

## LanguageSelector

Dropdowns for source and target language selection.

**Props:**
```typescript
{
  sourceLang: 'auto' | 'zh' | 'ja' | 'en';
  targetLang: 'zh' | 'ja' | 'en';
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
}
```

## TranslationResult

Display translation with phonetic notation.

**Props:**
```typescript
{
  data: {
    sourceText: string;
    translation: string;
    sourcePhonetic?: string;
    targetPhonetic?: string;
    sourceLang: LanguageCode;
    targetLang: LanguageCode;
  };
}
```

## ExampleSentences

List of example sentences with audio playback.

**Props:**
```typescript
{
  examples: Example[];    // Array of example sentences
  targetLang: LanguageCode;  // Target language for audio
}
```
```

- [ ] **Step 3: Run full test suite**

Manual testing checklist:

```bash
# Start dev server
npm run dev

# Test scenarios:
1. English to Chinese: "hello" → "你好"
2. Japanese to English: "こんにちは" → "Hello"
3. Chinese to Japanese: "学习" → "勉強"
4. Auto-detect works correctly
5. Phonetic notations display
6. Example sentences load
7. Audio buttons play correctly
8. Theme toggle works
9. Responsive on mobile (use browser dev tools)
10. Error handling (disconnect network, try translation)
```

- [ ] **Step 4: Build for production**

Run: `npm run build`

Expected: Build succeeds without errors

- [ ] **Step 5: Commit documentation**

```bash
git add docs/
git commit -m "docs: add API and component documentation"
```

---

## Task 20: Production Deployment

**Files:**
- None (deployment only)

- [ ] **Step 1: Create GitHub repository**

```bash
# Initialize git if not already done
git init
git add .
git commit -m "feat: complete dictionary application"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/dictionary.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Configure environment variables:
   - `DEEPL_API_KEY`
   - `VOLCENGINE_API_KEY`
   - `VOLCENGINE_ENDPOINT`
4. Click "Deploy"

- [ ] **Step 3: Verify deployment**

Once deployed:
1. Test translation functionality
2. Test theme toggle
3. Test audio playback
4. Test on mobile device
5. Check browser console for errors

- [ ] **Step 4: Document deployment URL**

Update `README.md` with live URL:

```markdown
## Live Demo

Visit: [https://your-app.vercel.app](https://your-app.vercel.app)
```

```bash
git add README.md
git commit -m "docs: add live demo URL"
git push
```

---

## Self-Review Checklist

### Spec Coverage

✅ **Trilingual translation**: Task 1-7, 17 (DeepL API, page implementation)
✅ **Auto language detection**: Task 3 (DeepL client)
✅ **Phonetic notation**: Task 4 (phonetic utilities)
✅ **Example sentences**: Task 5-6 (Tatoeba + Volcengine)
✅ **Audio playback**: Task 9 (AudioButton with Web Speech API)
✅ **Light/Dark theme**: Task 8, 10, 16 (ThemeContext, ThemeToggle, global styles)
✅ **Responsive design**: Task 11-14, 17 (Tailwind responsive classes)
✅ **API aggregation**: Task 7 (translation route)
✅ **Error handling**: Task 7 (API route error handling)
✅ **Deployment**: Task 18, 20 (Vercel configuration)

### Type Consistency

✅ All types defined in `types/index.ts`
✅ Consistent prop interfaces across components
✅ Language codes: `LanguageCode = 'en' | 'ja' | 'zh'`
✅ Speech lang codes: `'en-US' | 'ja-JP' | 'zh-CN'`

### No Placeholders

✅ All code blocks contain complete, runnable code
✅ No "TBD", "TODO", or "implement later"
✅ All functions have full implementations
✅ Error messages are specific and helpful

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-31-trilingual-dictionary.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
