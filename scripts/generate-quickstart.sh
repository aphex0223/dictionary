#!/bin/bash

# 从模板生成包含实际密钥的快速配置文件

set -e

echo "📝 生成 EdgeOne Pages 快速配置文件..."

# 检查 .env.local 是否存在
if [ ! -f ".env.local" ]; then
    echo "❌ 错误: .env.local 文件不存在"
    exit 1
fi

# 读取环境变量
source .env.local

# 检查必要的环境变量
if [ -z "$BAIDU_APP_ID" ] || [ -z "$BAIDU_SECRET_KEY" ] || [ -z "$DEEPSEEK_API_KEY" ]; then
    echo "❌ 错误: .env.local 缺少必要的环境变量"
    exit 1
fi

# 从模板生成配置文件
cp EDGEONE_QUICKSTART.template.md EDGEONE_QUICKSTART.md

# 替换占位符
sed -i '' "s|\[从 .env.local 复制\]|$BAIDU_APP_ID|" EDGEONE_QUICKSTART.md
sed -i '' "0,/\[从 .env.local 复制\]/s//${BAIDU_SECRET_KEY}/" EDGEONE_QUICKSTART.md
sed -i '' "0,/\[从 .env.local 复制\]/s//${DEEPSEEK_API_KEY}/" EDGEONE_QUICKSTART.md

echo "✅ 已生成 EDGEONE_QUICKSTART.md"
echo "📄 文件包含完整的配置信息，可直接复制粘贴到 EdgeOne Pages 控制台"
echo ""
echo "⚠️  注意: 此文件包含敏感信息，不会提交到 Git"
