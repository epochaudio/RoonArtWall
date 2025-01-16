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

// 添加请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 静态文件服务 - 提供前端页面
app.use(express.static(path.join(__dirname, '..')));

// 静态文件服务 - 指向art/Albums目录
app.use('/art/Albums', express.static('/app/art/Albums'));

// 获取专辑列表的API
app.get('/api/albums', async (req, res) => {
    try {
        const albumsDir = '/app/art/Albums';
        console.log('读取目录:', albumsDir);
        
        // 检查目录是否存在
        try {
            await fs.access(albumsDir);
        } catch (err) {
            console.error('专辑目录不存在:', err);
            return res.status(500).json({
                success: false,
                error: '专辑目录不存在'
            });
        }
        
        const files = await fs.readdir(albumsDir);
        console.log('找到文件数量:', files.length);
        
        // 只返回图片文件
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );
        console.log('图片文件数量:', imageFiles.length);

        if (imageFiles.length === 0) {
            return res.status(404).json({
                success: false,
                error: '未找到图片文件'
            });
        }

        // 随机打乱数组顺序
        const shuffledAlbums = imageFiles
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        
        const response = {
            success: true,
            total: shuffledAlbums.length,
            albums: shuffledAlbums.map(file => `/art/Albums/${encodeURIComponent(file)}`)
        };
        
        console.log('返回专辑数量:', response.total);
        res.json(response);
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
        const roonSettingsPath = path.join(__dirname, '..', '.roondata', 'settings.json');
        console.log('尝试读取设置文件:', roonSettingsPath); // 添加日志
        
        let settings = {
            refresh_interval: 60 // 默认值
        };
        
        try {
            const data = await fs.readFile(roonSettingsPath, 'utf8');
            console.log('读取到的设置文件内容:', data); // 添加日志
            const roonSettings = JSON.parse(data);
            if (roonSettings && typeof roonSettings.refresh_interval !== 'undefined') {
                settings.refresh_interval = parseInt(roonSettings.refresh_interval, 10) || 60;
                console.log('解析后的刷新间隔:', settings.refresh_interval); // 添加日志
            }
        } catch (err) {
            console.error('读取设置文件失败:', err); // 改进错误日志
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

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('专辑目录路径:', '/app/art/Albums');
}); 