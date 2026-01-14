// 清晰大师应用核心逻辑
class EnhanceApp {
    constructor() {
        // 用户状态
        this.user = {
            isLoggedIn: false,
            username: '',
            remainingUses: 0,
            isPremium: false
        };
        
        // 初始化轮播图
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.banner-slide');
        this.initCarousel();
        
        // 初始化标签页
        this.initTabs();
        
        // 初始化文件上传
        this.initFileUpload();
        
        // 初始化评论系统
        this.initComments();
        
        // 初始化付费功能
        this.initPremium();
        
        // 初始化用户认证
    this.initAuth();
    
    // 初始化模态框功能
    this.initModals();
    
    // 初始化导航功能
    this.initNavigation();
    
    // 加载用户数据
    this.loadUserData();
    
    // 快速初始化次数显示，优化加载速度
    this.quickInitUsageDisplay();
    }
    
    // 初始化轮播图
    initCarousel() {
        // 自动轮播
        this.carouselInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
        
        // 左右按钮事件
        document.querySelector('.prev-btn').addEventListener('click', () => {
            this.prevSlide();
        });
        
        document.querySelector('.next-btn').addEventListener('click', () => {
            this.nextSlide();
        });
    }
    
    // 上一张幻灯片
    prevSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
    
    // 下一张幻灯片
    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
    
