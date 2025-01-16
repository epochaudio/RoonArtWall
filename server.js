const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3090;

// 添加缓存中间件
const albumsCache = {
    files: null,           // 缓存文件列表
    selectedAlbums: null,  // 缓存已选择的专辑
    timestamp: 0,
    ttl: 5 * 60 * 1000    // 5分钟缓存
};

// 缓存中间件
const cacheMiddleware = async (req, res, next) => {
    if (albumsCache.selectedAlbums && (Date.now() - albumsCache.timestamp) < albumsCache.ttl) {
        return res.json(albumsCache.selectedAlbums);
    }
    next();
};

// 内存监控中间件
const memoryMonitor = (req, res, next) => {
    const used = process.memoryUsage();
    if (used.heapUsed > used.heapTotal * 0.8) {
        console.warn('服务器内存使用过高，触发GC');
        global.gc && global.gc();
    }
    next();
};

// 高效的随机选择函数
function getRandomIndexes(max, count) {
    const indexes = new Set();
    while (indexes.size < count) {
        indexes.add(Math.floor(Math.random() * max));
    }
    return Array.from(indexes);
}

// 读取目录并随机选择文件
async function getRandomAlbums(dirPath, count) {
    try {
        // 如果文件列表缓存不存在或已过期，重新读取
        if (!albumsCache.files || (Date.now() - albumsCache.timestamp) >= albumsCache.ttl) {
            console.log('重新读取文件列表...');
            const files = await fs.readdir(dirPath);
            albumsCache.files = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
            console.log(`找到 ${albumsCache.files.length} 个图片文件`);
        }

        // 随机选择指定数量的文件
        const indexes = getRandomIndexes(albumsCache.files.length, count);
        const selectedFiles = indexes.map(i => albumsCache.files[i]);
        
        // 转换为URL路径
        return selectedFiles.map(file => `/art/Albums/${file}`);
    } catch (error) {
        console.error('读取专辑失败:', error);
        return [];
    }
}

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 优化后的专辑列表接口
app.get('/api/albums', cacheMiddleware, memoryMonitor, async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 21; // 默认21张（15初始 + 6更新）
        const albumsPath = '/app/art/Albums';
        
        // 获取随机专辑
        const selectedImages = await getRandomAlbums(albumsPath, count);
        
        // 更新缓存
        albumsCache.selectedAlbums = {
            success: true,
            total: selectedImages.length,
            albums: selectedImages
        };
        albumsCache.timestamp = Date.now();
        
        console.log(`返回 ${selectedImages.length} 个随机专辑封面`);
        res.json(albumsCache.selectedAlbums);
    } catch (error) {
        console.error('API错误:', error);
        res.json({
            success: false,
            total: 0,
            albums: []
        });
    }
});

// 提供图片访问
app.use('/art', express.static('/app/art'));

// 健康检查接口
app.get('/health', (req, res) => {
    const health = {
        status: 'ok',
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        timestamp: Date.now()
    };
    res.json(health);
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`艺术墙服务运行在 http://localhost:${PORT}`);
    console.log('工作目录:', process.cwd());
    console.log('专辑目录:', '/app/art/Albums');
}); 