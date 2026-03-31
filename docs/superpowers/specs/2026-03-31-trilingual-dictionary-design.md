# 日英汉三语互译词典 - 设计文档

**项目名称**: 日英汉三语互译词典
**设计日期**: 2026-03-31
**目标平台**: Web (H5)
**部署方式**: Vercel

---

## 1. 项目概述

### 1.1 项目目标

构建一个简洁高效的日英汉三语互译在线词典，支持：
- 三种语言的两两互译（日↔英、日↔中、英↔中）
- 自动检测源语言
- 音标/假名/拼音展示
- 多个实用例句及翻译
- 语音朗读功能（词汇和例句）
- 深浅色主题切换

### 1.2 核心特性

- **翻译质量**: 使用DeepL API确保翻译准确度
- **音标注音**: 自动生成英语IPA音标、日语假名注音、中文拼音
- **例句来源**: Tatoeba开源例句库 + 火山引擎Doubao AI生成
- **语音合成**: 浏览器原生Web Speech API
- **界面设计**: 卡片式布局，支持深浅色主题
- **响应式**: 移动端优先，适配各种屏幕尺寸

---

## 2. 技术栈

### 2.1 前端技术

- **框架**: React 18 + Next.js 14 (App Router)
- **样式**: Tailwind CSS + CSS Variables
- **状态管理**: React Context (主题) + SWR (数据缓存)
- **TypeScript**: 全面类型支持

### 2.2 后端技术

- **运行环境**: Next.js API Routes (Serverless Functions)
- **翻译API**: DeepL API
- **例句来源**: Tatoeba API + 火山引擎Doubao API
- **音标库**:
  - 英语: `phonetic` npm包
  - 日语: `kuroshiro` + `kuroshiro-analyzer-kuromoji`
  - 中文: `pinyin-pro`

### 2.3 部署平台

- **托管**: Vercel
- **区域**: 香港节点 (hkg1)
- **CDN**: Vercel全球CDN
- **HTTPS**: 自动配置

---

## 3. 系统架构

### 3.1 整体架构

```
用户浏览器
    ↓
Next.js 前端 (React组件)
    ↓
API Routes (/api/translate)
    ↓
并行处理:
  ├─ DeepL API (翻译)
  ├─ 音标/注音库 (本地处理)
  ├─ Tatoeba API (例句)
  └─ 火山引擎 API (补充例句)
    ↓
聚合JSON响应
    ↓
前端渲染 + 浏览器TTS
```

### 3.2 目录结构

```
dictionary/
├── app/
│   ├── layout.tsx              # 根布局（主题Provider）
│   ├── page.tsx                # 主页（词典界面）
│   ├── globals.css             # 全局样式
│   └── api/
│       ├── translate/route.ts  # 翻译API端点
│       └── health/route.ts     # 健康检查
├── components/
│   ├── SearchBar.tsx           # 搜索框
│   ├── LanguageSelector.tsx    # 语言选择器
│   ├── TranslationResult.tsx   # 翻译结果展示
│   ├── ExampleSentences.tsx    # 例句列表
│   ├── AudioButton.tsx         # 发音按钮
│   └── ThemeToggle.tsx         # 主题切换
├── lib/
│   ├── deepl.ts                # DeepL客户端
│   ├── phonetic.ts             # 音标/注音处理
│   ├── examples.ts             # 例句获取逻辑
│   └── volcengine.ts           # 火山引擎客户端
├── types/
│   └── index.ts                # TypeScript类型定义
├── public/
│   └── favicon.ico
├── .env.local                  # 环境变量（不提交）
├── .env.example                # 环境变量示例
├── next.config.js              # Next.js配置
├── tailwind.config.js          # Tailwind配置
├── tsconfig.json               # TypeScript配置
└── package.json
```

---

## 4. API设计

### 4.1 翻译接口

**端点**: `POST /api/translate`

**请求体**:
```json
{
  "text": "hello",
  "targetLang": "zh"
}
```

