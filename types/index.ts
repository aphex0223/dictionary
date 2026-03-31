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
  targetLang: LanguageCode;
  onTargetChange: (lang: LanguageCode) => void;
}

export interface TranslationResultProps {
  data: TranslateResponse;
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
