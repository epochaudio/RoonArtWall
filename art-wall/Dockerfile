FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json
COPY package.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3090

# 设置数据卷 - 用于访问上级目录的art/Albums
VOLUME [ "/app/art" ]

# 运行应用
CMD [ "node", "server.js" ] 