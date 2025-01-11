
# Roon 艺术墙：优雅地展示您的音乐收藏

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Roon 艺术墙**是一个旨在为您的 Roon 音乐库带来沉浸式视觉体验的系统。它通过优雅的 3D 翻转动画效果，将您的专辑封面转化为引人入胜的动态艺术墙。

## ✨ 核心特性

* **全屏自适应布局：** 完美适配各种屏幕尺寸，自动调整专辑封面排列。
* **动态刷新：** 每 60 秒自动更新一批新的专辑封面，保持新鲜感。
* **炫酷翻转效果：** 采用独特的 3D 扑克牌翻转动画，增添视觉趣味。
* **卓越性能：**
    * **图片预加载：** 确保流畅的浏览体验。
    * **智能缓存：** 减少资源消耗，加快加载速度。
    * **批量 DOM 更新：** 提升渲染效率。
    * **懒加载：** 优化初始加载性能。

## 🚀 快速上手

以下是快速启动 Roon 艺术墙的几种方式。推荐使用 Docker 方式以获得最便捷的体验。

### 🐳 使用 Docker (推荐)

#### 方式一：使用 `docker run` 命令

这是最快速启动的方式。只需将 `/path/to/your/Roon/art` 替换为您 Roon 艺术图片的实际目录。

```bash
docker run -d \
  --name roon-art \
  -p 3090:3090 \
  -v /path/to/your/Roon/art:/app/art  \
  # ⚠️ 重要：请替换为您的 Roon 艺术图片目录
  --restart unless-stopped \
  epochaudio/roon-art:latest
```

#### 方式二：使用 `docker-compose`

1. **创建 `docker-compose.yml` 文件：**

   ```yaml
   version: '3'
   services:
     roon-art:
       image: epochaudio/roon-art:latest
       ports:
         - "3090:3090"
       volumes:
         - /path/to/your/Roon/art:/app/art  # ⚠️ 重要：请替换为您的 Roon 艺术图片目录
       restart: unless-stopped
   ```

2. **启动服务：**

   ```bash
   docker-compose up -d
   ```

### ⚙️  配置 Roon Core

启动容器后，您需要在 Roon Core 中进行以下设置：

1. **启用“艺术刮刀”扩展：** 打开 Roon Core 设置，找到并启用该扩展。
2. **配置扩展设置：**
   - **图片质量：** 建议选择“高质量”以获得最佳显示效果。
   - **下载数量：** 建议设置为 1000-5000 张，以获得丰富的艺术墙内容。