**响应体**:
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
    },
    {
      "source": "Say hello to your family.",
      "translation": "向你的家人问好。",
      "isGenerated": false
    },
    {
      "source": "Hello everyone, welcome!",
      "translation": "大家好，欢迎！",
      "isGenerated": true
    }
  ]
}
```

**错误响应**:
```json
{
  "error": "Translation service unavailable",
  "code": "DEEPL_ERROR",
  "message": "DeepL API返回错误，请稍后重试"
}
```

### 4.2 服务端处理流程

```
1. 接收请求 {text, targetLang}
   ↓
2. 调用DeepL API
   - 自动检测源语言
   - 翻译成目标语言
   ↓
3. 生成音标/注音
   - 源语言: 根据检测结果选择对应库
   - 目标语言: 根据targetLang选择对应库
   ↓
4. 查询Tatoeba例句
   - 查询 source→target 方向的例句
   - 最多获取3条
   ↓
5. 如果例句不足3条
   - 调用火山引擎Doubao生成补充例句
   - 标记 isGenerated: true
   ↓
6. 组装JSON响应返回
```

---

## 5. 前端组件设计

### 5.1 组件层次结构

```
App (layout.tsx)
  └── ThemeProvider
      └── Page (page.tsx)
          ├── Header
          │   ├── Title
          │   └── ThemeToggle
          ├── SearchCard
          │   ├── SearchBar
          │   └── LanguageSelector
          └── ResultCard (条件渲染)
              ├── TranslationResult
              │   ├── WordDisplay
              │   │   ├── WordText
              │   │   ├── Phonetic
              │   │   └── AudioButton
              │   └── TranslationText
              └── ExampleSentences
                  └── ExampleItem[]
                      ├── SourceText
                      ├── TranslationText
                      └── AudioButton
```

### 5.2 核心组件接口

**SearchBar**:
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}
```

**LanguageSelector**:
```typescript
interface LanguageSelectorProps {
  sourceLang: 'auto' | 'zh' | 'ja' | 'en';
  targetLang: 'zh' | 'ja' | 'en';
  onSourceChange: (lang: string) => void;
  onTargetChange: (lang: string) => void;
}
```

**TranslationResult**:
```typescript
interface TranslationResultProps {
  data: {
    sourceText: string;
    translation: string;
    sourcePhonetic?: string;
    targetPhonetic?: string;
    sourceLang: string;
    targetLang: string;
  };
}
```

**ExampleSentences**:
```typescript
interface Example {
  source: string;
  translation: string;
  isGenerated: boolean;
}

interface ExampleSentencesProps {
  examples: Example[];
  targetLang: string;
}
```

**AudioButton**:
```typescript
interface AudioButtonProps {
  text: string;
  lang: string;  // 'en-US' | 'ja-JP' | 'zh-CN'
  size?: 'small' | 'large';
}
```

---

## 6. 用户界面设计

### 6.1 视觉风格

- **设计系统**: 卡片式布局 + 深浅色主题
- **主色调**:
  - 主要强调色: #4CAF50 (绿色 - 用于强调边框)
  - 链接/交互色: #2196F3 (蓝色)
- **字体**: 系统默认字体栈
  - `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`
- **圆角**: 8px (小元素), 12px (卡片)
- **阴影**: 轻微阴影增强层次感

### 6.2 浅色主题

- **背景**: #f5f5f5
- **卡片**: #ffffff
- **文字**: #1a1a1a (主要), #666666 (次要)
- **边框**: #e0e0e0

### 6.3 深色主题

- **背景**: #1e1e1e
- **卡片**: #252525
- **文字**: #e0e0e0 (主要), #a0a0a0 (次要)
- **边框**: #404040

### 6.4 响应式断点

- **手机**: < 480px (单列，紧凑间距)
- **平板**: 481px - 768px (适度增大间距)
- **桌面**: > 769px (最大宽度480px居中)

### 6.5 界面布局

参见项目根目录的 `interface-preview.html` 文件，包含完整的交互式原型。

---

## 7. 数据流和状态管理

### 7.1 状态管理方案

**主题状态**: React Context
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

**数据请求**: SWR
```typescript
const { data, error, isLoading } = useSWR(
  searchText ? ['/api/translate', searchText, targetLang] : null,
  ([url, text, lang]) => fetcher(url, { text, targetLang: lang })
);
```

### 7.2 本地存储

- **主题偏好**: `localStorage.getItem('theme')`
- **搜索历史**: 可选功能（未来扩展）

