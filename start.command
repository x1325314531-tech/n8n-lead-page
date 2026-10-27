#!/bin/bash
# 线索秒回落地页 一键启动
# 用法：双击本文件（或终端执行 ./start.command），自动打开浏览器
cd "$(dirname "$0")"

# 若服务未启动则启动本地 HTTP 服务（端口 4173）
if ! curl -s -o /dev/null --max-time 2 http://localhost:4173/; then
  (python3 -m http.server 4173 --directory dist >/dev/null 2>&1 &)
  sleep 1
fi

# 打开浏览器
open "http://localhost:4173"
echo "落地页已启动：http://localhost:4173"
