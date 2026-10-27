#!/bin/bash
# 发布落地页到 GitHub：main=源码，gh-pages=dist 产物
set -e
cd /Users/xixihaha/n8n/lead-page-react
export PATH="/opt/homebrew/bin:$PATH"
export HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897
export GIT_TERMINAL_PROMPT=0

REPO="https://github.com/x1325314531-tech/n8n-lead-page.git"

# .gitignore
printf 'node_modules/\ndist/\n.DS_Store\n' > .gitignore

# 提交源码到 main
git init -q
git add -A
git commit -q -m "feat: 线索秒回落地页（React + Tailwind）" || true
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO"
echo "=== 推送 main（源码）==="
git push -u origin main 2>&1 | tail -2

# 构建 gh-pages 分支（含 dist 产物）
echo "=== 准备 gh-pages ==="
git checkout -q --orphan gh-pages 2>/dev/null || git checkout -q -B gh-pages
# 清空工作区保留 .git
git rm -rfq . 2>/dev/null || true
# 拷入 dist 内容
cp -R dist/* .
# 重新加 dist 产物（忽略规则临时放开）
printf 'node_modules/\n.DS_Store\n' > .gitignore
git add -A
git commit -q -m "chore: 发布站点（GitHub Pages）" || true
echo "=== 推送 gh-pages ==="
git push -u origin gh-pages 2>&1 | tail -2

echo "=== 完成 ==="
