class ArtWall {
    constructor() {
        this.container = document.getElementById('art-wall');
        this.albums = [];
        this.currentBatch = new Set();
        this.imagePool = new Map();
        this.updateInterval = 60000; // 默认60秒
        this.maxPoolSize = 100;
        this.apiBaseUrl = 'http://localhost:3090';
        this.updateTimer = null;
        this.init();
    }

    async init() {
        try {
            await this.loadSettings();
            await this.loadAlbums();
            this.setupInitialGrid();
            this.startUpdateCycle();
            this.setupResizeHandler();
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    async loadSettings() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/settings`);
            if (!response.ok) {
                throw new Error('获取设置失败');
            }
            
            const data = await response.json();
            if (data.success && data.settings) {
                this.updateInterval = data.settings.refresh_interval * 1000; // 转换为毫秒
                console.log(`设置刷新间隔为 ${this.updateInterval/1000} 秒`);
            }
        } catch (error) {
            console.error('加载设置失败:', error);
            // 使用默认值
            this.updateInterval = 60000;
        }
    }

    async loadAlbums() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/albums`);
            if (!response.ok) {
                throw new Error('获取专辑列表失败');
            }
            
            const data = await response.json();
            if (data.success && Array.isArray(data.albums)) {
                this.albums = data.albums;
                console.log(`加载了 ${this.albums.length} 个专辑封面`);
                
                // 预加载一部分图片
                await this.preloadImages(this.albums.slice(0, 20));
            }
        } catch (error) {
            console.error('加载专辑失败:', error);
            throw error;
        }
    }

    async preloadImages(paths) {
        const loadPromises = paths.map(path => {
            if (!this.imagePool.has(path)) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        this.addToImagePool(path, img);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = path;
                });
            }
            return Promise.resolve();
        });

        await Promise.allSettled(loadPromises);
    }

    addToImagePool(path, img) {
        // 如果池已满,删除最早的图片
        if (this.imagePool.size >= this.maxPoolSize) {
            const [firstKey] = this.imagePool.keys();
            this.imagePool.delete(firstKey);
        }
        this.imagePool.set(path, img);
    }

    setupInitialGrid() {
        this.updateGridSize();
        this.createInitialCards();
    }

    updateGridSize() {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        const cardWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
        const cardHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-height'));
        
        this.cols = Math.floor(containerWidth / cardWidth);
        this.rows = Math.floor(containerHeight / cardHeight);
        this.totalCards = this.cols * this.rows;
    }

    createInitialCards() {
        // 清空容器
        this.container.innerHTML = '';
        
        // 创建初始卡片
        for (let i = 0; i < this.totalCards; i++) {
            const card = this.createAlbumCard();
            // 立即加载一个随机专辑
            this.updateCard(card, this.getRandomAlbum());
        }
    }

    setupResizeHandler() {
        // 使用防抖处理resize事件
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                this.updateGridSize();
                this.createInitialCards();
            }, 250);
        });
    }

    createAlbumCard() {
        const card = document.createElement('div');
        card.className = 'album-card';
        
        const front = document.createElement('div');
        front.className = 'album-card-front';
        
        const back = document.createElement('div');
        back.className = 'album-card-back';
        
        card.appendChild(front);
        card.appendChild(back);
        this.container.appendChild(card);
        
        return card;
    }

    async updateCard(card, albumPath) {
        try {
            if (!this.imagePool.has(albumPath)) {
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        this.addToImagePool(albumPath, img);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = albumPath;
                });
            }

            const newImage = this.imagePool.get(albumPath).cloneNode();
            newImage.className = 'album-cover';
            
            const back = card.querySelector('.album-card-back');
            back.innerHTML = '';
            back.appendChild(newImage);
            
            requestAnimationFrame(() => {
                card.classList.add('flip');
            });
            
            // 翻转完成后更新正面
            setTimeout(() => {
                const front = card.querySelector('.album-card-front');
                front.innerHTML = '';
                front.appendChild(newImage.cloneNode());
                card.classList.remove('flip');
            }, 600);
        } catch (error) {
            console.error('更新卡片失败:', error);
        }
    }

    getRandomAlbum() {
        const randomIndex = Math.floor(Math.random() * this.albums.length);
        return this.albums[randomIndex];
    }

    async updateRandomCards() {
        if (this.albums.length === 0) return;

        try {
            // 获取要更新的随机专辑
            const response = await fetch(`${this.apiBaseUrl}/api/albums/random?count=${Math.floor(this.totalCards * 0.2)}`);
            if (!response.ok) {
                throw new Error('获取随机专辑失败');
            }

            const data = await response.json();
            if (!data.success || !Array.isArray(data.albums)) {
                throw new Error('无效的响应数据');
            }

            // 随机选择要更新的卡片
            const cards = Array.from(this.container.children);
            const cardsToUpdate = cards
                .sort(() => Math.random() - 0.5)
                .slice(0, data.albums.length);

            // 预加载新的图片
            await this.preloadImages(data.albums);

            // 更新卡片
            cardsToUpdate.forEach((card, index) => {
                this.updateCard(card, data.albums[index]);
            });
        } catch (error) {
            console.error('更新随机卡片失败:', error);
        }
    }

    startUpdateCycle() {
        // 清除现有的定时器
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        // 设置新的定时器
        this.updateTimer = setInterval(() => this.updateRandomCards(), this.updateInterval);
        console.log(`已设置更新周期: ${this.updateInterval/1000}秒`);
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ArtWall();
}); 