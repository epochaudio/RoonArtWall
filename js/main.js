class ArtWall {
    constructor() {
        this.container = document.getElementById('art-wall');
        this.covers = new Map();
        this.imagePool = new Map();
        this.maxPoolSize = 30;  // 最大缓存数量
        this.updateInterval = 60000;  // 60秒更新
        this.isUpdating = false;
        this.init();
    }

    async init() {
        try {
            await this.loadInitialCovers();
            this.startUpdateCycle();
        } catch (error) {
            console.error('初始化失败:', error);
            this.attemptRecovery();
        }
    }

    async loadInitialCovers() {
        try {
            const covers = await this.fetchAlbumCovers(15);  // 固定15张图片
            covers.forEach((coverUrl, index) => {
                const position = index + 1;
                this.createCoverElement(coverUrl, position);
            });
        } catch (error) {
            console.error('初始化封面失败:', error);
            this.attemptRecovery();
        }
    }

    createCoverElement(imageUrl, position) {
        const cover = document.createElement('div');
        cover.className = 'album-cover';
        cover.dataset.position = position;

        const front = document.createElement('div');
        front.className = 'album-cover-front';
        const back = document.createElement('div');
        back.className = 'album-cover-back';

        this.loadImage(imageUrl)
            .then(img => {
                front.appendChild(img);
                this.imagePool.set(imageUrl, img);
            })
            .catch(() => {
                console.error('加载图片失败:', imageUrl);
                this.attemptRecovery();
            });

        cover.appendChild(front);
        cover.appendChild(back);
        this.container.appendChild(cover);
        this.covers.set(position, cover);
    }

    async fetchAlbumCovers(count) {
        try {
            const response = await fetch('/api/albums');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.albums.slice(0, count);
        } catch (error) {
            console.error('获取专辑封面失败:', error);
            throw error;
        }
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                img.src = '';
                reject(new Error('图片加载超时'));
            }, 10000);

            img.onload = () => {
                clearTimeout(timeout);
                resolve(img);
            };

            img.onerror = () => {
                clearTimeout(timeout);
                reject(new Error(`加载图片失败: ${url}`));
            };

            img.src = url;
        });
    }

    async updateRandomCovers() {
        if (this.isUpdating) return;
        
        try {
            this.isUpdating = true;
            const positions = this.getRandomPositions(3);  // 每次更新3张
            const newCovers = await this.fetchAlbumCovers(positions.length);
            
            for (let i = 0; i < positions.length; i++) {
                const position = positions[i];
                const cover = this.covers.get(position);
                const newUrl = newCovers[i];
                
                if (cover && newUrl) {
                    await this.flipCover(cover, newUrl);
                    await new Promise(resolve => setTimeout(resolve, 200));  // 错开翻转时间
                }
            }
            
            this.cleanImagePool();
        } catch (error) {
            console.error('更新封面失败:', error);
        } finally {
            this.isUpdating = false;
        }
    }

    getRandomPositions(count) {
        const positions = Array.from(this.covers.keys());
        const selected = new Set();
        
        while (selected.size < count) {
            const randomIndex = Math.floor(Math.random() * positions.length);
            const position = positions[randomIndex];
            selected.add(position);
        }
        
        return Array.from(selected);
    }

    async flipCover(cover, newImageUrl) {
        try {
            const back = cover.querySelector('.album-cover-back');
            const newImg = await this.loadImage(newImageUrl);
            
            if (!back || !newImg) return;
            
            back.innerHTML = '';
            back.appendChild(newImg);
            
            cover.classList.add('flipping');
            
            await new Promise(resolve => setTimeout(resolve, 600));  // 匹配CSS动画时间
            
            const front = cover.querySelector('.album-cover-front');
            if (front) {
                front.innerHTML = back.innerHTML;
                back.innerHTML = '';
            }
            
            cover.classList.remove('flipping');
            this.imagePool.set(newImageUrl, newImg);
        } catch (error) {
            console.error('翻转封面失败:', error);
            if (cover) cover.classList.remove('flipping');
        }
    }

    cleanImagePool() {
        if (this.imagePool.size > this.maxPoolSize) {
            const entries = Array.from(this.imagePool.entries());
            const toRemove = entries.slice(0, entries.length - this.maxPoolSize);
            toRemove.forEach(([url]) => this.imagePool.delete(url));
        }
    }

    startUpdateCycle() {
        setInterval(() => this.updateRandomCovers(), this.updateInterval);
    }

    attemptRecovery() {
        this.cleanImagePool();
        this.isUpdating = false;
        setTimeout(() => this.loadInitialCovers(), 5000);  // 5秒后尝试重新加载
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new ArtWall();
}); 