---

## 8. 第三方服务集成

### 8.1 DeepL API

**API密钥**: `535b7c5e-6ab5-4afd-8b51-21f5667a8767:dp`

**使用限制**:
- 免费版: 50万字符/月
- 计费方式: 按字符数计费

**端点**: `https://api-free.deepl.com/v2/translate`

**参数**:
```typescript
{
  text: string[];
  source_lang?: 'EN' | 'JA' | 'ZH';  // 可选，不填则自动检测
  target_lang: 'EN' | 'JA' | 'ZH';
}
```

### 8.2 火山引擎 Doubao API

**用途**: 生成例句（当Tatoeba例句不足时）

**Prompt模板**:
```
请为"{word}"这个词生成3个实用的例句，要求：
1. 例句要自然地道，适合日常使用
2. 长度适中，不超过15个词
3. 涵盖不同使用场景
4. 直接输出例句，每行一句，不要序号

示例格式：
Hello, how are you?
Say hello to your family.
Hello everyone, welcome!
```

### 8.3 Tatoeba API

**端点**: `https://tatoeba.org/en/api_v0/search`

**参数**:
```
?from={sourceLang}&to={targetLang}&query={word}&limit=3
```

**返回格式**: 包含原文和翻译的JSON数组

### 8.4 Web Speech API

**语音合成**:
```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'zh-CN'; // 'en-US' | 'ja-JP' | 'zh-CN'
window.speechSynthesis.speak(utterance);
```

**浏览器支持**: 现代浏览器均支持，无需额外配置

---

## 9. 错误处理和降级策略

### 9.1 错误分类

**API错误**:
- DeepL API失败: 显示"翻译服务暂时不可用，请稍后重试"
- 火山引擎API失败: 仍返回基础翻译，例句部分留空或仅显示Tatoeba结果
- Tatoeba无结果: 自动触发AI生成例句
- 网络超时: 显示重试按钮

**客户端错误**:
- 语音合成不支持: 隐藏发音按钮，显示提示
- 输入为空: 显示提示"请输入要翻译的内容"
- 输入过长: 限制最大字符数（例如500字符）

### 9.2 降级策略

```
完整功能: 翻译 + 音标 + Tatoeba例句 + AI例句
  ↓ DeepL失败
降级1: 显示错误提示，引导用户刷新
  ↓ 例句API失败
降级2: 只显示翻译和音标，无例句
  ↓ 音标生成失败
降级3: 只显示翻译文本
```

### 9.3 用户反馈

- **加载状态**: 显示骨架屏或加载动画
- **错误提示**: Toast通知或内联错误信息
- **重试机制**: 提供"重试"按钮

---

## 10. 性能优化

### 10.1 前端优化

- **输入防抖**: 500ms延迟，避免频繁请求
- **结果缓存**: SWR自动缓存相同查询
- **代码分割**: Next.js自动按页面分割
- **图片优化**: 使用Next.js Image组件（如果未来添加图片）

### 10.2 后端优化

- **并行请求**: DeepL、Tatoeba、音标生成并行处理
- **请求超时**: 设置合理超时时间（10秒）
- **缓存策略**: 可选使用Vercel KV缓存常见词汇

### 10.3 网络优化

- **Vercel CDN**: 全球分发静态资源
- **响应压缩**: 自动gzip压缩
- **HTTP/2**: Vercel默认启用

---

## 11. 部署配置

### 11.1 环境变量

**.env.local** (开发环境):
```bash
# DeepL API
DEEPL_API_KEY=535b7c5e-6ab5-4afd-8b51-21f5667a8767:dp

# 火山引擎 Doubao API
VOLCENGINE_API_KEY=your_volcengine_api_key
VOLCENGINE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3

# 可选配置
ENABLE_CACHE=true
CACHE_TTL=86400
```

**.env.example** (提交到Git):
```bash
DEEPL_API_KEY=your_deepl_api_key_here
VOLCENGINE_API_KEY=your_volcengine_api_key_here
VOLCENGINE_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3
```

### 11.2 Next.js配置

**next.config.js**:
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

### 11.3 Vercel配置

