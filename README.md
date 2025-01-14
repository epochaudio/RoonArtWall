
# Roon 艺术墙 - 竖屏版

[![Docker Pulls](https://img.shields.io/docker/pulls/epochaudio/roon-art.svg)](https://hub.docker.com/r/epochaudio/roon-art)
[![GitHub Stars](https://img.shields.io/github/stars/your-username/your-repo.svg)](https://github.com/your-username/your-repo)
<!-- 请替换为你的 GitHub 用户名和仓库名 -->

## 简介

Roon 艺术墙是一个为 22 寸竖屏显示器（分辨率 1080x1920）量身定制的专辑封面展示系统。它能够优雅地展示您的 Roon 音乐库中的专辑封面，并配有令人赏心悦目的 3D 翻转动画效果。

**核心理念：让您的画屏焕发新生，成为展示您音乐品味的艺术画廊。**

## 主要特性

- **专属竖屏：** 完美适配 22 寸 1080x1920 竖屏显示器。
- **经典布局：** 采用 3x5 网格，一次展示 15 张精选专辑封面。
- **动感十足：** 优雅的 3D 翻转动画，并错开更新时间，避免视觉疲劳。
- **自动刷新：** 每 60 秒自动更新 3 张封面，带来持续的新鲜感。
- **性能卓越：** 优化的内存管理和动画性能，确保流畅运行。
- **稳定可靠：** 专为 7x24 小时稳定运行设计。

## 系统要求

- **显示设备：** 22 寸竖屏显示器 (1080x1920 分辨率)
- **浏览器：** 推荐定制webview显示
- **网络：** 可访问本地 Roon API
- **存储：** 建议预留至少 10GB 空间用于存储专辑封面

## 安装指南

我们推荐使用 Docker 进行安装，这将大大简化部署过程。

### 1. 准备工作

- 确保已安装 [Docker](https://www.docker.com/get-started/) 和 [Docker Compose](https://docs.docker.com/compose/install/)。
- 确保您的 Roon Core 正在运行。
- 准备好您的 22 寸竖屏显示器。

### 2. 配置 Roon 艺术图片目录

你需要将 Roon Core 的艺术图片目录挂载到 Docker 容器中。

**找到 Roon 艺术图片目录：**

- **Windows:** `C:\Users\YourUsername\AppData\Local\Roon\Application Data\Roon\art`
- **macOS:** `/Users/YourUsername/Library/Application Support/Roon/Application Data/Roon/art`
- **Linux:** `/home/YourUsername/.roon/Application Data/Roon/art`

**创建必要的目录（如果不存在）：**

```bash
mkdir -p /path/to/your/Roon/art/Albums  # 可选，如果你的艺术刮刀将图片放在 Albums 子目录下
chmod -R 755 /path/to/your/Roon/art
```

**⚠️ 重要：请将 `/path/to/your/Roon/art` 替换为您的实际 Roon 艺术图片目录。**

### 3. 使用 Docker (推荐)

#### 方式一：使用 `docker run` 命令

```bash
docker run -d \
  --name roon-art \
  -p 3090:3090 \
  -v /path/to/your/Roon/art:/app/art \
  # ⚠️ 重要：请替换为您的 Roon 艺术图片目录
  --restart unless-stopped \
  epochaudio/roon-art:latest
```

#### 方式二：使用 `docker-compose.yml`

1. **创建 `docker-compose.yml` 文件：**

   ```yaml
   version: '3'
   services:
     roon-art:
       image: epochaudio/roon-art:latest
       ports:
         - "3090:3090"
       volumes:
         - /path/to/your/Roon/art:/app/art
       restart: unless-stopped
   ```

2. **启动服务：**

   ```bash
   docker-compose up -d
   ```

## Roon Core 设置

为了让 Roon 艺术墙工作，您需要在 Roon Core 中启用并配置“艺术刮刀”扩展。

### 1. 启用艺术刮刀扩展

1. 打开您的 Roon Core 控制端。
2. 进入 "设置" -> "扩展"。
3. 找到并启用 "艺术刮刀" 扩展。

### 2. 配置艺术刮刀扩展

- **图片质量选择：**
    - 小图：225x225 像素
    - 中图：500x500 像素 (推荐)
    - 大图：1000x1000 像素
- **下载数量：** 建议设置为 1000-2000 张。
- **刷新间隔：** 保持默认的 60 秒即可。

## 使用指南

### 1. 首次使用

1. 等待艺术刮刀完成初始专辑封面下载 (这可能需要 30-60 分钟，取决于您的音乐库大小)。
2. 在您的浏览器中访问 `http://<您的 Roon Core IP 地址>:3090` 或 `http://localhost:3090` (如果艺术墙和 Roon Core 运行在同一台机器上)。
3. 确认艺术墙是否正常显示并自动更新专辑封面。

### 2. 日常使用

- 保持浏览器窗口或标签页处于打开状态，以便艺术墙持续运行。
- 避免手动刷新页面，艺术墙会自动更新。
- 为了获得最佳展示效果，请避免在显示器上进行鼠标或触摸操作。

### 3. 故障排除

- **页面显示空白：**
    - 检查您在 Docker 命令或 `docker-compose.yml` 文件中挂载的图片目录路径是否正确。
    - 确保该目录及其内容具有读取权限。
- **图片没有更新：**
    - 检查您的网络连接是否正常。
    - 确认 Roon Core 和艺术刮刀扩展正在运行。
- **动画卡顿：**
    - 检查运行艺术墙的设备的资源占用情况 (CPU、内存)。
    - 尝试减少艺术刮刀下载的图片质量或数量。
- **显示异常：**
    - 尝试清除浏览器缓存并重新加载页面。

## 技术特点

- **纯前端技术栈：** 基于 HTML5, CSS3 和原生 JavaScript 构建，无需后端服务。
- **高性能动画：** 利用 CSS 3D Transform 和 GPU 加速实现流畅的翻转效果。
- **智能缓存机制：** 图片池管理，优化内存使用，提升性能。
- **错误恢复能力：** 内置自动检测和恢复机制，提高稳定性。
- **专注展示：** 无用户交互设计，专注于提供沉浸式的视觉体验。

## 性能优化

- 使用 `CSS will-change` 属性提前告知浏览器动画元素，提升渲染性能。
- 采用 `transform-style: preserve-3d` 优化 3D 渲染效果。
- 智能的图片预加载和缓存策略，减少加载时间。
- 错峰更新动画，分散 GPU 负载，避免卡顿。
- 及时清理不再使用的图片资源，释放内存。

## 稳定性保障

- 具备自动错误恢复机制，应对偶发异常。
- 定期清理内存缓存，防止内存泄漏。
- 图片加载失败时自动重试，确保展示完整性。
- 系统状态监控，实现自动恢复。

## 维护说明

- 本项目设计为开箱即用，无需人工干预。
- 具备自动运行和恢复能力，降低维护成本。
- 记录关键运行信息，方便问题排查。
- 内置内存自动优化机制。

## 版权信息

Copyright © 2024 门耳朵科技

