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

Language selector for translation target. Source language is automatically detected.

**Props:**
```typescript
{
  targetLang: LanguageCode;  // Current target language ('en' | 'ja' | 'zh')
  onTargetChange: (lang: LanguageCode) => void;  // Target language change handler
}
```

**Note:** Source language detection is automatic. The component displays "自动检测 →" (Auto-detect) to indicate this behavior.

## TranslationResult

Display translation with phonetic notation.

**Props:**
```typescript
{
  data: TranslateResponse;  // Full translation response
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