**vercel.json**:
```json
{
  "regions": ["hkg1"],
  "env": {
    "DEEPL_API_KEY": "@deepl-api-key",
    "VOLCENGINE_API_KEY": "@volcengine-api-key",
    "VOLCENGINE_ENDPOINT": "@volcengine-endpoint"
  }
}
```

### 11.4 部署步骤

1. **GitHub仓库**: 创建并推送代码
2. **Vercel导入**: 连接GitHub仓库
3. **环境变量**: 在Vercel Dashboard配置
4. **自动部署**: 推送到main分支自动触发
5. **自定义域名**: (可选) 配置自定义域名

---

## 12. 安全性考虑

### 12.1 API密钥保护

- ✅ 所有API密钥存储在环境变量
- ✅ 仅在服务端使用，不暴露给客户端
- ✅ .env.local 添加到 .gitignore

### 12.2 输入验证

- 字符数限制: 最大500字符
- XSS防护: React自动转义
- SQL注入: 无数据库，不适用

### 12.3 速率限制

- 可选实现: Vercel Edge Config限制每IP请求频率
- DeepL自带限额: 每月50万字符

---

## 13. 测试策略

### 13.1 单元测试

- 音标/注音生成函数
- 数据格式化工具函数
- React组件单元测试 (Jest + React Testing Library)

### 13.2 集成测试

- API端点测试
- 第三方API调用模拟
- 端到端流程测试

### 13.3 手动测试清单

- [ ] 英译中功能完整
- [ ] 日译英功能完整
- [ ] 中译日功能完整
- [ ] 音标/注音正确显示
- [ ] 例句正常加载
- [ ] 发音功能正常
- [ ] 主题切换正常
- [ ] 响应式布局正常
- [ ] 错误处理正常
- [ ] 加载状态正常

---

## 14. 未来扩展可能性

### 14.1 功能扩展

- 搜索历史记录
- 收藏单词本
- 单词卡片复习
- 离线缓存（PWA）
- 更多语言支持
- OCR图片翻译

### 14.2 技术优化

- 使用Redis缓存热门词汇
- 添加全文搜索功能
- 实现用户账号系统
- 数据统计和分析

---

## 15. 项目里程碑

### Phase 1: MVP开发 (预计1周)
- [ ] 项目初始化 (Next.js + TypeScript)
- [ ] 基础UI实现（搜索框、语言选择器）
- [ ] DeepL API集成
- [ ] 音标/注音生成
- [ ] 基础翻译功能

### Phase 2: 例句和语音 (预计3天)
- [ ] Tatoeba API集成
- [ ] 火山引擎API集成
- [ ] Web Speech API集成
- [ ] 例句展示组件

### Phase 3: 主题和优化 (预计2天)
- [ ] 深浅色主题实现
- [ ] 响应式优化
- [ ] 加载状态和错误处理
- [ ] 性能优化

### Phase 4: 部署和测试 (预计1天)
- [ ] Vercel部署配置
- [ ] 环境变量配置
- [ ] 完整功能测试
- [ ] 生产环境验证

---

## 16. 关键决策记录

### 决策1: 选择DeepL而非Google Translate
**原因**: DeepL翻译质量更高，尤其是长句和上下文理解

### 决策2: 使用浏览器原生TTS
**原因**: 完全免费，无调用限制，现代浏览器音质已足够好

### 决策3: 服务端聚合而非客户端多次请求
**原因**: 安全性更好（API Key不暴露），用户体验更流畅

### 决策4: 混合例句来源（Tatoeba + AI）
**原因**: 平衡成本和质量，确保每个词都有例句

### 决策5: Vercel而非传统云服务器
**原因**: 零配置部署，全球CDN，Serverless架构降低成本

---

## 附录

### A. 相关文档链接

- DeepL API文档: https://www.deepl.com/docs-api
- Tatoeba API文档: https://tatoeba.org/en/api_docs
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Next.js文档: https://nextjs.org/docs
- Vercel部署指南: https://vercel.com/docs

### B. 参考资源

- 界面原型: `interface-preview.html`
- 音标库: npm包 `phonetic`, `kuroshiro`, `pinyin-pro`
- UI设计系统: 自定义卡片式布局

---

**文档版本**: 1.0
**最后更新**: 2026-03-31
**文档作者**: Claude Opus 4.5 + User
