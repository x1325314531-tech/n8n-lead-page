#!/bin/bash
# 重建 gh-pages 分支（干净版）
set -e
cd /Users/xixihaha/n8n/lead-page-react
export PATH="$HOME/.nvm/versions/node/v22.17.0/bin:/opt/homebrew/bin:$PATH"
export HTTPS_PROXY=http://127.0.0.1:7897 HTTP_PROXY=http://127.0.0.1:7897

# 1. main 分支重新构建（确保 dist 是最新）
git checkout -q main
VITE_WEBHOOK_URL="https://cloudy-ruby-white-utilization.trycloudflare.com/webhook/lead" npm run build > /tmp/rebuild.log 2>&1
echo "构建完成: $(ls dist/assets/*.js | head -1)"

# 2. 暂存构建产物
rm -rf /tmp/gh_assets_new && mkdir -p /tmp/gh_assets_new
cp -R dist/* /tmp/gh_assets_new/
echo "产物暂存: $(ls /tmp/gh_assets_new)"

# 3. 删除旧 gh-pages（远程 + 本地）
git push origin --delete gh-pages 2>/dev/null || true
git branch -D gh-pages 2>/dev/null || true

# 4. 重建 orphan gh-pages 分支
git checkout -q --orphan gh-pages
git rm -rfq . 2>/dev/null || true
rm -rf assets dist src node_modules *.html *.js *.css .gitignore 2>/dev/null || true

# 5. 放入构建产物并提交推送
cp -R /tmp/gh_assets_new/* .
printf 'node_modules/\n.DS_Store\n' > .gitignore
git add -A
git commit -q -m "chore: 发布站点（最新webhook隧道地址）"
git push -u origin gh-pages 2>&1 | tail -2

# 6. 回到 main
git checkout -q main
echo "=== gh-pages 重建并推送完成 ==="
