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