3. **开始下载封面：** 在 Roon 界面上启动封面下载过程。您将看到下载进度。
![image](https://github.com/user-attachments/assets/51e268e6-9fd3-4316-97b8-8c04352aceab)


### 🖼️  欣赏艺术墙

1. **等待封面下载完成：**  首次下载可能需要一些时间，具体取决于您的网络速度和选择的下载数量。请耐心等待。
2. **访问艺术墙：**  封面下载完成后，打开浏览器并访问 `http://localhost:3090`。
3. **尽情享受：**  您的专辑艺术墙现在应该可以正常显示了！

**⚠️ 重要提示：**

* **必须等待封面下载完成** 后再访问艺术墙，否则可能无法显示图片。
* **首次下载需要时间**，请耐心等待。
* **确保有足够的存储空间** 来存放下载的封面图片。
* **目录映射必须正确配置**，Docker 才能访问您的 Roon 艺术图片。
* **Roon 艺术图片目录通常位于：**
    * **Windows:** `C:\Users\YourUsername\AppData\Local\Roon\Application Data\Roon\art`
    * **macOS:** `/Users/YourUsername/Library/Application Support/Roon/Application Data/Roon/art`
    * **Linux:** `/home/YourUsername/.roon/Application Data/Roon/art`
* **请确保 Docker 容器有读取您 Roon 艺术图片目录的权限。**

### 🛠️  源码构建 (面向开发者)

1. **克隆仓库：**

   ```bash
   git clone https://github.com/epochaudio/RoonArtWall.git
   cd RoonArtWall
   ```

2. **使用 Docker Compose 构建并启动：**

   ```bash
   docker-compose up -d --build
   ```

3. **访问：** `http://localhost:3090`

### 🔨  手动安装

如果您不想使用 Docker，可以手动安装。

1. **克隆仓库：**

   ```bash
   git clone https://github.com/yourusername/roon-art-wall.git
   cd roon-art-wall
   ```

2. **安装依赖：**

   ```bash
   npm install
   cd art-wall
   npm install
   cd ..
   ```

3. **启动服务：**

   ```bash
   npm start
   ```

4. **访问：** `http://localhost:3090`

## 🧑‍💻 开发指南

### 📚 环境要求

* **Node.js:** 20.x 或更高版本
* **现代浏览器：** Chrome、Firefox、Safari 等
* **硬件建议：** 推荐使用配备独立显卡的设备，以获得更流畅的动画效果。

### 📂 目录结构

```
roon-art-wall/
├── art/                # 存放 Roon 下载的图片
│   ├── Albums/        # 专辑封面
│   └── Artists/       # 艺术家图片
├── art-wall/          # 前端应用
│   ├── public/        # 静态资源
│   └── server.js      # 简易前端服务器
├── css/               # 样式文件
├── js/                # JavaScript 文件
└── art-scraper.js     # （可选）用于抓取 Roon 图片的脚本
```

### ✍️ 开发规范

1. **代码风格：**
   - 使用 ES6+ 特性。
   - 遵循 ESLint 代码规范。
   - 保持代码简洁易懂。
2. **Git 提交规范：**
   - `feat`: 新功能
   - `fix`: Bug 修复
   - `docs`: 文档变更
   - `style`: 代码格式调整（不影响逻辑）
   - `refactor`: 代码重构（不新增功能或修复 bug）
   - `test`: 添加或修改测试用例
   - `chore`: 构建过程或辅助工具的变动
3. **参与贡献：**
   - Fork 本仓库。
   - 创建您的特性分支 (`git checkout -b feature/your-feature`)。
   - 提交您的更改 (`git commit -m 'feat: 添加了很棒的功能'`)。
   - 推送到分支 (`git push origin feature/your-feature`)。
   - 提交 Pull Request。

## 🖼️ 图片尺寸选项

Roon “艺术刮刀”扩展允许您选择下载的图片尺寸：

* **小图：** 225 x 225 像素
* **中图：** 500 x 500 像素 (默认)
* **大图：** 1000 x 1000 像素

您需要在 Roon Core 的扩展设置中进行配置。

## ⚙️ 配置说明 (手动安装)

1. 启动程序后，在 Roon 设置中启用“艺术刮刀”扩展。
2. 在扩展设置中，您可以配置：
   - **下载类型：** 专辑或艺术家图片。
   - **图片尺寸：** 如上所述。
   - **最大图片数量：** 建议根据您的需求设置 (1-10000)。

## 💾 下载位置 (手动安装)

* **专辑封面：** `art/Albums/` 目录


## ⚠️ 注意事项

* 图片文件名会自动过滤特殊字符。
* 下载失败时会自动重试最多 3 次。
* **强烈建议使用 Docker 方式运行**，以简化部署和管理。

## 📜 版本历史

* **v1.0.1**
    * 添加最大图片数量限制。
    * 优化中文界面显示。
    * 改进错误处理机制。
* **v0.1.1**
    * 初始版本发布。

## 📄 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。

## 🤝 技术支持

如有任何问题，请通过以下方式联系我们：

* **邮箱：** sales@epochaudio.cn
* **网站：** [https://www.epochaudio.cn](https://www.epochaudio.cn)

## 🙏 致谢

感谢 [Roon Labs](https://roonlabs.com/) 提供的出色 API 支持。
感谢 [TheAppgineer/roon-extension-art-scraper](https://github.com/TheAppgineer/roon-extension-art-scraper) 项目提供的灵感。

## 💡 关于艺术墙

艺术墙是一个动态展示专辑封面的 Web 应用程序，旨在为您的音乐欣赏体验增添视觉上的享受。

### 🌟 特点

* **全屏自适应显示：** 根据屏幕尺寸自动调整图片布局，提供最佳观看体验。
* **动态更新：** 每 60 秒自动更换一批新的专辑封面，保持新鲜感。
* **扑克牌翻转效果：** 独特的 3D 翻转动画效果，让封面展示更具吸引力。
* **性能优化：**
    * **图片预加载机制：** 提前加载图片，确保流畅的动画效果。
    * **智能缓存管理：** 有效利用浏览器缓存，减少资源请求。
    * **批量 DOM 更新：** 减少页面重绘，提高渲染性能。
    * **懒加载技术：** 仅加载当前可见的图片，优化初始加载速度。

### 🛠️ 使用方法

1. 确保已下载足够的专辑封面到 `art/Albums/` 目录。
2. 启动服务器后，在浏览器中访问 `http://localhost:3090`。

### 🖥️ 系统要求

* **推荐使用现代浏览器：** Chrome、Firefox、Safari 等。
* **不支持移动设备** (当前版本)。
* **建议使用配备独立显卡的设备** 以获得最佳的动画效果。
```


