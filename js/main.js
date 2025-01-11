document.addEventListener('DOMContentLoaded', () => {
    const artWall = document.querySelector('.art-wall');
    let isFullscreen = false;
    let albumList = [];
    let displayedAlbums = new Set(); // 跟踪已显示的图片
    const API_BASE = ''; // 使用相对路径

    // 切换全屏模式
    function toggleFullscreen() {
        if (!isFullscreen) {
            if (artWall.requestFullscreen) {
                artWall.requestFullscreen();
            } else if (artWall.webkitRequestFullscreen) {
                artWall.webkitRequestFullscreen();
            } else if (artWall.msRequestFullscreen) {
                artWall.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
    });
    document.addEventListener('webkitfullscreenchange', () => {
        isFullscreen = !!document.webkitFullscreenElement;
    });
    document.addEventListener('msfullscreenchange', () => {
        isFullscreen = !!document.msFullscreenElement;
    });

    // 获取专辑列表
    async function fetchAlbumList(retryCount = 3) {
        try {
            const response = await fetch(`${API_BASE}/api/albums`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                albumList = data.albums;
                console.log(`获取到专辑列表: ${albumList.length} 张`);
            } else {
                throw new Error('获取专辑列表失败');
            }
        } catch (error) {
            console.error('获取专辑列表失败:', error);
            if (retryCount > 0) {
                console.log(`尝试重新获取，剩余重试次数: ${retryCount - 1}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
                return fetchAlbumList(retryCount - 1);
            }
            albumList = [];
        }
    }

    // 获取随机专辑（避免重复）
    function getRandomAlbums(count = 9) {
        if (!Array.isArray(albumList) || albumList.length === 0) {
            console.warn('没有可用的专辑');
            return [];
        }

        // 如果已显示的图片数量超过总数的80%，重置已显示列表
        if (displayedAlbums.size > albumList.length * 0.8) {
            displayedAlbums.clear();
        }

        const availableAlbums = albumList.filter(album => !displayedAlbums.has(album));
        const selectedAlbums = [];
        
        // 如果可用专辑不足，使用全部可用专辑
        if (availableAlbums.length <= count) {
            selectedAlbums.push(...availableAlbums);
            displayedAlbums.clear(); // 重置已显示列表
        } else {
            // 随机选择未显示过的专辑
            while (selectedAlbums.length < count && availableAlbums.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableAlbums.length);
                const album = availableAlbums.splice(randomIndex, 1)[0];
                selectedAlbums.push(album);
                displayedAlbums.add(album);
            }
        }

        return selectedAlbums;
    }

    // 加载图片
    async function loadImages() {
        try {
            if (albumList.length === 0) {
                await fetchAlbumList();
            }

            artWall.innerHTML = '';
            const selectedAlbums = getRandomAlbums();

            if (selectedAlbums.length === 0) {
                artWall.innerHTML = '<div class="error">没有找到专辑封面</div>';
                return;
            }

            selectedAlbums.forEach(albumPath => {
                // 创建外部容器
                const container = document.createElement('div');
                container.className = 'album-container';
                
                // 创建内部容器
                const inner = document.createElement('div');
                inner.className = 'album-inner';
                
                // 创建图片
                const img = document.createElement('img');
                img.className = 'album-cover';
                // 使用完整路径
                img.src = albumPath;
                img.alt = decodeURIComponent(albumPath.split('/').pop().replace('.jpg', ''));
                
                img.addEventListener('load', () => {
                    console.log('图片加载成功:', albumPath);
                    img.classList.add('loaded');
                });
                
                img.addEventListener('error', (e) => {
                    console.error('图片加载失败:', albumPath);
                    console.log('尝试使用备用路径');
                    // 尝试使用备用路径
                    const backupPath = albumPath.replace('/art/Albums/', '/albums/');
                    if (img.src !== backupPath) {
                        img.src = backupPath;
                    } else {
                        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="100%25" height="100%25" fill="%23333"/%3E%3C/svg%3E';
                    }
                });

                // 组装DOM结构
                inner.appendChild(img);
                container.appendChild(inner);
                artWall.appendChild(container);
            });
        } catch (error) {
            console.error('加载图片失败:', error);
            artWall.innerHTML = '<div class="error">加载图片失败</div>';
        }
    }

    // 点击事件监听
    artWall.addEventListener('click', toggleFullscreen);

    // ESC键退出全屏
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFullscreen) {
            toggleFullscreen();
        }
    });

    // 加载初始图片
    loadImages();

    // 每30秒更新一次图片
    setInterval(() => loadImages(), 30000);
}); 