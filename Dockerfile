FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装git（art-scraper需要）
RUN apk add --no-cache git

# 创建必要的目录并设置权限
RUN mkdir -p /app/art/Albums /app/art-wall && \
    chown -R node:node /app && \
    chmod -R 755 /app/art && \
    chmod 777 /app/art/Albums

# 复制package.json文件
COPY package*.json ./
COPY art-wall/package*.json ./art-wall/

# 确保目录权限正确
USER root
RUN chown -R node:node /app/art-wall
USER node

# 安装主目录依赖
RUN npm install

# 安装art-wall依赖
WORKDIR /app/art-wall
RUN npm install
WORKDIR /app

# 复制所有源代码
COPY --chown=node:node . .

# 确保启动脚本有执行权限
USER root
RUN chmod +x start.sh && \
    chown -R node:node /app/art && \
    chmod -R 755 /app/art && \
    chmod 777 /app/art/Albums
USER node

# 设置数据卷
VOLUME [ "/app/art" ]

# 暴露端口
EXPOSE 3090

# 使用start.sh作为启动命令
CMD ["sh", "start.sh"]
