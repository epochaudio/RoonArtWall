#!/bin/sh

# 启动 art-scraper
node art-scraper.js &

# 等待5秒，确保 art-scraper 完全启动
sleep 5

# 启动 art-wall
cd art-wall && node server.js 