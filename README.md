# Roon 艺术墙

一个优雅的 Roon 音乐专辑封面展示系统，通过 3D 翻转动画效果展示您的音乐收藏。

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

## 功能特点

- 全屏自适应显示：根据屏幕尺寸自动调整图片布局
- 动态更新：每60秒自动更换一批新的专辑封面
- 扑克牌翻转效果：独特的3D翻转动画效果
- 高性能：图片预加载、智能缓存、批量DOM更新、懒加载

## 快速开始

### 使用 Docker Hub 镜像（最简单）

#### 方式一：使用 docker 命令
```bash
docker run -d \
  --name roon-art \
  -p 3090:3090 \
  -v /path/to/your/Roon/art:/app/art \   
  # 重要：替换为您的 Roon 艺术图片目录
  --restart unless-stopped \
  epochaudio/roon-art:latest
```

#### 方式二：使用 docker-compose
1. 创建 docker-compose.yml 文件：
```yaml
version: '3'
services:
  roon-art:
    image: epochaudio/roon-art:latest
    ports:
      - "3090:3090"
    volumes:
      - /path/to/your/Roon/art:/app/art  # 重要：替换为您的 Roon 艺术图片目录
    restart: unless-stopped
```

2. 启动服务：
```bash
docker-compose up -d
```

⚠️ **重要提醒：**
- 目录映射必须正确设置，否则将无法显示图片
- 通常 Roon 艺术图片目录位于：
  - Windows: `C:\Users\YourUsername\AppData\Roon\art`
  - macOS: `/Users/YourUsername/Library/Application Support/Roon/art`
  - Linux: `/home/YourUsername/.roon/art`
- 确保给予足够的读取权限

### 使用源码构建（开发者）

1. 克隆仓库
```bash
git clone https://github.com/epochaudio/RoonArtWall.git
cd RoonArtWall
```

2. 使用 Docker Compose 构建并启动
```bash
docker-compose up -d --build
```

3. 访问 http://localhost:3090

### 手动安装

1. 克隆仓库
```bash
git clone https://github.com/yourusername/roon-art-wall.git
cd roon-art-wall
```

2. 安装依赖
```bash
npm install
cd art-wall
npm install
cd ..
```

3. 启动服务
```bash
npm start
```

4. 访问 http://localhost:3090

## 开发指南

### 环境要求

- Node.js 20.x 或更高版本
- 现代浏览器（Chrome、Firefox、Safari等）
- 建议使用有独立显卡的设备以获得最佳动画效果

### 目录结构

```
roon-art-wall/
├── art/                # 图片存储目录
│   ├── Albums/        # 专辑封面
│   └── Artists/       # 艺术家图片
├── art-wall/          # 艺术墙前端
│   ├── public/        # 静态资源
│   └── server.js      # 前端服务器
├── css/               # 样式文件
├── js/                # JavaScript文件
└── art-scraper.js     # Roon图片抓取器
```

### 开发规范

1. 代码风格
   - 使用 ES6+ 特性
   - 遵循 ESLint 规则
   - 保持代码简洁清晰

2. Git提交规范
   - feat: 新功能
   - fix: 修复问题
   - docs: 文档修改
   - style: 代码格式修改
   - refactor: 代码重构
   - test: 测试用例修改
   - chore: 其他修改

### 参与贡献

1. Fork 本仓库
2. 创建您的特性分支 (git checkout -b feature/AmazingFeature)
3. 提交您的更改 (git commit -m 'Add some AmazingFeature')
4. 推送到分支 (git push origin feature/AmazingFeature)
5. 打开一个 Pull Request

## 图片尺寸选项

- 小图：225 x 225 像素
- 中图：500 x 500 像素（默认）
- 大图：1000 x 1000 像素

## 使用方法

### Docker 方式运行（推荐）

1. 确保已安装 Docker 和 Docker Compose
2. 克隆本仓库
3. 在项目目录下运行：
```bash
docker-compose up


### 手动安装

1. 确保已安装 Node.js (v12 或更高版本)
2. 克隆本仓库
3. 安装依赖：



## 配置说明

1. 启动程序后，在 Roon 设置中启用"艺术刮刀"扩展
2. 在扩展设置中可以配置：
   - 下载类型（专辑/艺术家）
   - 图片尺寸
   - 最大图片数量（1-10000）

## 下载位置

- 专辑封面将保存在 `art/Albums/` 目录
- 艺术家图片将保存在 `art/Artists/` 目录

## 注意事项

- 图片文件名会自动过滤特殊字符
- 下载失败时会自动重试最多3次
- 建议使用 Docker 方式运行以获得最佳体验

## 版本历史

- v1.0.1
  - 添加最大图片数量限制
  - 优化中文界面
  - 改进错误处理机制

- v0.1.1
  - 初始版本发布

## 许可证

本项目采用 Apache License 2.0 许可证

## 技术支持

如有问题，请联系：
- 邮箱：sales@epochaudio.cn
- 网站：https://www.epochaudio.cn

## 致谢

感谢 [Roon Labs](https://roonlabs.com/) 提供的优秀 API 支持。
感谢  https://github.com/TheAppgineer/roon-extension-art-scraper 提供的灵感。

## 艺术墙功能

艺术墙是一个动态展示专辑封面的网页应用，为您的音乐收藏提供视觉享受。

### 特点

- 全屏自适应显示：根据屏幕尺寸自动调整图片布局
- 动态更新：每60秒自动更换一批新的专辑封面
- 扑克牌翻转效果：独特的3D翻转动画效果
- 性能优化：
  - 图片预加载机制
  - 智能缓存管理
  - 批量DOM更新
  - 懒加载技术

### 使用方法

1. 确保已下载足够的专辑封面到 `art/Albums/` 目录
2. 启动服务器后访问：`http://localhost:3090`

### 系统要求

- 推荐使用现代浏览器（Chrome、Firefox、Safari等）
- 不支持移动设备
- 建议使用有独立显卡的设备以获得最佳动画效果