    // 初始化标签页
    initTabs() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const tabs = document.querySelectorAll('.功能-tab');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // 更新导航按钮状态
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 显示对应标签页
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }
    
    // 初始化文件上传
    initFileUpload() {
        // 照片上传
        this.initPhotoUpload();
        
        // 视频上传
        this.initVideoUpload();
    }
    
    // 初始化照片上传
    initPhotoUpload() {
        const photoUpload = document.getElementById('photoUpload');
        const uploadBox = photoUpload.parentElement;
        
        // 点击上传
        uploadBox.addEventListener('click', () => {
            photoUpload.click();
        });
        
        // 文件选择事件
        photoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handlePhotoUpload(file);
            }
        });
        
        // 拖拽上传
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.background = 'rgba(102, 126, 234, 0.1)';
        });
        
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.style.background = 'rgba(102, 126, 234, 0.05)';
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.background = 'rgba(102, 126, 234, 0.05)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handlePhotoUpload(file);
            }
        });
        
        // 下载按钮事件
        document.getElementById('downloadPhoto').addEventListener('click', () => {
            this.downloadPhoto();
        });
        
        // 删除按钮事件
        document.getElementById('deletePhoto').addEventListener('click', () => {
            this.deletePhoto();
        });
        
        // 增强选项事件监听
        document.getElementById('confirmEnhance').addEventListener('click', () => {
            this.startEnhance();
        });
        
        document.getElementById('cancelEnhance').addEventListener('click', () => {
            this.cancelEnhance();
        });
    }
    
    // 处理照片上传
    handlePhotoUpload(file) {
        // 检查是否可以使用增强功能
        if (!this.canUseEnhance()) {
            return;
        }
        
        // 保存当前文件
        this.currentFile = file;
        
        // 显示上传预览
        this.showUploadPreview(file);
        
        // 显示清晰度和大小选择面板
        const uploadArea = document.querySelector('#photo-tab .upload-area');
        const enhanceOptions = document.querySelector('.enhance-options');
        
        uploadArea.style.display = 'none';
        enhanceOptions.style.display = 'block';
        
        // 设置默认输出尺寸为4K（注册用户）
        this.setDefaultOutputSize();
    }
    
    // 显示上传预览
    showUploadPreview(file) {
        const previewImage = document.getElementById('previewImage');
        const uploadPreview = document.getElementById('uploadPreview');
        
        // 创建文件URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target.result;
            previewImage.src = imageSrc;
            uploadPreview.style.display = 'flex';
            
            // 添加点击查看事件
            previewImage.onclick = () => {
                this.openPhotoPreview(imageSrc);
            };
        };
        reader.readAsDataURL(file);
        
        // 添加移除预览事件
        const removePreviewBtn = document.getElementById('removePreview');
        removePreviewBtn.addEventListener('click', () => {
            this.removeUploadPreview();
        });
    }
    
    // 移除上传预览
    removeUploadPreview() {
        const previewImage = document.getElementById('previewImage');
        const uploadPreview = document.getElementById('uploadPreview');
        const uploadArea = document.querySelector('#photo-tab .upload-area');
        const enhanceOptions = document.querySelector('.enhance-options');
        
        previewImage.src = '';
        uploadPreview.style.display = 'none';
        uploadArea.style.display = 'flex';
        enhanceOptions.style.display = 'none';
        this.currentFile = null;
    }
    
    // 打开照片预览
    openPhotoPreview(imageSrc) {
        const previewModal = document.getElementById('photoPreviewModal');
        const previewFullImage = document.getElementById('previewFullImage');
        
        previewFullImage.src = imageSrc;
        previewModal.style.display = 'flex';
    }
    
    // 更新次数记录显示
    updateUsageDisplay() {
        // 快速获取DOM元素
        const remainingUsesCount = document.getElementById('remainingUsesCount');
        
        if (remainingUsesCount) {
            if (this.user.isLoggedIn) {
                remainingUsesCount.textContent = this.user.remainingUses;
                // 更新使用类型
                const usageType = document.querySelector('.usage-item:nth-child(2) .usage-count');
                const usageSubtype = document.querySelector('.usage-item:nth-child(2) .usage-type');
                if (usageType && usageSubtype) {
                    usageType.textContent = this.user.isPremium ? '会员' : '免费';
                    usageSubtype.textContent = '登录用户';
                }
            } else {
                // 未登录用户使用次数 - 快速计算
                let guestUses = parseInt(localStorage.getItem('guestUses') || '0', 10);
                const remaining = 50 - guestUses;
                remainingUsesCount.textContent = remaining;
            }
        }
        
        // 快速更新顶部剩余次数显示
        this.showRemainingUses();
    }
    
    // 快速初始化次数显示
    quickInitUsageDisplay() {
        // 立即获取DOM元素，避免重复查询
        const remainingUsesCount = document.getElementById('remainingUsesCount');
        if (remainingUsesCount) {
            // 直接显示当前用户的剩余次数，不等待数据加载
            let initialCount = 50;
            if (this.user.isLoggedIn) {
                initialCount = this.user.remainingUses;
            } else {
                // 直接从localStorage获取，不进行复杂计算
                const guestUses = localStorage.getItem('guestUses') || '0';
                initialCount = Math.max(0, 50 - parseInt(guestUses, 10));
            }
            remainingUsesCount.textContent = initialCount;
            
            // 异步更新详细信息，不阻塞UI
            setTimeout(() => {
                this.updateUsageDisplay();
            }, 0); // 使用0延迟，立即放入事件队列
        }
    }
    
    // 开始增强处理
    startEnhance() {
        if (!this.currentFile) {
            return;
        }
        
        // 隐藏选项面板，显示进度条
        const enhanceOptions = document.querySelector('.enhance-options');
        const progressSection = document.querySelector('#photo-tab .progress-section');
        const resultArea = document.querySelector('#photo-tab .result-area');
        
        enhanceOptions.style.display = 'none';
        progressSection.style.display = 'block';
        resultArea.style.display = 'none';
        
        // 获取选择的增强选项
        const clarityLevel = document.getElementById('clarityLevel').value;
        const outputSize = document.getElementById('outputSize').value;
        
        // 保存当前增强选项
        this.enhanceOptions = {
            clarityLevel: clarityLevel,
            outputSize: outputSize
        };
        
        // 模拟处理进度
        this.simulateProgress((progress) => {
            document.getElementById('progressPercent').textContent = `${progress}%`;
            document.getElementById('progressFill').style.width = `${100 - progress}%`;
        }, () => {
            // 处理完成
            progressSection.style.display = 'none';
            resultArea.style.display = 'block';
            
            // 减少使用次数
            this.decreaseUses();
            
            // 显示结果
            this.displayPhotoResult(this.currentFile);
        });
    }
    
    // 取消增强处理
    cancelEnhance() {
        // 隐藏选项面板，显示上传区域
        const enhanceOptions = document.querySelector('.enhance-options');
        const uploadArea = document.querySelector('#photo-tab .upload-area');
        
        enhanceOptions.style.display = 'none';
        uploadArea.style.display = 'flex';
        
        // 清除当前文件
        this.currentFile = null;
    }
    
    // 显示照片处理结果
    displayPhotoResult(file) {
        const originalPhoto = document.getElementById('originalPhoto');
        const enhancedPhoto = document.getElementById('enhancedPhoto');
        
        // 创建文件URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target.result;
            originalPhoto.src = imageSrc;
            enhancedPhoto.src = imageSrc; // 这里可以替换为实际处理后的图片
            
            // 添加点击查看事件
            originalPhoto.onclick = () => {
                this.openPhotoPreview(imageSrc);
            };
            
            enhancedPhoto.onclick = () => {
                this.openPhotoPreview(imageSrc);
            };
        };
        reader.readAsDataURL(file);
    }
    
    // 下载照片
    downloadPhoto() {
        const enhancedPhoto = document.getElementById('enhancedPhoto');
        if (enhancedPhoto.src) {
            // 创建下载链接
            const link = document.createElement('a');
            link.href = enhancedPhoto.src;
            link.download = `enhanced_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 模拟保存到相册
            this.saveToAlbum();
        }
    }
    
    // 删除照片
    deletePhoto() {
        // 隐藏结果区域，显示上传区域
        const resultArea = document.querySelector('#photo-tab .result-area');
        const uploadArea = document.querySelector('#photo-tab .upload-area');
        const enhanceOptions = document.querySelector('.enhance-options');
        
        resultArea.style.display = 'none';
        uploadArea.style.display = 'flex';
        enhanceOptions.style.display = 'none';
        
        // 清除当前文件和预览
        this.currentFile = null;
        const previewImage = document.getElementById('previewImage');
        const uploadPreview = document.getElementById('uploadPreview');
        const originalPhoto = document.getElementById('originalPhoto');
        const enhancedPhoto = document.getElementById('enhancedPhoto');
        
        previewImage.src = '';
        uploadPreview.style.display = 'none';
        originalPhoto.src = '';
        enhancedPhoto.src = '';
        
        // 重置文件输入
        document.getElementById('photoUpload').value = '';
    }
    
    // 初始化视频上传
    initVideoUpload() {
        const videoUpload = document.getElementById('videoUpload');
        const uploadBox = videoUpload.parentElement;
        
        // 点击上传
        uploadBox.addEventListener('click', () => {
            videoUpload.click();
        });
        
        // 文件选择事件
        videoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleVideoUpload(file);
            }
        });
        
        // 拖拽上传
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.style.background = 'rgba(102, 126, 234, 0.1)';
        });
        
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.style.background = 'rgba(102, 126, 234, 0.05)';
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.style.background = 'rgba(102, 126, 234, 0.05)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('video/')) {
                this.handleVideoUpload(file);
            }
        });
        
        // 下载按钮事件
        document.getElementById('downloadVideo').addEventListener('click', () => {
            this.downloadVideo();
        });
        
        // 删除按钮事件
        document.getElementById('deleteVideo').addEventListener('click', () => {
            this.deleteVideo();
        });
    }
    
    // 处理视频上传
    handleVideoUpload(file) {
        // 检查是否可以使用增强功能
        if (!this.canUseEnhance()) {
            return;
        }
        
        // 显示进度条
        const progressSection = document.querySelector('#video-tab .progress-section');
        const resultArea = document.querySelector('#video-tab .result-area');
        const uploadArea = document.querySelector('#video-tab .upload-area');
        
        uploadArea.style.display = 'none';
        progressSection.style.display = 'block';
        resultArea.style.display = 'none';
        
        // 模拟处理进度
        this.simulateProgress((progress) => {
            document.getElementById('videoProgressPercent').textContent = `${progress}%`;
            document.getElementById('videoProgressFill').style.width = `${100 - progress}%`;
        }, () => {
            // 处理完成
            progressSection.style.display = 'none';
            resultArea.style.display = 'block';
            
            // 减少使用次数
            this.decreaseUses();
            
            // 显示结果
            this.displayVideoResult(file);
        });
    }
    
    // 显示视频处理结果
    displayVideoResult(file) {
        const originalVideo = document.getElementById('originalVideo');
        const enhancedVideo = document.getElementById('enhancedVideo');
        
        // 创建文件URL
        const videoURL = URL.createObjectURL(file);
        originalVideo.src = videoURL;
        enhancedVideo.src = videoURL; // 这里可以替换为实际处理后的视频
    }
    
    // 下载视频
    downloadVideo() {
        const enhancedVideo = document.getElementById('enhancedVideo');
        if (enhancedVideo.src) {
            // 创建下载链接
            const link = document.createElement('a');
            link.href = enhancedVideo.src;
            link.download = `enhanced_${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 模拟保存到相册
            this.saveToAlbum();
        }
    }
    
    // 删除视频
    deleteVideo() {
        // 隐藏结果区域，显示上传区域
        const resultArea = document.querySelector('#video-tab .result-area');
        const uploadArea = document.querySelector('#video-tab .upload-area');
        
        resultArea.style.display = 'none';
        uploadArea.style.display = 'flex';
        
        // 清除当前视频
        this.currentVideo = null;
        const originalVideo = document.getElementById('originalVideo');
        const enhancedVideo = document.getElementById('enhancedVideo');
        
        originalVideo.src = '';
        enhancedVideo.src = '';
        
        // 重置文件输入
        document.getElementById('videoUpload').value = '';
    }
    
    // 模拟处理进度
    simulateProgress(updateCallback, completeCallback) {
        let progress = 100;
        const interval = setInterval(() => {
            progress -= 5;
            if (progress <= 0) {
                clearInterval(interval);
                updateCallback(0);
                completeCallback();
            } else {
                updateCallback(progress);
            }
        }, 150); // 速度适中偏快
    }
    
    // 模拟保存到相册
    saveToAlbum() {
        // 这里可以实现实际的保存到相册功能
        console.log('已保存到相册');
        alert('已保存到相册');
    }
    
    // 初始化评论系统
    initComments() {
        const submitBtn = document.getElementById('submitComment');
        const commentInput = document.getElementById('commentInput');
        const commentsList = document.getElementById('commentsList');
        
        submitBtn.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                this.addComment(commentText);
                commentInput.value = '';
            }
        });
        
        // 按Enter键发布评论
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitBtn.click();
            }
        });
    }
    
    // 添加评论
    addComment(text) {
        const commentsList = document.getElementById('commentsList');
        
        // 创建评论元素
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-avatar">👤</div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-user">匿名用户</span>
                    <span class="comment-time">刚刚</span>
                </div>
                <div class="comment-text">${text}</div>
            </div>
        `;
        
        // 添加到评论列表（左侧连续向下延伸）
        commentsList.appendChild(commentItem);
        
        // 滚动到最新评论
        commentItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    
    // 初始化付费功能
    initPremium() {
        // 微信支付功能已在HTML中通过onclick事件绑定
    }
    
    // 初始化用户认证
    initAuth() {
        // 登录/注册按钮事件
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.showAuthModal('login');
        });
        
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.showAuthModal('register');
        });
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // 开通会员按钮事件
        document.getElementById('premiumPageBtn').addEventListener('click', () => {
            this.openPremiumPage();
        });
        
        // 认证表单提交
        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('loginForm').style.display !== 'none') {
                this.login();
            } else {
                this.register();
            }
        });
        
        // 设置页面退出登录按钮
        document.getElementById('settingsLogoutBtn').addEventListener('click', () => {
            this.logout();
        });
        
        // 为登录按钮添加直接点击事件
        const loginSubmitBtn = document.querySelector('#loginForm .auth-btn');
        if (loginSubmitBtn) {
            loginSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.login();
            });
        }
        
        // 为注册按钮添加直接点击事件
        const registerSubmitBtn = document.querySelector('#registerForm .auth-btn');
        if (registerSubmitBtn) {
            registerSubmitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.register();
            });
        }
        
        // 初始化用户头像事件
        this.initUserAvatar();
    }
    
    // 初始化用户头像事件
    initUserAvatar() {
        const userAvatar = document.getElementById('userAvatar');
        const avatarIcon = userAvatar.querySelector('.avatar-icon');
        const avatarDropdown = userAvatar.querySelector('.avatar-dropdown');
        
        // 头像点击事件 - 显示/隐藏下拉菜单
        avatarIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarDropdown.style.display = avatarDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', () => {
            avatarDropdown.style.display = 'none';
        });
        
        // 下拉菜单内点击不关闭
        avatarDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // 下拉菜单项点击事件
        // 编辑头像
        document.getElementById('editAvatar').addEventListener('click', () => {
            this.editAvatar();
            avatarDropdown.style.display = 'none';
        });
        
        // 查看资料
        document.getElementById('viewProfile').addEventListener('click', () => {
            this.viewProfile();
            avatarDropdown.style.display = 'none';
        });
        
        // 设置
        document.getElementById('settings').addEventListener('click', () => {
            // 切换到设置标签页
            const settingsBtn = document.querySelector('.nav-btn[data-tab="settings"]');
            if (settingsBtn) {
                settingsBtn.click();
            }
            avatarDropdown.style.display = 'none';
        });
        
        // 退出登录
        document.getElementById('logout').addEventListener('click', () => {
            this.logout();
            avatarDropdown.style.display = 'none';
        });
    }
    
    // 编辑头像
    editAvatar() {
        // 打开编辑头像模态框
        const editAvatarModal = document.getElementById('editAvatarModal');
        if (editAvatarModal) {
            editAvatarModal.style.display = 'flex';
        }
        
        // 初始化头像预览
        this.initAvatarPreview();
        
        // 确保事件监听器已添加
        this.initAvatarEventListeners();
    }
    
    // 初始化头像预览
    initAvatarPreview() {
        // 获取头像预览元素
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarPreviewPlaceholder = document.getElementById('avatarPreviewPlaceholder');
        
        if (!avatarPreview || !avatarPreviewPlaceholder) {
            return;
        }
        
        // 从本地存储获取用户头像
        const userAvatar = localStorage.getItem('userAvatar_' + this.user.username);
        
        if (userAvatar) {
            // 显示头像图片
            avatarPreview.src = userAvatar;
            avatarPreview.style.display = 'block';
            avatarPreviewPlaceholder.style.display = 'none';
            
            // 更新顶部头像
            this.updateTopAvatar(userAvatar);
        } else {
            // 显示默认头像
            avatarPreview.style.display = 'none';
            avatarPreviewPlaceholder.style.display = 'block';
            
            // 更新顶部头像为默认头像
            this.updateTopAvatar();
        }
    }
    
    // 初始化头像事件监听器
    initAvatarEventListeners() {
        // 选择头像按钮
        const selectAvatarBtn = document.getElementById('selectAvatarBtn');
        const avatarUpload = document.getElementById('avatarUpload');
        
        if (selectAvatarBtn && avatarUpload) {
            // 移除旧的事件监听器
            selectAvatarBtn.removeEventListener('click', this.handleSelectAvatarClick);
            avatarUpload.removeEventListener('change', this.handleAvatarChange);
            
            // 添加新的事件监听器
            this.handleSelectAvatarClick = () => {
                avatarUpload.click();
            };
            
            this.handleAvatarChange = (e) => {
                this.handleAvatarUpload(e);
            };
            
            selectAvatarBtn.addEventListener('click', this.handleSelectAvatarClick);
            avatarUpload.addEventListener('change', this.handleAvatarChange);
        }
        
        // 保存头像按钮
        const saveAvatarBtn = document.getElementById('saveAvatarBtn');
        if (saveAvatarBtn) {
            saveAvatarBtn.removeEventListener('click', this.handleSaveAvatarClick);
            this.handleSaveAvatarClick = () => {
                this.saveAvatar();
            };
            saveAvatarBtn.addEventListener('click', this.handleSaveAvatarClick);
        }
        
        // 移除头像按钮
        const removeAvatarBtn = document.getElementById('removeAvatarBtn');
        if (removeAvatarBtn) {
            removeAvatarBtn.removeEventListener('click', this.handleRemoveAvatarClick);
            this.handleRemoveAvatarClick = () => {
                this.removeAvatar();
            };
            removeAvatarBtn.addEventListener('click', this.handleRemoveAvatarClick);
        }
    }
    
    // 处理选择头像按钮点击
    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件！');
            return;
        }
        
        // 读取文件
        const reader = new FileReader();
        reader.onload = (event) => {
            const avatarPreview = document.getElementById('avatarPreview');
            const avatarPreviewPlaceholder = document.getElementById('avatarPreviewPlaceholder');
            
            if (avatarPreview && avatarPreviewPlaceholder) {
                // 显示预览
                avatarPreview.src = event.target.result;
                avatarPreview.style.display = 'block';
                avatarPreviewPlaceholder.style.display = 'none';
            }
        };
        
        reader.readAsDataURL(file);
    }
    
    // 保存头像
    saveAvatar() {
        const avatarPreview = document.getElementById('avatarPreview');
        if (!avatarPreview || !avatarPreview.src) {
            alert('请先选择头像！');
            return;
        }
        
        // 保存头像到本地存储
        const avatarData = avatarPreview.src;
        localStorage.setItem('userAvatar_' + this.user.username, avatarData);
        
        // 更新顶部头像
        this.updateTopAvatar(avatarData);
        
        // 关闭模态框
        closeModal();
        
        alert('头像保存成功！');
    }
    
    // 移除头像
    removeAvatar() {
        // 移除本地存储中的头像
        localStorage.removeItem('userAvatar_' + this.user.username);
        
        // 重置预览
        const avatarPreview = document.getElementById('avatarPreview');
        const avatarPreviewPlaceholder = document.getElementById('avatarPreviewPlaceholder');
        
        if (avatarPreview && avatarPreviewPlaceholder) {
            avatarPreview.style.display = 'none';
            avatarPreviewPlaceholder.style.display = 'block';
        }
        
        // 更新顶部头像为默认头像
        this.updateTopAvatar();
        
        alert('头像已移除！');
    }
    
    // 更新顶部头像
    updateTopAvatar(avatarData = '') {
        const avatarIcon = document.querySelector('.avatar-icon');
        if (!avatarIcon) {
            return;
        }
        
        // 如果有头像数据，使用图片作为背景
        if (avatarData) {
            avatarIcon.innerHTML = '';
            avatarIcon.style.backgroundImage = `url('${avatarData}')`;
            avatarIcon.style.backgroundSize = 'cover';
            avatarIcon.style.backgroundPosition = 'center';
        } else {
            // 使用默认头像
            avatarIcon.innerHTML = '👤';
            avatarIcon.style.backgroundImage = '';
            avatarIcon.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
        }
    }
    
    // 查看资料
    viewProfile() {
        // 这里可以实现查看用户资料的功能
        alert(`欢迎，${this.user.username}！`);
    }
    
    // 初始化模态框功能
    initModals() {
        // 关闭付费页面
        document.getElementById('closePremiumPage').addEventListener('click', () => {
            this.closePremiumPage();
        });
        
        // 关闭评论页面
        document.getElementById('closeCommentsPage').addEventListener('click', () => {
            this.closeCommentsPage();
        });
    }
    
    // 显示认证模态框
    showAuthModal(type) {
        const modal = document.getElementById('authModal');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const modalTitle = document.getElementById('authModalTitle');
        
        if (type === 'login') {
            modalTitle.textContent = '登录';
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            modalTitle.textContent = '注册';
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
        
        modal.style.display = 'flex';
    }
    
    // 关闭模态框
    closeModal() {
        // 调用全局的closeModal函数，确保所有模态框都被关闭
        window.closeModal();
    }
    
    // 打开付费页面
    openPremiumPage() {
        document.getElementById('premiumPage').style.display = 'flex';
    }
    
    // 关闭付费页面
    closePremiumPage() {
        document.getElementById('premiumPage').style.display = 'none';
    }
    
    // 打开评论页面
    openCommentsPage() {
        document.getElementById('commentsPage').style.display = 'flex';
    }
    
    // 关闭评论页面
    closeCommentsPage() {
        document.getElementById('commentsPage').style.display = 'none';
    }
    
    // 登录功能
    login() {
        // 获取登录表单元素
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) {
            console.error('登录表单元素未找到！');
            return;
        }
        
        // 确保登录表单是可见的
        if (loginForm.style.display === 'none') {
            console.error('登录表单不可见！');
            return;
        }
        
        // 获取登录表单的输入值 - 使用更具体的选择器
        const username = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        
        console.log('登录信息:', { username, password });
        
        // 简单的登录验证（实际项目中应使用后端API）
        if (username && password) {
            // 从本地存储获取用户数据
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[username] && users[username].password === password) {
                // 登录成功
                this.user = {
                    isLoggedIn: true,
                    username: username,
                    remainingUses: users[username].remainingUses,
                    isPremium: users[username].isPremium,
                    defaultOutputSize: users[username].defaultOutputSize || '4K (3840×2160)'
                };
                
                this.saveUserData();
                this.updateUI();
                this.updateUsageDisplay();
                closeModal();
                alert('登录成功！');
            } else {
                alert('用户名或密码错误！');
            }
        } else {
            alert('请输入用户名和密码！');
        }
    }
    
    // 注册功能
    register() {
        // 获取注册表单元素
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) {
            console.error('注册表单元素未找到！');
            return;
        }
        
        // 确保注册表单是可见的
        if (registerForm.style.display === 'none') {
            console.error('注册表单不可见！');
            return;
        }
        
        // 获取注册表单的输入值 - 使用更具体的选择器
        const username = registerForm.querySelector('input[type="text"]').value;
        const passwordInputs = registerForm.querySelectorAll('input[type="password"]');
        const password = passwordInputs[0] ? passwordInputs[0].value : '';
        const confirmPassword = passwordInputs[1] ? passwordInputs[1].value : '';
        
        console.log('注册信息:', { username, password, confirmPassword });
        
        // 简单的注册验证（实际项目中应使用后端API）
        if (username && password && password === confirmPassword) {
            // 从本地存储获取用户数据
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[username]) {
                alert('用户名已存在！');
            } else {
                // 注册成功，赠送50次使用次数，默认导出4K
                users[username] = {
                    password: password,
                    remainingUses: 50,
                    isPremium: false,
                    defaultOutputSize: '4K (3840×2160)'
                };
                
                localStorage.setItem('users', JSON.stringify(users));
                
                // 自动登录
                this.user = {
                    isLoggedIn: true,
                    username: username,
                    remainingUses: 50,
                    isPremium: false,
                    defaultOutputSize: '4K (3840×2160)'
                };
                
                this.saveUserData();
                this.updateUI();
                this.updateUsageDisplay();
                closeModal();
                alert('注册成功！赠送50次使用次数，导出默认4K分辨率！');
            }
        } else if (password !== confirmPassword) {
            alert('两次输入的密码不一致！');
        } else {
            alert('请输入完整的注册信息！');
        }
    }
    
    // 退出登录
    logout() {
        this.user = {
            isLoggedIn: false,
            username: '',
            remainingUses: 0,
            isPremium: false
        };
        
        this.saveUserData();
        this.updateUI();
        this.updateUsageDisplay();
        alert('已退出登录！');
    }
    
    // 加载用户数据
    loadUserData() {
        // 从本地存储加载用户数据
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.updateUI();
        }
    }
    
    // 保存用户数据
    saveUserData() {
        localStorage.setItem('currentUser', JSON.stringify(this.user));
    }
    
    // 更新用户界面
    updateUI() {
        // 更新登录/注册/退出按钮
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const premiumPageBtn = document.getElementById('premiumPageBtn');
        const userAvatar = document.getElementById('userAvatar');
        
        if (this.user.isLoggedIn) {
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'none';
            logoutBtn.style.display = 'none'; // 隐藏原有的退出按钮，使用头像下拉菜单中的退出
            userAvatar.style.display = 'block'; // 显示用户头像
            premiumPageBtn.style.display = 'inline-block';
            
            // 显示剩余次数
            this.showRemainingUses();
            
            // 从本地存储加载并显示用户头像
            const savedAvatar = localStorage.getItem('userAvatar_' + this.user.username);
            this.updateTopAvatar(savedAvatar);
        } else {
            loginBtn.style.display = 'inline-block';
            registerBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            userAvatar.style.display = 'none'; // 隐藏用户头像
            premiumPageBtn.style.display = 'inline-block';
            
            // 隐藏剩余次数
            this.hideRemainingUses();
        }
    }
    
    // 显示剩余次数
    showRemainingUses() {
        // 检查是否已有次数显示元素
        let usesDisplay = document.getElementById('remainingUses');
        if (!usesDisplay) {
            usesDisplay = document.createElement('div');
            usesDisplay.id = 'remainingUses';
            usesDisplay.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(102, 126, 234, 0.9);
                color: white;
                padding: 0.8rem 1.5rem;
                border-radius: 25px;
                font-weight: bold;
                z-index: 1500;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            `;
            document.body.appendChild(usesDisplay);
        }
        
        let usesText = '';
        if (this.user.isLoggedIn) {
            // 登录用户
            if (this.user.isPremium) {
                usesText = '会员用户：无限次使用';
            } else {
                usesText = `剩余使用次数：${this.user.remainingUses}次`;
            }
        } else {
            // 未登录用户
            const guestUses = parseInt(localStorage.getItem('guestUses') || '0', 10);
            const remaining = Math.max(0, 50 - guestUses);
            usesText = `剩余使用次数：${remaining}次`;
        }
        
        usesDisplay.textContent = usesText;
    }
    
    // 隐藏剩余次数
    hideRemainingUses() {
        const usesDisplay = document.getElementById('remainingUses');
        if (usesDisplay) {
            usesDisplay.remove();
        }
    }
    
    // 检查是否可以使用增强功能
    canUseEnhance() {
        // 允许未登录用户使用50次免费次数
        if (!this.user.isLoggedIn) {
            // 检查未登录用户的使用次数
            let guestUses = parseInt(localStorage.getItem('guestUses') || '0');
            if (guestUses >= 50) {
                alert('您的免费使用次数已用完，请登录或注册继续使用！');
                this.showAuthModal('login');
                return false;
            }
            return true;
        }
        
        if (!this.user.isPremium && this.user.remainingUses <= 0) {
            alert('您的免费使用次数已用完，请开通会员继续使用！');
            this.openPremiumPage();
            return false;
        }
        
        return true;
    }
    
    // 减少使用次数
    decreaseUses() {
        if (this.user.isLoggedIn) {
            if (!this.user.isPremium) {
                this.user.remainingUses--;
                this.saveUserData();
                this.showRemainingUses();
                
                // 更新本地存储中的用户数据
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                if (users[this.user.username]) {
                    users[this.user.username].remainingUses = this.user.remainingUses;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }
        } else {
            // 未登录用户使用次数统计
            let guestUses = parseInt(localStorage.getItem('guestUses') || '0');
            guestUses++;
            localStorage.setItem('guestUses', guestUses.toString());
        }
        
        // 更新次数显示
        this.updateUsageDisplay();
    }
    
    // 设置默认输出尺寸为4K（注册用户）
    setDefaultOutputSize() {
        if (this.user.isLoggedIn && this.user.defaultOutputSize) {
            const outputSizeSelect = document.getElementById('outputSize');
            if (outputSizeSelect) {
                outputSizeSelect.value = this.user.defaultOutputSize;
            }
        }
    }
    
    // 初始化导航功能
    initNavigation() {
        // 处理导航链接点击事件
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // 如果是锚点链接
                if (href.startsWith('#')) {
                    e.preventDefault();
                    
                    // 移除所有导航链接的active类
                    navLinks.forEach(l => l.classList.remove('active'));
                    // 添加当前链接的active类
                    link.classList.add('active');
                    
                    // 获取目标元素
                    const targetId = href.substring(1);
                    
                    if (targetId === '') {
                        // 回到顶部
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    } else if (targetId === 'photo' || targetId === 'video') {
                        // 切换到对应的功能标签页
                        const navBtn = document.querySelector(`.nav-btn[data-tab="${targetId}"]`);
                        if (navBtn) {
                            navBtn.click();
                            
                            // 滚动到功能区域
                            const functionSection = document.querySelector('.功能-section');
                            if (functionSection) {
                                functionSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    } else if (targetId === 'pricing') {
                        // 显示付费页面
                        const premiumPage = document.getElementById('premiumPage');
                        if (premiumPage) {
                            premiumPage.style.display = 'flex';
                        }
                    } else {
                        // 滚动到对应的页面部分
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        });
    }
}

// 微信支付功能
function openWeChatPay(amount) {
    // 更新支付金额
    document.getElementById('payAmount').textContent = amount;
    
    // 显示支付模态框
    document.getElementById('wechatPayModal').style.display = 'flex';
}

// 关闭模态框
function closeModal() {
    // 关闭所有模态框
    document.getElementById('wechatPayModal').style.display = 'none';
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('premiumPage').style.display = 'none';
    document.getElementById('commentsPage').style.display = 'none';
    document.getElementById('photoPreviewModal').style.display = 'none';
    // 关闭编辑头像模态框
    const editAvatarModal = document.getElementById('editAvatarModal');
    if (editAvatarModal) {
        editAvatarModal.style.display = 'none';
    }
}

// 确保付费页面关闭按钮正常工作
document.addEventListener('DOMContentLoaded', () => {
    // 为付费页面关闭按钮添加额外的事件监听器
    const closePremiumBtn = document.getElementById('closePremiumPage');
    if (closePremiumBtn) {
        // 移除可能存在的旧事件监听器
        closePremiumBtn.removeEventListener('click', closeModal);
        // 添加新的事件监听器
        closePremiumBtn.addEventListener('click', () => {
            console.log('Closing premium page...');
            document.getElementById('premiumPage').style.display = 'none';
        });
    }
});

// 登录/注册表单切换功能
function showLoginForm() {
    document.getElementById('authModalTitle').textContent = '登录';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('authModalTitle').textContent = '注册';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal, .premium-page, .comments-page');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 保存应用实例到全局变量
    window.enhanceApp = new EnhanceApp();
    
    // 为所有关闭按钮添加事件监听器
    // 登录/注册模态框关闭按钮
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 付费页面关闭按钮
    const closePremiumBtn = document.getElementById('closePremiumPage');
    if (closePremiumBtn) {
        closePremiumBtn.addEventListener('click', closeModal);
    }
    
    // 评论页面关闭按钮
    const closeCommentsBtn = document.getElementById('closeCommentsPage');
    if (closeCommentsBtn) {
        closeCommentsBtn.addEventListener('click', closeModal);
    }
    
    // 确保认证表单的提交事件能正确处理
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (document.getElementById('loginForm').style.display !== 'none') {
                window.enhanceApp.login();
            } else {
                window.enhanceApp.register();
            }
        });
    }
});