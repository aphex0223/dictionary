#!/bin/bash

# EdgeOne Pages 自动部署脚本
# 使用前需要在 EdgeOne Pages 控制台完成 GitHub 授权

set -e

echo "🚀 EdgeOne Pages 自动部署脚本"
echo "================================"

# 腾讯云密钥（从环境变量或命令行参数获取）
TENCENT_SECRET_ID="${TENCENT_SECRET_ID:-}"
TENCENT_SECRET_KEY="${TENCENT_SECRET_KEY:-}"

# 检查是否提供了腾讯云密钥
if [ -z "$TENCENT_SECRET_ID" ] || [ -z "$TENCENT_SECRET_KEY" ]; then
    echo "❌ 错误: 缺少腾讯云密钥"
    echo ""
    echo "使用方法:"
    echo "  方法1 - 通过环境变量:"
    echo "    export TENCENT_SECRET_ID=your_secret_id"
    echo "    export TENCENT_SECRET_KEY=your_secret_key"
    echo "    ./scripts/deploy-edgeone.sh"
    echo ""
    echo "  方法2 - 直接传入（不推荐）:"
    echo "    TENCENT_SECRET_ID=xxx TENCENT_SECRET_KEY=yyy ./scripts/deploy-edgeone.sh"
    echo ""
    exit 1
fi

# 项目配置
PROJECT_NAME="dictionary"
GITHUB_REPO="aphex0223/dictionary"
BRANCH="main"
REGION="ap-guangzhou"

# 从 .env.local 读取环境变量
if [ -f ".env.local" ]; then
    echo "📦 读取本地环境变量..."
    export $(grep -v '^#' .env.local | xargs)
else
    echo "⚠️  警告: .env.local 文件不存在"
fi

echo ""
echo "📋 部署配置:"
echo "   项目名称: $PROJECT_NAME"
echo "   GitHub 仓库: $GITHUB_REPO"
echo "   分支: $BRANCH"
echo "   区域: $REGION"
echo ""

# 检查环境变量
if [ -z "$BAIDU_APP_ID" ] || [ -z "$BAIDU_SECRET_KEY" ] || [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "❌ 错误: 缺少必要的环境变量"
    echo "   请确保 .env.local 文件包含:"
    echo "   - BAIDU_APP_ID"
    echo "   - BAIDU_SECRET_KEY"
    echo "   - DEEPSEEK_API_KEY"
    exit 1
fi

echo "✅ 环境变量检查通过"
echo ""

# 检查 tccli 是否安装
if ! command -v tccli &> /dev/null; then
    echo "📥 安装腾讯云 CLI..."
    if command -v pipx &> /dev/null; then
        pipx install tccli
    else
        pip3 install --user tccli
    fi

    # 更新 PATH
    export PATH="$HOME/.local/bin:$PATH"
fi

echo "⚙️  配置腾讯云 CLI..."
tccli configure set secretId "$TENCENT_SECRET_ID"
tccli configure set secretKey "$TENCENT_SECRET_KEY"
tccli configure set region "$REGION"

echo ""
echo "📝 部署说明:"
echo "   1. 首次部署需要在 EdgeOne Pages 控制台完成 GitHub 授权"
echo "   2. 访问: https://console.cloud.tencent.com/edgeone-pages"
echo "   3. 点击「新建站点」→「从 Git 导入」"
echo "   4. 授权 GitHub 并选择仓库: $GITHUB_REPO"
echo "   5. 填写以下配置:"
echo ""
echo "   构建配置:"
echo "   ├─ 框架: Next.js"
echo "   ├─ 构建命令: npm run build"
echo "   ├─ 输出目录: .next"
echo "   ├─ 安装命令: npm install"
echo "   └─ Node.js 版本: 18.x"
echo ""
echo "   环境变量:"
echo "   ├─ BAIDU_APP_ID=$BAIDU_APP_ID"
echo "   ├─ BAIDU_SECRET_KEY=$BAIDU_SECRET_KEY"
echo "   ├─ DEEPSEEK_API_KEY=$DEEPSEEK_API_KEY"
echo "   └─ DEEPSEEK_ENDPOINT=$DEEPSEEK_ENDPOINT"
echo ""
echo "   函数配置:"
echo "   ├─ 超时时间: 60 秒"
echo "   └─ 内存大小: 1024 MB"
echo ""

# 保存配置到文件
cat > .edgeone-config.json <<EOF
{
  "project": "$PROJECT_NAME",
  "repository": "$GITHUB_REPO",
  "branch": "$BRANCH",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "nodeVersion": "18.x",
  "env": {
    "BAIDU_APP_ID": "$BAIDU_APP_ID",
    "BAIDU_SECRET_KEY": "$BAIDU_SECRET_KEY",
    "DEEPSEEK_API_KEY": "$DEEPSEEK_API_KEY",
    "DEEPSEEK_ENDPOINT": "$DEEPSEEK_ENDPOINT"
  },
  "functions": {
    "timeout": 60,
    "memory": 1024
  }
}
EOF

echo "✅ 配置已保存到 .edgeone-config.json"
echo ""
echo "🎯 后续部署:"
echo "   每次推送代码到 GitHub，EdgeOne Pages 将自动构建和部署"
echo ""
echo "📱 管理部署:"
echo "   控制台: https://console.cloud.tencent.com/edgeone-pages"
echo ""
