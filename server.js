const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3090;

// 静态文件服务 - 服务当前目录下的静态文件
app.use(express.static(path.join(__dirname)));

// 获取专辑列表
app.get('/list-albums', async (req, res) => {
    try {
        // 使用绝对路径
        const albumsPath = '/app/art/Albums';
        console.log('正在读取目录:', albumsPath);
        
        const files = await fs.readdir(albumsPath);
        const imageFiles = files.filter(file => 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.jpeg') || 
            file.toLowerCase().endsWith('.png')
        );
        
        console.log(`找到 ${imageFiles.length} 个图片文件`);
        res.json(imageFiles || []);
    } catch (error) {
        console.error('读取专辑目录失败:', error);
        res.json([]);
    }
});

// 提供图片访问 - 使用绝对路径
app.use('/art', express.static('/app/art'));

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`艺术墙服务运行在 http://localhost:${PORT}`);
    console.log('工作目录:', process.cwd());
    console.log('专辑目录:', '/app/art/Albums');
}); 