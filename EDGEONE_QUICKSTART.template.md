# EdgeOne Pages 快速配置指南

## 🎯 一键复制配置

### 第一步：访问控制台
https://console.cloud.tencent.com/edgeone-pages

### 第二步：新建站点 → 从 Git 导入

### 第三步：选择仓库
**仓库**: `aphex0223/dictionary`
**分支**: `main`

---

## 📦 构建配置（复制粘贴）

| 配置项 | 值 |
|--------|-----|
| **框架预设** | Next.js |
| **构建命令** | `npm run build` |
| **输出目录** | `.next` |
| **安装命令** | `npm install` |
| **Node.js 版本** | `18.x` |

---

## 🔐 环境变量（一个一个添加）

点击"添加环境变量"，依次添加以下4个变量：

**💡 提示**: 实际值请从本地的 `.env.local` 文件中复制

### 变量 1
```
变量名: BAIDU_APP_ID
值: [从 .env.local 复制]
```

### 变量 2
```
变量名: BAIDU_SECRET_KEY
值: [从 .env.local 复制]
```

### 变量 3
```
变量名: DEEPSEEK_API_KEY
值: [从 .env.local 复制]
```

### 变量 4
```
变量名: DEEPSEEK_ENDPOINT
值: https://api.deepseek.com/v1/chat/completions
```

---

## ⚙️ 函数配置（高级设置）

如果看到"函数设置"或"边缘函数"选项：

```
超时时间: 60 秒
内存大小: 1024 MB
```

---

## ✅ 检查清单

部署前确认：

- [ ] GitHub 仓库已授权
- [ ] 分支选择 `main`
- [ ] 框架选择 `Next.js`
- [ ] 构建命令: `npm run build`
- [ ] 输出目录: `.next`
- [ ] Node.js 版本: `18.x`
- [ ] 4个环境变量全部添加
- [ ] 函数超时设置为 60 秒（如果有此选项）
- [ ] 函数内存设置为 1024 MB（如果有此选项）

---

## 🚀 开始部署

点击"部署"或"确认"按钮，等待 2-5 分钟。

部署成功后会显示访问 URL，格式类似：
`https://your-project-xxx.edgeone.app`

---

## 🧪 测试部署

访问 URL 后测试：

1. 输入文字进行翻译
2. 检查日语假名转换
3. 查看示例句子生成

---

## 📞 需要帮助？

- EdgeOne Pages 文档: https://cloud.tencent.com/document/product/1552
- 工单支持: https://console.cloud.tencent.com/workorder
