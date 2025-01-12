const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = 3090;

// 配置 CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 静态文件服务 - 提供前端页面
app.use(express.static(path.join(__dirname, '..')));

// 静态文件服务 - 指向art/Albums目录
app.use('/art/Albums', express.static('/app/art/Albums'));

// 获取专辑列表的API
app.get('/api/albums', async (req, res) => {
    try {
        const albumsDir = '/app/art/Albums';
        console.log('读取目录:', albumsDir);
        
        const files = await fs.readdir(albumsDir);
        console.log('找到文件数量:', files.length);
        
        // 只返回图片文件
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );
        console.log('图片文件数量:', imageFiles.length);

        // 随机打乱数组顺序
        const shuffledAlbums = imageFiles
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        
        res.json({
            success: true,
            total: shuffledAlbums.length,
            albums: shuffledAlbums.map(file => `/art/Albums/${encodeURIComponent(file)}`)
        });
    } catch (error) {
        console.error('读取专辑目录失败:', error);
        res.status(500).json({
            success: false,
            error: '读取专辑目录失败'
        });
    }
});

// 获取随机专辑的API
app.get('/api/albums/random', async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 1;
        const albumsDir = path.join(__dirname, '../art/Albums');
        const files = await fs.readdir(albumsDir);
        
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        // 随机选择指定数量的专辑
        const selectedAlbums = [];
        const usedIndices = new Set();

        while (selectedAlbums.length < count && selectedAlbums.length < imageFiles.length) {
            const randomIndex = Math.floor(Math.random() * imageFiles.length);
            if (!usedIndices.has(randomIndex)) {
                usedIndices.add(randomIndex);
                selectedAlbums.push(imageFiles[randomIndex]);
            }
        }

        res.json({
            success: true,
            albums: selectedAlbums.map(file => `/albums/${encodeURIComponent(file)}`)
        });
    } catch (error) {
        console.error('获取随机专辑失败:', error);
        res.status(500).json({
            success: false,
            error: '获取随机专辑失败'
        });
    }
});

// 获取设置的API
app.get('/api/settings', async (req, res) => {
    try {
        // 从Roon配置文件读取设置
        const roonSettingsPath = path.join(process.cwd(), '../.roondata/settings.json');
        let settings = {
            refresh_interval: 60 // 默认值
        };
        
        try {
            const data = await fs.readFile(roonSettingsPath, 'utf8');
            const roonSettings = JSON.parse(data);
            if (roonSettings && typeof roonSettings.refresh_interval === 'number') {
                settings.refresh_interval = roonSettings.refresh_interval;
            }
        } catch (err) {
            console.log('无法读取Roon设置，使用默认值');
        }
        
        res.json({
            success: true,
            settings: settings
        });
    } catch (error) {
        console.error('获取设置失败:', error);
        res.status(500).json({
            success: false,
            error: '获取设置失败'
        });
    }
});

// 健康检查API
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 