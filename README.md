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
- **Deployment**: EdgeOne Pages (腾讯云), Vercel (备用)

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

### EdgeOne Pages (推荐)

详细部署指南请参考: [EdgeOne Pages 部署指南](docs/EDGEONE_MIGRATION.md)

快速步骤：

1. 登录腾讯云 EdgeOne Pages 控制台
2. 从 GitHub 导入此仓库
3. 配置环境变量（见下方）
4. 触发部署

### Vercel (备用)

Deploy to Vercel:

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Configure environment variables
4. Deploy

## License

MIT
