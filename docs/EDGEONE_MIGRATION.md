# EdgeOne Pages 部署指南

本指南说明如何将项目从 Vercel 迁移到腾讯云 EdgeOne Pages。

## 前提条件

- 腾讯云账号（已创建）
- 腾讯云 API 密钥（SecretId 和 SecretKey，可在腾讯云控制台获取）
- GitHub 仓库已推送代码

## 部署步骤

### 1. 访问 EdgeOne Pages 控制台

1. 登录腾讯云控制台: https://console.cloud.tencent.com/
2. 搜索并进入"EdgeOne Pages"服务（或"边缘安全加速平台 - Pages"）
3. 如果是首次使用，需要先开通服务

### 2. 创建新站点

1. 点击"新建站点"或"创建应用"
2. 选择"从 Git 导入"
3. 授权连接 GitHub 账号
4. 选择 `jakeyue/dictionary` 仓库（或你的仓库名）
5. 选择要部署的分支（通常是 `main`）

### 3. 配置构建设置

在构建配置页面填写以下信息：

- **框架预设**: Next.js
- **构建命令**: `npm run build` 或 `next build`
- **输出目录**: `.next`
- **安装命令**: `npm install`
- **Node.js 版本**: 18.x 或 20.x（推荐 18.x）

### 4. 配置环境变量

在"环境变量"设置中添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `BAIDU_APP_ID` | 从 `.env.local` 复制 | 百度翻译 API |
| `BAIDU_SECRET_KEY` | 从 `.env.local` 复制 | 百度翻译密钥 |
| `DEEPSEEK_API_KEY` | 从 `.env.local` 复制 | DeepSeek API |
| `DEEPSEEK_ENDPOINT` | `https://api.deepseek.com/v1/chat/completions` | DeepSeek 端点 |
| `EDGEONE_URL` | （部署后自动生成） | EdgeOne 分配的域名 |

**注意**:
- 请从本地的 `.env.local` 文件中复制实际的 API 密钥值
- 部署完成后，EdgeOne 会自动分配一个域名，你需要将该域名设置为 `EDGEONE_URL` 环境变量（可选，用于内部跳转）

### 5. 高级配置（可选）

如果需要配置函数超时和内存（对应 vercel.json 中的配置）：

1. 在"函数设置"或"边缘函数"配置中
2. 设置超时时间: **60 秒**（对应 `/api/translate` 路由）
3. 设置内存大小: **1024 MB**

### 6. 触发部署

1. 确认所有配置无误
2. 点击"部署"按钮
3. 等待构建完成（通常需要 2-5 分钟）
4. 部署成功后会显示访问 URL

### 7. 验证部署

1. 访问 EdgeOne Pages 分配的 URL
2. 测试翻译功能是否正常
3. 检查日语假名转换功能
4. 测试示例句子生成

### 8. 配置自动部署

EdgeOne Pages 默认会监听 GitHub 仓库的推送：

- 每次推送到 `main` 分支会自动触发部署
- 可以在控制台查看部署历史和日志
- 可以配置其他分支的部署规则

### 9. 自定义域名（可选）

如果需要绑定自定义域名：

1. 在 EdgeOne Pages 控制台选择"域名管理"
2. 添加自定义域名
3. 按照提示配置 DNS 记录（CNAME）
4. 等待 DNS 生效（通常 10 分钟内）
5. EdgeOne 会自动配置 SSL 证书

## 区别对比

| 功能 | Vercel | EdgeOne Pages |
|------|--------|---------------|
| 自动部署 | ✅ | ✅ |
| 边缘函数 | ✅ | ✅ |
| 环境变量 | ✅ | ✅ |
| 自定义域名 | ✅ | ✅ |
| 免费 SSL | ✅ | ✅ |
| 部署区域 | 全球 | 中国+全球 |
| 国内访问速度 | 慢 | 快 |

## 回滚到 Vercel

如果需要回滚到 Vercel：

1. Vercel 配置已保留在项目中（`vercel.json`, `.vercel/`, `.vercelignore`）
2. 直接在 Vercel 控制台重新部署即可
3. `next.config.js` 已兼容两个平台，无需修改

## 常见问题

### Q: 构建失败怎么办？

A: 检查以下几点：
- Node.js 版本是否正确（推荐 18.x）
- 环境变量是否配置完整
- 查看构建日志中的错误信息

### Q: API 路由 404 错误？

A: 确认：
- 构建配置中的输出目录是 `.next`
- 函数超时时间设置为 60 秒
- 环境变量已正确配置

### Q: 日语假名转换失败？

A: 检查：
- `DEEPSEEK_API_KEY` 是否配置
- 函数内存是否至少 1024 MB
- 查看函数日志中的错误信息

## 监控和日志

EdgeOne Pages 提供：
- 实时部署日志
- 函数调用日志
- 访问统计
- 错误监控

可以在控制台的"日志"或"监控"页面查看。

## 成本估算

EdgeOne Pages 的定价（仅供参考，请以官网为准）：
- 免费额度：通常包含一定量的构建分钟数和流量
- 超出部分：按实际使用量计费
- 中国境内访问通常比 Vercel 更经济

## 支持

- EdgeOne Pages 文档: https://cloud.tencent.com/document/product/1552
- 腾讯云工单系统: https://console.cloud.tencent.com/workorder
