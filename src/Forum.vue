<template>
  <div class="forum-container">
    
      <div class="search-section">
        <div class="search-container">
          <div class="searchs-boxs">
            <svg class="search-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
            <input 
              type="text" 
              placeholder="搜索帖子、问题或关键词..." 
              v-model="searchQuery" 
              @keyup.enter="searchPosts"
            >
            <button 
              v-if="searchQuery" 
              class="clear-search-btn" 
              @click="clearSearch"
              type="button"
              title="清除搜索"
            >
              <span class="clear-text">清除</span>
            </button>
            <button class="search-button" @click="searchPosts">
              <span>搜索</span>
            </button>
          </div>
        </div>
      </div>
    

    <!-- 横幅 -->
    <div class="decorative-banner">
      <div class="pet-paws">
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
        <span>🐾</span>
      </div>
    </div>
    
    <!-- 主头部区域 -->
    <div class="header-main"style="justify-content: center;">
      <!-- 左侧宠物图标 -->
      <div class="header-pets">
        <div class="floating-pet cat">
          <span>🐱</span>
        </div>
        <div class="floating-pet dog">
          <span>🐶</span>
        </div>
        <div class="floating-pet rabbit">
          <span>🐰</span>
        </div>
      </div>
      
      <!-- 中间标题区域 -->
      <div class="header-center">
        <h1 class="forum-title" style = "font-size: 70px;">宠物交流社区</h1>
        <p class="forum-subtitle" style = "font-size: 18px;">分享经验 · 获取专业建议 · 共同关爱宠物健康</p>
      </div>
      
      <!-- 右侧宠物图标 -->
      <div class="header-pets">
        <div class="floating-pet bird">
          <span>🐦</span>
        </div>
        <div class="floating-pet fish">
          <span>🐠</span>
        </div>
        <div class="floating-pet hamster">
          <span>🐹</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 左侧分类标签 -->
        <div class="left-sidebar">
          <div class="category-tags">
            <h3 class="sidebar-title">
              <svg viewBox="0 0 24 24" class="sidebar-icon">
                <path fill="currentColor" d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z" />
              </svg>
              分类标签
            </h3>
            <div class="tags-container">
              <span 
                v-for="tag in tags" 
                :key="tag.id" 
                :class="{ active: currentTag === tag.id }"
                @click="selectTag(tag.id)"
              >
                <img :src="tag.icon" :alt="tag.name" class="tag-icon">
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="right-content">
          <!-- 快速入口按钮 -->
          <div class="quick-actions">
            <button class="action-btn new-post" @click="newPost">
              <svg viewBox="0 0 24 24" class="action-icon">
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              <span>我要发帖</span>
            </button>
          </div>

          <div v-if="isLoading" class="loading-indicator">
            <div class="spinner"></div>
            <span>加载中...</span>
          </div>

          <!-- 帖子列表 -->
          <div class="post-list" >
             
              <div v-if="paginatedPosts.length === 0 && !isLoading" class="empty-state">
                <svg viewBox="0 0 24 24" class="empty-icon">
                  <path fill="#9CA3AF" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                </svg>
                <p>暂无帖子数据</p>
              </div>
              <div class="post-item" 
                v-for="post in paginatedPosts" :key="post.id" 
                @click="viewPost(post.postId || post.id)"
              >
              <div class="post-thumbnail" v-if="post.thumbnail">
                <img :src="post.thumbnail" :alt="post.title">
              </div>
              <div class="post-content">
                <div class="post-header">
                    <span class="post-title">{{ post.title || post.content.substring(0, 20) + (post.content.length > 50 ? '...' : '') }}</span>
                  <div class="post-tags right-aligned" v-if="post.tags && post.tags.length > 0">
                    <span
                      v-for="tag in post.tags.split(',')"
                      :key="tag"
                      :style="{ backgroundColor: getTagColor(tag.trim()), color: '#fff', borderRadius: '10px' }"
                    >
                      {{ tag.trim() }}
                    </span>
                  </div>
                </div>
                <div class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</div>
                <div class="post-meta">
                  <span class="post-author">
                    <div v-if="post.authorAvatar" class="author-avatar">
                      <img :src="post.authorAvatar" alt="头像">
                    </div>
                    <div v-else class="text-avatar">
                      {{ post.author.slice(0, 2).toUpperCase() }}
                    </div>
                    {{ post.author }}
                  </span>
                  <span class="post-time">{{ formatTime(post.time) }}</span>
                  <span class="post-views">
                    <svg viewBox="0 0 24 24" class="meta-icon">
                      <path fill="#3B82F6" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
                    </svg>
                    {{ post.views }}
                  </span>
                  <span class="post-comments">
                    <svg viewBox="0 0 24 24" class="meta-icon">
                      <path fill="#EC4899" d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
                    </svg>
                    {{ post.comments }}
                    
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页信息显示 -->
          <div class="pagination-container">
            <div class="pagination-info">
              显示 {{ (currentPage - 1) * postsPerPage + 1 }}-{{ Math.min(currentPage * postsPerPage, totalPosts) }} 条，
              共 {{ totalPosts }} 条帖子
              <span v-if="searchQuery.trim()">(搜索结果)</span>
              <span v-else-if="currentTag !== 'all'">(标签筛选结果)</span>
            </div>
            
            <div class="pagination">
              <button 
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="page-btn"
              >
                &laquo; 上一页
              </button>
              
              <button 
                v-for="(page, index) in displayedPages" 
                :key="index" 
                :class="{ 
                  'page-btn': true, 
                  'active': currentPage === page,
                  'ellipsis': page === '...'
                }"
                @click="page !== '...' ? changePage(page) : null"
                :disabled="page === '...'"
              >
                {{ page }}
              </button>
              
              <button 
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="page-btn"
              >
                下一页 &raquo;
              </button>
            </div>
            
            <!-- 跳转页面功能 -->
            <div class="page-jump" v-if="totalPages > 1">
              <span>跳至</span>
              <input 
                type="number" 
                v-model.number="gotoPage" 
                :min="1" 
                :max="totalPages"
                @keyup.enter="gotoSpecificPage"
              >
              <span>页</span>
              <button @click="gotoSpecificPage">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 帖子详情模态框 -->
    <div class="post-detail-overlay" v-if="showPostDetail">
      <div class="post-detail-modal">
        <span class="close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </span>
        
        <h2 class="post-detail-title">{{ currentPost.title }}</h2>
        <div class="post-detail-meta">
          <span class="author-info">
            <div v-if="currentPost.authorAvatar" class="author-avatar">
              <img :src="currentPost.authorAvatar" alt="头像">
            </div>
            <div v-else class="text-avatar">
              {{ currentPost.author.slice(0, 2).toUpperCase() }}
            </div>
            <span class="author-name">{{ currentPost.author }}</span>
          </span>
          <span class="post-time">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path fill="#10B981" d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z" />
            </svg>
            {{ currentPost.time }}
          </span>
          <span class="post-views">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path fill="#3B82F6" d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" />
            </svg>
            {{ currentPost.views }}
          </span>
        </div>
        
       
        <div class="post-detail-content">
          <!-- 图片轮播区域 -->
          <div class="post-images-carousel" v-if="currentPost.images && currentPost.images.length > 0">
            <div class="carousel-container" 
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
                @mouseup="handleMouseEnd"
                @mouseleave="handleMouseEnd">
              <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div class="carousel-slide" v-for="(image, index) in currentPost.images" :key="index">
                  <img :src="image.url" :alt="'图片' + (index + 1)" @click="showImagePreview(image.url)">
                </div>
              </div>
              
              <!-- 导航箭头 -->
              <button class="carousel-btn prev" @click="prevSlide" :disabled="currentSlide === 0">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z" />
                </svg>
              </button>
              <button class="carousel-btn next" @click="nextSlide" :disabled="currentSlide === currentPost.images.length - 1">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                </svg>
              </button>
              
              <!-- 指示器 -->
              <div class="carousel-dots" v-if="currentPost.images.length > 1">
                <span v-for="(image, index) in currentPost.images" 
                      :key="index" 
                      :class="{ active: index === currentSlide }"
                      @click="goToSlide(index)"></span>
              </div>
            </div>
          </div>
          
          <!-- 单张图片显示 -->
          <div class="post-image" v-else-if="currentPost.images && currentPost.images.length === 1">
            <img :src="currentPost.images[0].url" :alt="currentPost.title" @click="showImagePreview(currentPost.images[0].url)">
          </div>
          
          <!-- 帖子内容文本 -->
          <div class="post-text-content" v-if="currentPost.content">
            <p v-for="(paragraph, index) in currentPost.content.split('\n')" :key="index">{{ paragraph }}</p>
          </div>
        </div>
        
        <div class="post-actions">
          <button @click="likePost($event)" :class="{ liked: currentPost.isLiked }">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path fill="currentColor" :d="currentPost.isLiked ? 'M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z' : 'M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z'" />
            </svg>
            <span>点赞 ({{ currentPost.likes }})</span>
          </button>
          <button @click="collectPost($event)" :class="{ collected: currentPost.isCollected }">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path fill="currentColor" :d="currentPost.isCollected ? 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z' : 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z'" />
            </svg>
            <span>收藏 ({{ currentPost.collections }})</span>
          </button>
          <button v-if="canDeletePost" @click="confirmDeletePost" class="deletes-btns">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
            <span>删除帖子</span>
          </button>
        </div>
        
        <div class="comment-section">
          <h3>
            <svg viewBox="0 0 24 24" class="section-icon">
              <path fill="#EC4899" d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15M9,9H19V11H9V9M9,13H17V15H9V13Z" />
            </svg>
            评论 ({{ currentPost.comments }})
          </h3>
          
          <!-- 评论输入框 -->
          <div class="comment-input">
            <textarea 
              v-model="newComment" 
              placeholder="写下你的评论..."
              @keyup.enter="submitComment"
              v-auto-resize
              rows="1"
            ></textarea>
            
            <div class="comment-input-footer">
              <div class="upload-area">
                <input 
                  type="file" 
                  ref="commentFileInput" 
                  accept="image/*" 
                  @change="handleCommentImageUpload" 
                  style="display: none"
                  multiple
                >
                <button class="comment-upload-btn" @click="$refs.commentFileInput.click()">
                  <svg viewBox="0 0 24 24" class="upload-icon">
                    <path fill="#3B82F6" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,15V13H16V15H8M8,11V9H16V11H8Z" />
                  </svg>
                  <span>上传图片</span>
                </button>
                <div class="preview-images" v-if="commentImages.length > 0">
                  <div class="image-preview" v-for="(image, index) in commentImages" :key="index">
                    <img :src="image.preview" alt="预览">
                    <span class="remove-image" @click.stop="removeCommentImage(index)">×</span>
                  </div>
                </div>
              </div>
              
              <button class="comment-submit-btn" @click="submitComment">
                <svg viewBox="0 0 24 24" class="submit-icon">
                  <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
                <span>提交评论</span>
              </button>
            </div>
          </div>
          
          <!-- 评论列表 -->
          <div class="comment-list">
              <div 
                class="comment-item" 
                v-for="comment in flatComments" 
                :key="comment.id"
                :class="{ 
                  'is-reply': comment.parentId,
                  'self-reply': comment.isSelfReply
                }"
                :style="{ marginLeft: comment.depth * 20 + 'px' }"
              >

              <div class="comment-header">
                <div v-if="comment.authorAvatar" class="comment-avatar">
                  <img :src="comment.authorAvatar" alt="头像">
                </div>
                <div v-else class="text-avatar" style="width: 36px; height: 36px; font-size: 12px;">
                  {{ comment.username.slice(0, 2).toUpperCase() }}
                </div>
                <div class="comment-author-info">
                  <span class="comment-author">{{ comment.username }}</span>
                  <span class="comment-time">{{ comment.commentTime }}</span>
                </div>
              </div>



              <div class="comment-content">
                <template v-if="comment.parentId">
                  回复 <span class="reply-to">@{{ getCommentAuthor(comment.parentId) }}</span>: 
                </template>
                {{ comment.content }}
              </div>

             <!-- 评论循环中 -->
              <div class="comment-images" v-if="comment.imageList && comment.imageList.length">
                <img
                  v-for="(img, idx) in comment.imageList"
                  :key="idx"
                  :src="img"
                  class="comment-image"
                  @click="showImagePreview(img)"
                />
              </div>
              <div class="comment-actions">
                <button 
                  class="like-btn" 
                  @click.stop="toggleLike(comment, $event)" 
                  :class="{ liked: comment.isLiked }"
                >
                  <svg viewBox="0 0 24 24" class="action-icon">
                      <path fill="currentColor" :d="comment.isLiked ? 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' : 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'" />
                    </svg>
                    <span>{{ comment.likes }}</span>
                  </button>
                
                <button class="reply-btn" @click.stop="openReplyDialog(comment)">
                  <svg viewBox="0 0 24 24" class="reply-icon">
                    <path fill="#10B981" d="M10,9V5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9Z" />
                  </svg>
                  <span>回复</span>
                </button>

                <!-- 删除评论 -->
                  <button 
                    v-if="canDeleteComment(comment)" 
                    @click.stop="confirmDeleteComment(comment)" 
                    class="deletes-btns"
                  >
                    <svg viewBox="0 0 24 24" class="action-icon">
                      <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                    <span>删除</span>
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 回复弹窗 -->
    <div class="reply-overlay" v-if="showReplyDialog" @click.self="closeReplyDialog">
      <div class="reply-modal">
        <span class="close-btn" @click="closeReplyDialog">&times;</span>
        <h4>回复 {{ replyingTo.author }}</h4>
         <textarea 
            v-model="replyContent" 
            placeholder="写下你的回复..."
            ref="replyTextarea"
            v-auto-resize
            rows="1"
          ></textarea>

        <div class="upload-area">
          <input 
            type="file" 
            ref="replyFileInput" 
            accept="image/*" 
            @change="handleReplyImageUpload" 
            style="display: none"
            multiple
          >
          <button class="reply-upload-btn" @click="$refs.replyFileInput.click()">
            <svg viewBox="0 0 24 24" class="upload-icon">
              <path fill="#3B82F6" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,15V13H16V15H8M8,11V9H16V11H8Z" />
            </svg>
            <span>上传图片</span>
          </button>
          <div class="preview-images" v-if="replyImages.length > 0">
            <div class="image-preview" v-for="(image, index) in replyImages" :key="index">
              <img :src="image.preview" alt="预览">
              <span class="remove-image" @click.stop="removeReplyImage(index)">×</span>
            </div>
          </div>
        </div>

        <div class="reply-actions">
          <button class="cancel-btn" @click="closeReplyDialog">取消</button>
          <button class="reply-submit-btn" @click="submitReply">
            <svg viewBox="0 0 24 24" class="submit-icon">
              <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
            <span>提交回复</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div class="image-preview-overlay" v-if="showImagePreviewModal" @click.self="closeImagePreview">
      <div class="image-preview-modal">
        <span class="close-btn" @click="closeImagePreview">&times;</span>
        <img :src="currentPreviewImage" alt="图片预览">
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div class="delete-confirm-overlay" v-if="showDeleteConfirm" @click.self="cancelDelete">
      <div class="delete-confirm-modal">
        <div class="delete-icon">
          <svg viewBox="0 0 24 24">
            <path fill="#EF4444" d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M17,15.59L15.59,17L12,13.41L8.41,17L7,15.59L10.59,12L7,8.41L8.41,7L12,10.59L15.59,7L17,8.41L13.41,12L17,15.59Z"/>
          </svg>
        </div>
        <h3>确认删除</h3>
        <p>{{ deleteConfirmMessage }}</p>
        <div class="delete-actions">
          <button class="cancel-btn" @click="cancelDelete">取消</button>
          <button class="confirm-delete-btn" @click="confirmDelete">确认删除</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 发布帖子模态框 -->
  <div class="post-overlay" v-if="showNewPostModal" @click.self="closeNewPostModal">
    <div class="post-modal">
      <span class="close-btn" @click="closeNewPostModal">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </span>
      
      <div class="modal-heade">
        <h2 class="modal-title">分享你的宠物故事</h2>
        <p class="modal-subtitle">与社区分享你的经验、问题或可爱瞬间</p>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="post-title">
            <svg viewBox="0 0 24 24" class="label-icon">
              <path fill="#FF7043" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
            </svg>
            标题（可选）
          </label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="post-title" 
              v-model="newPostTitle" 
              placeholder="为你的帖子起个吸引人的标题..." 
              maxlength="100"
            >
            <span class="char-counter">{{ newPostTitle.length }}/100</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="post-content">
            <svg viewBox="0 0 24 24" class="label-icon">
              <path fill="#5C6BC0" d="M12,3L2,12H5V20H19V12H22L12,3M12,7.7L16,11.2V18H8V11.2L12,7.7M12,8.8L9,11.5H15L12,8.8M12,14.5C12.8,14.5 13.5,13.8 13.5,13C13.5,12.2 12.8,11.5 12,11.5C11.2,11.5 10.5,12.2 10.5,13C10.5,13.8 11.2,14.5 12,14.5Z" />
            </svg>
            内容
          </label>
          <textarea 
            id="post-content" 
            v-model="newPostContent" 
            placeholder="详细描述你的问题或分享经验..."
            rows="6"
            v-auto-resize
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>
            <svg viewBox="0 0 24 24" class="label-icon">
              <path fill="#66BB6A" d="M5.5,7A1.5,1.5 0 0,1 4,5.5A1.5,1.5 0 0,1 5.5,4A1.5,1.5 0 0,1 7,5.5A1.5,1.5 0 0,1 5.5,7M21.41,11.58L12.41,2.58C12.05,2.22 11.55,2 11,2H4C2.89,2 2,2.89 2,4V11C2,11.55 2.22,12.05 2.59,12.41L11.58,21.41C11.95,21.77 12.45,22 13,22C13.55,22 14.05,21.77 14.41,21.41L21.41,14.41C21.78,14.05 22,13.55 22,13C22,12.44 21.77,11.94 21.41,11.58Z" />
            </svg>
            选择标签（可多选）
          </label>
          <div class="tag-selector">
            <span 
              v-for="tag in tags.filter(t => t.id !== 'all')" 
              :key="tag.id"
              :class="{ active: newPostSelectedTag.includes(tag.id) }"
              @click="toggleTagSelection(tag.id)"
            >
              <img :src="tag.icon" :alt="tag.name" class="tag-icon">
              {{ tag.name }}
            </span>
          </div>
        </div>
        
        <div class="form-group">
          <label>
            <svg viewBox="0 0 24 24" class="label-icon">
              <path fill="#FFA726" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z" />
            </svg>
            上传图片
          </label>
          <div class="upload-area">
            <input 
              type="file" 
              ref="postFileInput" 
              accept="image/*" 
              @change="handlePostImageUpload" 
              style="display: none"
              multiple
            >
            <button class="post-upload-btn" @click="$refs.postFileInput.click()">
              <svg viewBox="0 0 24 24" class="upload-icon">
                <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M8,15V13H16V15H8M8,11V9H16V11H8Z" />
              </svg>
              <span>选择图片 (最多5张)</span>
            </button>
            <div class="preview-images" v-if="newPostImages.length > 0">
              <div class="image-preview" v-for="(image, index) in newPostImages" :key="index">
                <img :src="image.preview" alt="预览">
                <span class="remove-image" @click.stop="removePostImage(index)">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button class="cancel-btn" @click="closeNewPostModal">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
          取消
        </button>
        <button class="post-submit-btn" @click="submitNewPost" :disabled="!canSubmitPost">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19H5V5H12V3H5M17.78,4C17.61,4 17.43,4.07 17.3,4.2L16.08,5.41L18.58,7.91L19.8,6.7C20.06,6.44 20.06,6 19.8,5.75L18.25,4.2C18.12,4.07 17.95,4 17.78,4M15.37,6.12L8,13.5V16H10.5L17.87,8.62L15.37,6.12Z" />
          </svg>
          发布帖子
        </button>
      </div>
    </div>
    
  </div>
</template>

<script>
import { addPost, uploadImages } from '@/api/post';
import { getPostsByPage, getPostNum } from '@/api/post';
import { addComment, getComments,updatePostStats,getFullImageUrl} from '@/api/post';
import { deleteImage } from '@/api/post';
import { deletePost, deleteComment ,updateCommentLikes} from '@/api/post';
import { checkCommentStatus, checkPostStatus } from './api/post';
import { ref, onMounted } from 'vue'


export default {
  name: 'ForumHeader',
  setup() {
    const currentUserId = ref(null);
    const currentUsername = ref('');
    const isManager = ref(false);

    onMounted(() => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUserId.value = user.userId || 1;
      currentUsername.value = user.username || '游客';
      isManager.value = user.isManager || false;
    });

    return {
      currentUserId,
      currentUsername,
      isManager
    };
  },

  directives: {
    autoResize: {
      inserted(el) {
        const resize = () => {
          el.style.height = 'auto'
          el.style.height = el.scrollHeight + 'px'
        }
        el.addEventListener('input', resize)
        resize()
      }
    }
  },
  data() {
    return {

      isManager: false,

      gotoPage: null,
      searchQuery: '',
      imageList: [] ,
      //图片滑动
      touchStartX: null,
      touchStartY: null,
      isSwiping: false,
      swipeDistance: 0,
      currentSlide: 0,

      currentUserId: null,
      currentUsername: '',
      currentTag: 'all',
      postsPerPage: 10, // 每页显示的帖子数量
      currentPage: 1,
      //totalPosts: 0,
      totalPostsFromAPI: 0,
      isLoading: false,

      //totalPages: 1,
      showNewPostModal: false,
      newPostTitle: '',
      newPostContent: '',
      newPostImages: [],
      newPostSelectedTag:[] ,

      currentSlide: 0,
      allPosts:[],

      defaultAvatar: '',
      searchQuery: '',
      isSearching: false,
      originalPosts: [],
      tags: [
        { id: 'all', 
          name: '全部', 
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzVFNThBQSIgZD0iTTEwIDRINHY2aDZWNnptMCA4SDR2Nmg2di02em04IDBoLTZ2Nmg2di02em0wLThoLTZ2Nmg2VjZ6Ii8+PC9zdmc+'
        },
        { id: 'dog', 
          name: '犬科', 
          icon:  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRkY5ODQyIiBkPSJNNDQ4IDI3MmgtNjR2LTY0aDY0djY0em0tOTYgMEgzNTJ2LTY0aDY0djY0em0tOTYgMEgyNTZ2LTY0aDY0djY0em0tOTYgMEgxNjB2LTY0aDY0djY0em0tOTYgMEg2NHYtNjRoNjR2NjR6TTAgMTI4aDUxMnYzMkgwdi0zMnoiLz48cGF0aCBmaWxsPSIjRTc0QzNEIiBkPSJNMzg0IDMyYzAtMTcuNy0xNC4zLTMyLTMyLTMyaC02NGMtMTcuNyAwLTMyIDE0LjMtMzIgMzJoLTY0YzAtMTcuNy0xNC4zLTMyLTMyLTMySDk2Qzc4LjMgMCA2NCAxNC4zIDY0IDMySDB2NjRoNTEyVjMySDM4NHoiLz48L3N2Zz4='
        },
        { id: 'cat', 
          name: '猫科',
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRkY3MEE3IiBkPSJNNDQ4IDI3MmgtNjR2LTY0aDY0djY0em0tOTYgMEgzNTJ2LTY0aDY0djY0em0tOTYgMEgyNTZ2LTY0aDY0djY0em0tOTYgMEgxNjB2LTY0aDY0djY0em0tOTYgMEg2NHYtNjRoNjR2NjR6TTAgMTI4aDUxMnYzMkgwdi0zMnoiLz48cGF0aCBmaWxsPSIjRkY0MjgxIiBkPSJNMzg0IDMyYzAtMTcuNy0xNC4zLTMyLTMyLTMyaC02NGMtMTcuNyAwLTMyIDE0LjMtMzIgMzJoLTY0YzAtMTcuNy0xNC4zLTMyLTMyLTMySDk2Qzc4LjMgMCA2NCAxNC4zIDY0IDMySDB2NjRoNTEyVjMySDM4NHoiLz48L3N2Zz4='
        },
        { id: 'prevention', 
          name: '疾病预防', 
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjMTBCOUE4MSIgZD0iTTQ2NCAyNTZjMCAxMTUtMTE1IDIwOC0yMDggMjA4UzQ4IDM3MSA0OCAyNTYgMTYzIDQ4IDI1NiA0OHMyMDggOTMgMjA4IDIwOHptLTM0LjEgMTkuOUwyODAgMjA4bDk2LTk2YzQuNy00LjcgNC43LTEyLjMgMC0xN2wtMTctMTdjLTQuNy00LjctMTIuMy00LjctMTcgMGwtOTYgOTYtOTYtOTZjLTQuNy00LjctMTIuMy00LjctMTcgMGwtMTcgMTdjLTQuNyA0LjctNC43IDEyLjMgMCAxN2w5NiA5Ni05NiA5NmMtNC43IDQuNy00LjcgMTIuMyAwIDE3bDE3IDE3YzQuNyA0LjcgMTIuMyA0LjcgMTcgMGw5Ni05NiA5NiA5NmM0LjcgNC43IDEyLjMgNC43IDE3IDBsMTctMTdjNC43LTQuNyA0LjctMTIuMyAwLTE3eiIvPjwvc3ZnPg=='
        },
        { id: 'treatment', 
          name: '治疗分享', 
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRjU5RTBCIiBkPSJNNDQ4IDMySDE2MGMtMzUuMyAwLTY0IDI4LjctNjQgNjR2MzJIMGMwIDE3LjcgMTQuMyAzMiAzMiAzMmgxMjh2MTI4YzAgMTcuNyAxNC4zIDMyIDMyIDMyaDMyYzE3LjcgMCAzMi0xNC4zIDMyLTMydi0xMjhoMTI4YzE3LjcgMCAzMi0xNC4zIDMyLTMyaC05NlY5NmMwLTM1LjMtMjguNy02NC02NC02NHoiLz48L3N2Zz4='
        },
        { id: 'nutrition', 
          name: '营养饮食', 
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjRkY5ODQyIiBkPSJNNDQ4IDI1NkMwIDI1NiAwIDExMiAwIDExMnMxNDQgMCAxNDQgMTQ0LTE0NCAxNDQtMTQ0IDE0NHoiLz48cGF0aCBmaWxsPSIjRkY3MEE3IiBkPSJNMTQ0IDI1NmMwIDExMi0xNDQgMTQ0LTE0NCAxNDRzMC0xNDQgMC0xNDQgMTQ0IDAgMTQ0IDE0NHoiLz48cGF0aCBmaWxsPSIjRkY0MjgxIiBkPSJNMTQ0IDI1NmMwLTc5LjUtNjQuNS0xNDQtMTQ0LTE0NHYxNDRjMCA3OS41IDY0LjUgMTQ0IDE0NCAxNDRzMTQ0LTY0LjUgMTQ0LTE0NEgyODh6Ii8+PC9zdmc+'
        },
        { id: 'behavior', 
          name: '行为问题', 
          icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjNjM2NkYxIiBkPSJNMjU2IDhDMTE5IDggOCAxMTkgOCAyNTZzMTExIDI0OCAyNDggMjQ4IDI0OC0xMTEgMjQ4LTI0OFMzOTMgOCAyNTYgOHptMCA0NDhjLTExMC41IDAtMjAwLTg5LjUtMjAwLTIwMFMxNDUuNSA1NiAyNTYgNTZzMjAwIDg5LjUgMjAwIDIwMC04OS41IDIwMC0yMDAgMjAwem0wLTEyOGMtMzUuMyAwLTY0IDI4LjctNjQgNjRoMTI4YzAtMzUuMy0yOC43LTY0LTY0LTY0em0tMzAuNS0yNGMtMTkuNi0xNy42LTMyLTQxLjYtMzItNjhoNjRjMCAyNi40LTEyLjQgNTAuNC0zMiA2OHoiLz48L3N2Zz4='
        }
      ],
      currentTag: 'all',
    
      
      showPostDetail: false,
      currentPost: {},
      comments: [
      {
        id: 1,
        author: '宠物家长A',
        authorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        content: '这篇文章很有帮助，我家狗狗上周刚做完疫苗，正好参考这些护理建议！',
        time: '2023-05-15 11:00',
        images: [],
        parentId: null, // 顶级评论没有parentId
        replies: [],// 子回复
        likes: 10,        // 点赞数
        isLiked: false   // 当前用户是否已点赞
        
      },
      {
        id: 2,
        author: '爱心人士',
        authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        content: '作为救助站志愿者，这些信息对我们照顾流浪动物很有参考价值。',
        time: '2023-05-15 12:30',
        images: [],
        parentId: null,
        replies: [],
        likes: 15,        // 点赞数
        isLiked: false   // 当前用户是否已点赞
        
      },
      {
        id: 3,
        author: '新手猫奴',
        authorAvatar: 'https://randomuser.me/api/portraits/women/21.jpg',
        content: '我家猫咪绝育后第一天不吃不喝，看了这篇文章才知道是正常现象，现在第二天已经开始吃东西了，感谢分享！',
        time: '2023-05-14 16:45',
        images: [
          { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80', thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80' }
        ],
        parentId: null,
        replies: [],
        likes: 80,        // 点赞数
        isLiked: false   // 当前用户是否已点赞
        
      }
      ],
      newComment: '',
      commentImages: [],
      showReplyDialog: false,
      replyingTo: null,
      replyContent: '',
      replyImages: [],
      showImagePreviewModal: false,
      currentPreviewImage: '',
      likes: 0,        // 点赞数
      isLiked: false,   // 当前用户是否已点赞
      currentUser: {
        id: 1,
        name: '当前用户',
        avatar: ''
      },
      // 删除功能相关状态
      showDeleteConfirm: false,
      deleteTarget: null, // 要删除的目标（post或comment）
      deleteType: null, // 'post' 或 'comment'
      deleteConfirmMessage: ''
    }
  },
   
 
  created() {
    console.log('组件已创建');
    this.initializePagination();
    
    // 添加全局错误处理
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('pagination') || 
          e.target.closest('.pagination')) {
        console.log('点击了分页区域', e.target);
      }
    });
  },


  computed: {

    // 过滤帖子
    filteredPosts() {
      let filtered = this.allPosts;
      
      // 搜索过滤
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase();
        filtered = filtered.filter(post => {
          return (
            (post.title && post.title.toLowerCase().includes(query)) ||
            (post.content && post.content.toLowerCase().includes(query)) ||
            (post.tags && post.tags.toLowerCase().includes(query)) ||
            (post.author && post.author.toLowerCase().includes(query))
          );
        });
      }
      
      // 标签过滤
      if (this.currentTag !== 'all') {
        const selectedTagName = this.tags.find(tag => tag.id === this.currentTag)?.name;
        filtered = filtered.filter(post => 
          post.tags && post.tags.includes(selectedTagName)
        );
      }
      
      return filtered;
    },
    


    totalPages() {
      let totalPosts;
      
      // 如果有搜索或标签筛选，使用过滤后的帖子数量
      if (this.searchQuery.trim() || this.currentTag !== 'all') {
        totalPosts = this.filteredPosts.length;
      } else {
        totalPosts = Number(this.totalPostsFromAPI) || 0;
      }
      
      const postsPerPage = Number(this.postsPerPage) || 10;
      
      if (totalPosts <= 0 || postsPerPage <= 0) {
        return 1;
      }
      
      const pages = Math.ceil(totalPosts / postsPerPage);
      return Math.max(1, pages); // 确保至少1页
    },
    
    totalPosts() {
      // 显示当前状态下的总帖子数
      if (this.searchQuery.trim() || this.currentTag !== 'all') {
        return this.filteredPosts.length;
      }
      return this.totalPostsFromAPI;
    },

  
    paginatedPosts() {
      // 如果有搜索词或标签筛选，使用filteredPosts进行分页
      if (this.searchQuery.trim() || this.currentTag !== 'all') {
        const start = (this.currentPage - 1) * this.postsPerPage;
        const end = start + this.postsPerPage;
        return this.filteredPosts.slice(start, end);
      }
      
      return this.originalPosts;
    },
      

    canSubmitPost() {
      return (this.newPostContent.trim() || this.newPostImages.length > 0) && 
            this.newPostSelectedTag.length > 0;
    },

    flatComments() {
      const flatten = (comments, depth = 0) => {
        return comments.reduce((acc, comment) => {
          const flatComment = {
            ...comment,
            depth,
            isSelfReply: this.isSelfReply(comment)
          };
          acc.push(flatComment);
          
          if (comment.replies && comment.replies.length > 0) {
            acc.push(...flatten(comment.replies, depth + 1));
          }
          return acc;
        }, []);
      };
      
      return flatten(this.comments);
    },
     
    canDeletePost() {
      if (!this.currentPost || !this.currentUser) return false;
      return this.isManager || this.currentPost.userId === this.currentUser.id;
    },

     displayedPages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const pages = [];
      
      if (total <= 5) {
        // 总页数小于等于7，显示所有页码
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // 总页数大于7，添加省略号
        pages.push(1);
        
        if (current > 4) {
          pages.push('...');
        }
        
        // 计算中间页码范围
        const start = Math.max(2, current - 2);
        const end = Math.min(total - 1, current + 2);
        
        for (let i = start; i <= end; i++) {
          // 避免重复添加
          if (i !== 1 && i !== total) {
            pages.push(i);
          }
        }
        
        if (current < total - 3) {
          pages.push('...');
        }
        
        pages.push(total);
      }
      
      return pages;
    }
  },
  methods: {

    getTagColor(tagName) {
      const colorMap = {
        '犬科': '#3B82F6', // 蓝色
        '猫科': '#EC4899', // 粉色
        '疾病预防': '#10B981', // 绿色
        '治疗分享': '#F59E0B', // 橙色
        '营养饮食': '#14B8A6', // 蓝绿色
        '行为问题': '#6366F1' // 紫色
      };
      return colorMap[tagName] || '#6B7280'; // 默认灰色
    },

  

     clearSearch() {
      this.searchQuery = '';
      this.isSearching = false;
      this.currentPage = 1;
      // 重置到原始帖子列表
      this.loadPage(1);
    },

    handleSearchInput() {
      // 如果搜索框为空，恢复原始数据
      if (!this.searchQuery.trim()) {
        this.currentPage = 1;
      }
    },


    async searchPosts() {
      const query = this.searchQuery.trim().toLowerCase();
      
      // 重置到第一页
      this.currentPage = 1;
      
      if (!query) {
        await this.loadPage(1);
        return;
      }
      
      this.isSearching = true;
      this.$emit('search', this.searchQuery);
    },

    selectTag(tagId) {
      this.currentTag = tagId;
      this.currentPage = 1; // 重置到第一页
      
      if (tagId === 'all') {
        console.log('显示所有帖子');
      } else {
        const tagName = this.tags.find(tag => tag.id === tagId)?.name;
        console.log('筛选标签:', tagName, '结果:', this.filteredPosts.length, '条');
      }
    },

    newPost() {
      this.showNewPostModal = true;
    },
    
    closeNewPostModal() {
      this.showNewPostModal = false;
      this.resetPostForm();
    },
    
    resetPostForm() {
      this.newPostTitle = '';
      this.newPostContent = '';
      this.newPostImages = [];
      this.newPostSelectedTag = '';
    },


    toggleTagSelection(tagId) {
      if (this.newPostSelectedTag.includes(tagId)) {
        this.newPostSelectedTag = this.newPostSelectedTag.filter(id => id !== tagId);
      } else {
        this.newPostSelectedTag = [...this.newPostSelectedTag, tagId];
      }
    },
    
   
    


    
    async removePostImage(index) {
      const removed = this.newPostImages.splice(index, 1)[0];
      if (removed.uploadedPath) {
        const success = await deleteImage(removed.uploadedPath);
        if (success) {
          //从图片地址字符串中移除
          const remainingPaths = this.newPostImages.map(img => img.uploadedPath);
          console.log('剩余图片地址:', remainingPaths.join(','));
        } else {
          // 失败后恢复
          this.newPostImages.splice(index, 0, removed);
        }
      }
    },
    
    async submitNewPost() {
      if (!this.canSubmitPost) return;

      try {
        // 打印上传前的本地图片信息
        console.log('准备上传的图片（本地）:', this.newPostImages.map(img => ({
          name: img.file.name,
          size: img.file.size,
          preview: img.preview
        })));

        const uploadedPaths = this.newPostImages.map(img => img.uploadedPath);

        // 打印后端返回的图片路径
        console.log('后端返回的图片路径:', uploadedPaths);

        // 更新图片对象的上传路径
        this.newPostImages.forEach((img, index) => {
          img.uploadedPath = uploadedPaths[index];
        });

        const postData = {
          userId: this.currentUserId,
          username: this.currentUsername,
          title:this.newPostTitle,
          content: this.newPostContent.trim(),
          tags: this.newPostSelectedTag.map(id => this.tags.find(t => t.id === id)?.name).filter(Boolean).join(','),
          imagesUrl: uploadedPaths.join(','),
          viewCount: 0,
          commentCount: 0,
          likeCount: 0,
          collectCount: 0,
        };

        // 打印最终要传给后端的完整数据
        console.log('📦 最终传给后端的postData:', postData);

        const res = await addPost(postData);
        console.log('🎉 发布成功', res.data);
        
        this.closeNewPostModal();
        this.resetPostForm();
        this.refreshPosts();
      } catch (err) {
        console.error('❌ 发布失败', err);
      }
    },

    
    async deleteUploadedImage(imagePath) {
      try {
        const success = await deleteImage(imagePath);
        if (success) {
          console.log('图片删除成功');
        } else {
          console.warn('图片删除失败');
        }
        return success;
      } catch (error) {
        console.error('删除图片时发生错误:', error);
        return false;
      }
    },

    //显示图片
    processedImages() {
      if (!this.currentPost.imagesUrl) return [];
      
      return this.currentPost.imagesUrl.split(',').map(url => ({
        url: getFullImageUrl(url),
        thumbnail: getFullImageUrl(url)
      }));
    },
    async initializePagination() {
      await this.refreshComments();
      this.isLoading = true;
      try {

        // 从后端获取所有帖子数据
        const allPostsResponse = await getPostsByPage(10000, 0); // 假设一次获取所有帖子
        this.allPosts = allPostsResponse.data.data.map(post => {
          const imageUrls = post.imagesUrl
                    ? getFullImageUrl(post.imagesUrl)   // ← 直接调用
                    : [];
          return {
            ...post,
            id: post.postId,
            author: post.username,
            authorAvatar: '',
            time: new Date().toLocaleString(),
            views: post.viewCount || 0,
            comments: post.commentCount || 0,
            likes: post.likeCount || 0,
            collections: post.collectCount || 0,
            isLiked: false,
            isCollected: false,
            thumbnail: imageUrls.length ? imageUrls[0] : '',
            images: imageUrls.map(url => ({ url }))
          };
        });

        const response = await getPostNum();
        console.log('帖子总数API返回:', response);

        if (response && response.data && response.data.data !== undefined) {
          this.totalPostsFromAPI = Number(response.data.data);
          console.log('成功获取帖子总数:', this.totalPostsFromAPI);
        } else {
          console.warn('帖子总数API返回格式错误，使用默认值');
          this.totalPostsFromAPI = 0;
        }

        // 关键：根据总条数算总页数
        //this.totalPages = Math.ceil(this.totalPostsFromAPI / this.postsPerPage);

        // 加载第一页
        await this.loadPage(1);
      } catch (error) {
        console.error('分页初始化失败:', error);
        this.totalPostsFromAPI = 0;
        this.totalPages = 1;
      } finally {
        this.isLoading = false;
      }
    },

    // 修改 loadPage 方法
    async loadPage(page) {
      console.group('loadPage方法调试');
      console.log('加载页面参数:', {
        page: page, 
        postsPerPage: this.postsPerPage, 
        offset: this.postsPerPage * (page - 1)
      });
      this.isLoading = true;
      try {
        const offset = this.postsPerPage * (page - 1);
        const response = await getPostsByPage(this.postsPerPage, offset);
        console.log('API响应数据:', response.data);

        if (!response.data || response.data.code !== 200) {
          console.error('API返回数据格式错误或请求失败', response.data);
          return;
        }

    

        const newPosts = response.data.data.map(post => {
          const imageUrls = post.imagesUrl
                ? getFullImageUrl(post.imagesUrl)   
                : [];
          return {
            ...post,
            id: post.postId,
            author: post.username,
            authorAvatar: '',
            time: post.createDate || post.publishTime || post.createdAt || '2025-01-01 00:00:00',
            views: post.viewCount || 0,
            comments: post.commentCount || 0,
            likes: post.likeCount || 0,
            collections: post.collectCount || 0,
            isLiked: false,
            isCollected: false,
            thumbnail: imageUrls.length ? imageUrls[0] : '',
            images: imageUrls.map(url => ({ url }))
          };
        });
        console.log('转换后的帖子数据:', newPosts);
        this.originalPosts = [...newPosts];
        console.log('打印原始数据',this.originalPosts);
        this.currentPage = page;
      } catch (error) {
        console.error('加载页面失败:', error);
      } finally {
        this.isLoading = false;
        console.groupEnd();
      }
    },


    debugPageChange(page, type) {
      console.group('分页调试详细信息');
      console.log('点击的分页按钮类型:', type);
      console.log('目标页码:', page);
      console.log('当前页码:', this.currentPage);
      console.log('总页数:', this.totalPages);
      console.log('每页数量:', this.postsPerPage);
      console.log('API总帖子数:', this.totalPostsFromAPI);
      console.log('是否禁用:', page < 1 || page > this.totalPages);
      console.log('计算属性totalPages值:', this.totalPages);
      console.log('计算属性paginatedPosts值:', this.paginatedPosts);
      console.groupEnd();
      
      this.changePage(page);
    }, 
    

    // 换页
    async changePage(page) {
      console.group('changePage方法调试');
      console.log('传入的页码:', page);
      console.log('当前页码:', this.currentPage);
      console.log('总页数:', this.totalPages);
      
      if (page < 1 || page > this.totalPages) {
        console.log('无效的页码，取消操作');
        console.groupEnd();
        return;
      }
      
      try {
        console.log('开始加载页面:', page);

        if (this.searchQuery.trim() || this.currentTag !== 'all') {
          this.currentPage = page;
        } else {
          // 否则从后端加载对应页码的数据
          await this.loadPage(page);
        }
        console.log('页面加载完成');
        
        // 检查数据是否更新到界面
        console.log('检查界面数据:');
        console.log('originalPosts长度:', this.originalPosts.length);
        console.log('paginatedPosts计算属性:', this.paginatedPosts);
        
      } catch (error) {
        console.error('加载页面失败:', error);
      } finally {
        console.groupEnd();
      }
    },



    // 添加时间格式化方法
    formatTime(dateString) {
      if (!dateString) return '';
     // console.log(dateString)
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      // 如果是今天内，显示相对时间
      if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        if (hours > 0) return `${hours}小时前`;
        
        const minutes = Math.floor(diff / (60 * 1000));
        if (minutes > 0) return `${minutes}分钟前`;
        
        return '刚刚';
      }
      
      // 否则显示完整日期
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-');
    },
    uploadImages(images) {
      return new Promise(resolve => {
        // 模拟上传延迟
        setTimeout(() => {
          const result = images.map(img => ({
            url: img.preview, 
            thumbnail: img.preview
          }));
          resolve(result);
        }, 500);
      });
    },

   
    async toggleLike(comment, event) {
      const isLiking = !comment.isLiked;
      const action = isLiking ? '增加' : '取消';
      const newLikes = isLiking ? comment.likes + 1 : Math.max(0, comment.likes - 1);
      const userId = this.currentUserId;

      try {
        const res = await updateCommentLikes(action, comment.commentId, userId, newLikes);
        if (res.data?.code === 200) {
          console.log('评论点赞后端返回',res.data);
          this.updateCommentLikeStatus(comment.commentId, isLiking);
          this.comments=this.updateCommentInTree(this.comments, comment.commentId, {
          likes: newLikes,
          
          });

          if (isLiking) {
            this.playLikeAnimation(event);
          }
        } else {
          alert(`点赞失败：${res.data?.msg || '未知错误'}`);
        }
      } catch (err) {
        console.error('点赞请求失败:', err);
        alert('网络错误，点赞失败');
      }
    },

    // 更新评论点赞状态
    updateCommentLikeStatus(commentId, isLiked) {
      const updateRecursive = (comments) => {
        return comments.map(comment => {
          if (comment.commentId === commentId || comment.id === commentId) {
            return { ...comment, isLiked };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateRecursive(comment.replies)
            };
          }
          return comment;
        });
      };
      
      this.comments = updateRecursive(this.comments);
    },


    //更新评论树
    updateCommentInTree(comments, targetId, updates) {
      return comments.map(c => {
        if (c.commentId === targetId) {
          return { ...c, ...updates };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: this.updateCommentInTree(c.replies, targetId, updates)
          };
        }
        return c;
      });
    },

    deepUpdateComments(comments, targetComment) {
      return comments.map(c => {
        // 找到目标评论
        if (c.id === targetComment.id) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likes: c.likes + (c.isLiked ? -1 : 1)
          };
        }
          
        // 递归处理回复
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: this.deepUpdateComments(c.replies, targetComment)
          };
        }
          
        return c;
      });
    },
    
    
    // 评论点赞动画
    playLikeAnimation(event) {
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.fontSize = '20px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.left = `${event.clientX - 10}px`;
      heart.style.top = `${event.clientY - 10}px`;
      document.body.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1000);
    },
  

    // 触摸事件处理
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.isDragging = true;
    },

    handleTouchMove(e) {
      if (!this.isDragging) return;
      this.touchCurrentX = e.touches[0].clientX;
      this.calculateDrag();
    },

    handleTouchEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.finalizeDrag();
    },

    // 鼠标事件处理
    handleMouseDown(e) {
      this.touchStartX = e.clientX;
      this.isDragging = true;
      e.preventDefault();
    },

    handleMouseMove(e) {
      if (!this.isDragging) return;
      this.touchCurrentX = e.clientX;
      this.calculateDrag();
    },

    handleMouseEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.finalizeDrag();
    },

    // 计算拖动
    calculateDrag() {
      const diff = this.touchStartX - this.touchCurrentX;
      const threshold = 50; // 滑动阈值
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
        this.isDragging = false;
      }
    },

    // 完成拖动
    finalizeDrag() {
      this.touchStartX = null;
      this.touchCurrentX = null;
    },

    // 切换幻灯片
    prevSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },

    nextSlide() {
      if (this.currentSlide < this.currentPost.images.length - 1) {
        this.currentSlide++;
      }
    },

    goToSlide(index) {
      this.currentSlide = index;
    },
    

    async viewPost(postId) {
      console.log('尝试查看帖子ID:', postId);
      
      
      // 在所有数据源中查找帖子
      let post = null;
      
      // 1. 首先在originalPosts中查找
      if (this.originalPosts && this.originalPosts.length > 0) {
        post = this.originalPosts.find(p => 
          p.postId === postId || p.id === postId || p.id === parseInt(postId)
        );
      }
      
      // 2. 如果在originalPosts中没找到，尝试在posts中查找
      if (!post && this.posts && this.posts.length > 0) {
        post = this.posts.find(p => 
          p.postId === postId || p.id === postId || p.id === parseInt(postId)
        );
      }
      
      if (!post) {
        console.error('找不到ID为', postId, '的帖子');
        alert('无法找到该帖子，可能已被删除');
        return;
      }
      
      console.log('找到帖子:', post);
      console.log('尝试查看帖子ID:', post.id);
      console.log('帖子原始imagesUrl:', post.imagesUrl);
      console.log('解析后的图片URLs:', getFullImageUrl(post.imagesUrl));
      this.currentPost = {
        ...post,
        // 确保所有字段都有默认值
        views: post.viewCount || post.views || 0,
        comments: post.commentCount || post.comments || 0,
        likes: post.likeCount || post.likes || 0,
        collections: post.collectCount || post.collections || 0,
        time: post.createDate || post.time || '',
        isLiked: post.isLiked || false,
        isCollected: post.isCollected || false,
        thumbnail: post.thumbnail || post.image || '',
        // 确保 images 数组存在
        images: post.imagesUrl
                    ? getFullImageUrl(post.imagesUrl).map(url => ({ url }))
                    : []
      };
      console.log('最终图片数组:', this.currentPost.images);
      await this.refreshComments();
      this.currentSlide = 0;
      this.showPostDetail = true;
      document.body.style.overflow = 'hidden';

      
      const userId = this.currentUserId;
      await this.updateViewCount(post.postId || post.id,userId);

      // 检查帖子和评论的点赞/收藏状态
      await this.checkPostStatus();
      await this.checkCommentStatus();

    },

  
    // 检查帖子点赞和收藏状态
    async checkPostStatus() {
      if (!this.currentPost.postId || !this.currentUserId) return;
      
      try {
        // 检查点赞状态
        const likeRes = await checkPostStatus('like', this.currentPost.postId, this.currentUserId);
        if (likeRes.data?.code === 200) {
          this.currentPost.isLiked = true;
        } else {
          this.currentPost.isLiked = false;
        }
        
        // 检查收藏状态
        const collectRes = await checkPostStatus('collect', this.currentPost.postId, this.currentUserId);
        if (collectRes.data?.code === 200) {
          this.currentPost.isCollected = true;
        } else {
          this.currentPost.isCollected = false;
        }
      } catch (error) {
        console.error('检查帖子状态失败:', error);
        // 失败时保持默认状态
        this.currentPost.isLiked = false;
        this.currentPost.isCollected = false;
      }
    },

    // 检查评论点赞状态
    async checkCommentStatus() {
      if (!this.comments.length || !this.currentUserId) return;
      
      try {
        // 获取所有评论ID（包括嵌套回复）
        const allCommentIds = this.getAllCommentIds();
        
        // 批量检查点赞状态
        for (const commentId of allCommentIds) {
          const res = await checkCommentStatus(commentId, this.currentUserId);
          if (res.data?.code === 200) {
            // 更新评论的点赞状态
            this.updateCommentLikeStatus(commentId, true);
          }
        }
      } catch (error) {
        console.error('检查评论状态失败:', error);
      }
    },

    // 获取所有评论ID（递归获取嵌套评论）
    getAllCommentIds() {
      const ids = [];
      const traverse = (comments) => {
        comments.forEach(comment => {
          ids.push(comment.commentId || comment.id);
          if (comment.replies && comment.replies.length > 0) {
            traverse(comment.replies);
          }
        });
      };
      traverse(this.comments);
      return ids;
    },


    async likePost(event) {
      const postId = this.currentPost.postId || this.currentPost.id;
      const userId = this.currentUserId;
      const isLiking = !this.currentPost.isLiked; // 当前是要点赞还是取消点赞

      try {
        const type = 'like';
        const action = isLiking ? '增加' : '取消';
        const newLikes = isLiking ? this.currentPost.likes + 1 : Math.max(0, this.currentPost.likes - 1);

        const res = await updatePostStats(type, action, postId, userId, newLikes);

        if (res.data?.code === 200) {
          // 更新本地状态
          this.currentPost.likes = newLikes;
          this.currentPost.isLiked = isLiking;

          if (isLiking) {
            this.createLikeEffect(event);
          }
        } else {
          alert('点赞操作失败');
        }
      } catch (err) {
        console.error('点赞请求失败:', err);
      }
    },

    // 修改收藏帖子方法
    async collectPost(event) {
      const postId = this.currentPost.postId || this.currentPost.id;
      const userId = this.currentUserId;
      const isCollecting = !this.currentPost.isCollected; // 当前是要收藏还是取消收藏

      try {
        const action = isCollecting ? '增加' : '取消';
        const newCollections = isCollecting ? 
          this.currentPost.collections + 1 : 
          Math.max(0, this.currentPost.collections - 1);

        const res = await updatePostStats('collect', action, postId, userId, newCollections);
        
        if (res.data?.code === 200) {
          this.currentPost.collections = newCollections;
          this.currentPost.isCollected = isCollecting;

          if (isCollecting) {
            this.createCollectEffect(event);
          }
        } else {
          alert('收藏操作失败');
        }
      } catch (err) {
        console.error('收藏请求失败:', err);
      }
    },


      // 创建点赞动画效果
    createLikeEffect(event) {
      const effect = document.createElement('div');
      effect.className = 'like-effect';
      effect.innerHTML = '❤️';
      effect.style.position = 'fixed';
      effect.style.fontSize = '24px';
      effect.style.pointerEvents = 'none';
      effect.style.zIndex = '9999';
      effect.style.left = (event.clientX - 12) + 'px';
      effect.style.top = (event.clientY - 12) + 'px';
      effect.style.animation = 'likeAnimation 1s forwards';
      document.body.appendChild(effect);
      
      // 动画结束后移除元素
      setTimeout(() => {
        effect.remove();
      }, 1000);
    },
      // 创建收藏动画效果
    createCollectEffect(event) {
      const effect = document.createElement('div');
      effect.className = 'collect-effect';
      effect.innerHTML = '⭐';
      effect.style.position = 'fixed';
      effect.style.fontSize = '24px';
      effect.style.pointerEvents = 'none';
      effect.style.zIndex = '9999';
      effect.style.left = (event.clientX - 12) + 'px';
      effect.style.top = (event.clientY - 12) + 'px';
      effect.style.animation = 'collectAnimation 1s forwards';
      document.body.appendChild(effect);
      
      // 动画结束后移除元素
      setTimeout(() => {
        effect.remove();
      }, 1000);
    },

    closeModal() {
      this.showPostDetail = false;
      document.body.style.overflow = '';
      this.commentImages = [];

      // 重新加载当前页数据，刷新列表
      this.loadPage(this.currentPage);
    },

    openReplyDialog(comment) {
      this.replyingTo = comment;
      this.showReplyDialog = true;
      this.$nextTick(() => {
        this.$refs.replyTextarea.focus();
      });
    },
    closeReplyDialog() {
      this.showReplyDialog = false;
      this.replyingTo = null;
      this.replyContent = '';
      this.replyImages = [];
    },
    async handlePostImageUpload(e) {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const remainingSlots = 5 - this.newPostImages.length;
      const validFiles = files.slice(0, remainingSlots);

      for (const file of validFiles) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const preview = e.target.result;

          // 立即上传
          try {
            const [uploadedUrl] = await uploadImages([file]);
            this.newPostImages.push({
              file,
              preview,
              uploadedPath: uploadedUrl, // 保存地址
            });
          } catch (err) {
            console.error('图片上传失败:', err);
            alert(`图片上传失败：${file.name}`);
          }
        };
        reader.readAsDataURL(file);
      }

      this.$refs.postFileInput.value = '';
    },

    async handleCommentImageUpload(e) {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const remainingSlots = 5 - this.commentImages.length;
      const validFiles = files.slice(0, remainingSlots);

      for (const file of validFiles) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const preview = e.target.result;
          try {
            const [uploadedUrl] = await uploadImages([file]);
            this.commentImages.push({
              file,
              preview,
              uploadedPath: uploadedUrl,
            });
          } catch (err) {
            console.error('评论图片上传失败:', err);
            alert(`评论图片上传失败：${file.name}`);
          }
        };
        reader.readAsDataURL(file);
      }

      this.$refs.commentFileInput.value = '';
    },
    async handleReplyImageUpload(e) {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const remainingSlots = 5 - this.replyImages.length;
      const validFiles = files.slice(0, remainingSlots);

      for (const file of validFiles) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const preview = e.target.result;
          try {
            const [uploadedUrl] = await uploadImages([file]);
            this.replyImages.push({
              file,
              preview,
              uploadedPath: uploadedUrl,
            });
          } catch (err) {
            console.error('评论图片上传失败:', err);
            alert(`评论图片上传失败：${file.name}`);
          }
        };
        reader.readAsDataURL(file);
      }

      this.$refs.commentFileInput.value = '';
    },


    // 删除预览区图片
    removeCommentImage(index) {
      const removed = this.commentImages.splice(index, 1)[0];
      if (removed.uploadedPath) {
        this.deleteUploadedImage(removed.uploadedPath);
        //console.log('剩余图片地址:', remainingPaths.join(','));
      }
    },

    removeReplyImage(index) {
      const removed = this.replyImages.splice(index, 1)[0];
      if (removed.uploadedPath) {
        this.deleteUploadedImage(removed.uploadedPath);
      }
    },


   //提交评论
  //  async submitComment() {
  //     if (!this.newComment.trim() && this.commentImages.length === 0) {
  //       alert('请输入评论内容或上传图片');
  //       return;
  //     }

  //     try {
  //       // 1. 上传图片（复用已有方法）
  //       const imageUrls = await uploadImages(this.commentImages.map(img => img.file));

  //       // 2. 构造评论数据
  //       const data = {
  //         postId: this.currentPost.postId,
  //         userId: 1, // 当前用户ID（可替换为真实用户）
  //         username: '当前用户', // 可替换为真实用户名
  //         content: this.newComment.trim(),
  //         commentTime: null, // 后端生成时间
  //         parentComment: null, // 顶级评论
  //         likeCount: 0,
  //         image: imageUrls.join(',') // 多张图用逗号分隔
  //       };

  //       // 3. 调用后端接口
  //       await addComment(data);

  //       alert('评论成功！');
  //       this.newComment = '';
  //       this.commentImages = [];
  //       this.refreshComments(); // 刷新评论列表
  //     } catch (error) {
  //       console.error('评论失败:', error);
  //       alert('评论失败，请重试');
  //     }
  //   },
    
    async submitComment() {
      if (!this.newComment.trim() && this.commentImages.length === 0) {
        alert('请输入评论内容或上传图片');
        return;
      }

      try {
        // 打印上传前的本地图片信息
        console.log('准备上传的评论图片（本地）:', this.commentImages.map(img => ({
          name: img.file.name,
          size: img.file.size,
          preview: img.preview
        })));

        const imageString = this.commentImages.map(img => img.uploadedPath).join(',');

        // 打印后端返回的图片路径
        console.log('后端返回的评论图片路径:', imageString);

        const payload = {
          postId: this.currentPost.postId,
          userId: this.currentUserId,
          username: this.currentUsername,
          content: this.newComment.trim(),
          image: imageString,
          parentComment: null,
          likeCount: 0
        };

        // 打印最终传给后端的评论数据
        console.log('最终传给后端的评论数据:', payload);

        await addComment(payload);
        const userId = this.currentUserId;
        await updatePostStats('comment','增加', this.currentPost.postId, userId, this.currentPost.comments + 1);
        
        this.newComment = '';
        this.commentImages = [];
        this.refreshComments();
      } catch (error) {
        console.error('评论失败：', error);
      }
    },
    
    async refreshComments() {
      try {
        const res = await getComments(this.currentPost.postId);
        console.log('后端返回评论：', res.data);

        if (res.data?.code === 200) {
          // 将平铺的评论列表转换为嵌套结构
          this.comments = this.buildCommentTree(res.data.data || []);
          this.currentPost.comments = res.data.data.length || 0;
        }
      } catch (err) {
        console.error('获取评论失败：', err);
      }
    },

    buildCommentTree(comments) {
      const commentMap = {};
      const rootComments = [];
      
      // 首先创建所有评论的映射
      comments.forEach(comment => {
        commentMap[comment.commentId] = {
          ...comment,
          // 确保有isLiked和likes字段
          isLiked: comment.isLiked || false,
          likes: comment.likeCount || 0,
          replies: [],
          imageList: comment.image ? comment.image.split(',').map(url => getFullImageUrl(url)) : []
        };
      });
      
      // 构建嵌套结构
      comments.forEach(comment => {
        if (comment.parentComment) {
          const parent = commentMap[comment.parentComment];
          if (parent) {
            parent.replies.push(commentMap[comment.commentId]);
          }
        } else {
          rootComments.push(commentMap[comment.commentId]);
        }
      });
      
      return rootComments;
    },
    showImagePreview(imageUrl) {
      this.currentPreviewImage = imageUrl;
      this.showImagePreviewModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeImagePreview() {
      this.showImagePreviewModal = false;
      document.body.style.overflow = '';
    },
  
  
    getCommentAuthor(commentId) {
      const allComments = this.getAllComments();
      const comment = allComments.find(c => c.id === commentId);
      return comment ? comment.author : '已删除用户';
    },
  
    getAllComments() {
      // 递归获取所有评论（包括嵌套回复）
      const result = [];
      const traverse = (comments) => {
        comments.forEach(comment => {
          result.push(comment);
          if (comment.replies && comment.replies.length > 0) {
            traverse(comment.replies);
          }
        });
      };
      traverse(this.comments);
      return result;
    },
    // 检查是否是当前用户的评论
    canDeleteComment(comment) {
      return this.isManager || comment.userId === this.currentUser.id;
    },
    
    // 确认删除帖子
    confirmDeletePost() {
      this.deleteType = 'post';
      this.deleteTarget = this.currentPost;
      this.deleteConfirmMessage = '确定要删除这篇帖子吗？删除后将无法恢复。';
      this.showDeleteConfirm = true;
    },
    
    // 确认删除评论
    confirmDeleteComment(comment) {
      this.deleteType = 'comment';
      this.deleteTarget = comment;
      this.deleteConfirmMessage = '确定要删除这条评论吗？删除后将无法恢复。';
      this.showDeleteConfirm = true;
    },
    
   
     // 删除帖子
    async deletePost() {
      
      try {
        const res = await deletePost(this.currentPost.postId || this.currentPost.id);
        if (res.data?.code === 200) {
          //alert('帖子删除成功');
          this.showPostDetail = false;
          this.closeModal();
          await this.initializePagination(); // 刷新帖子列表
        } else {
          //alert('删除失败：' + (res.data?.msg || '未知错误'));
          console.log('删除帖子请求参数：', this.currentPost.postId);
          console.log('后端返回：', res.data);
        }
        
      } catch (err) {
        console.error('删除帖子失败:', err);
        alert('网络错误，删除失败');
      }
    },

     // 删除评论
    async deleteComment() {
      try {
        const res = await deleteComment(this.deleteTarget.commentId || this.deleteTarget.id);
        if (res.data?.code === 200) {
          //alert('评论删除成功');
          await this.refreshComments(); // 刷新评论
          const userId = this.currentUserId;
          await updatePostStats('comment', '取消', this.currentPost.postId,userId,this.currentPost.comments);
        } else {
          alert('删除失败：' + (res.data?.msg || '未知错误'));
        }
      } catch (err) {
        console.error('删除评论失败:', err);
        alert('网络错误，删除失败');
      }
      
    },

     // 取消删除
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.deleteTarget = null;
      this.deleteType = null;
    },
    
    // 确认删除
    async confirmDelete() {
      if (this.deleteType === 'post') {
        await this.deletePost();
      } else if (this.deleteType === 'comment') {
        await this.deleteComment();
      }

      this.showDeleteConfirm = false;
      this.deleteTarget = null;
      this.deleteType = null;
    },

    async refreshPosts() {
      await this.initializePagination(); // 重新加载帖子
    },

    //提交回复方法
    async submitReply() {
      if (!this.replyContent.trim() && this.replyImages.length === 0) {
        alert('请输入回复内容或上传图片');
        return;
      }

      try {
        // 打印上传前的本地图片信息
        console.log('准备上传的回复图片（本地）:', this.replyImages.map(img => ({
          name: img.file.name,
          size: img.file.size,
          preview: img.preview
        })));

        const imageString = this.replyImages.map(img => img.uploadedPath).join(',');

        // 打印后端返回的图片路径
        console.log('后端返回的回复图片路径:',imageString);

        const payload = {
          postId: this.currentPost.postId,
          userId: this.currentUserId,
          username: this.currentUsername,
          content: this.replyContent.trim(),
          image: imageString,
          parentComment: this.replyingTo.commentId || this.replyingTo.id,
          likeCount: 0
        };

        // 打印最终传给后端的回复数据
        console.log('最终传给后端的回复数据:', payload);

        await addComment(payload);
        const userId = this.currentUserId;
        await updatePostStats('comment','增加' ,this.currentPost.postId, userId,this.currentPost.comments + 1);
        
        this.replyContent = '';
        this.replyImages = [];
        this.closeReplyDialog();
        this.refreshComments();
      } catch (err) {
        console.error('回复失败：', err);
      }
    },



    isSelfReply(comment) {
      if (!comment.parentId) return false;
      
      const parentComment = this.findCommentById(comment.parentId);
      return parentComment && parentComment.author === '当前用户' && comment.author === '当前用户';
    },

   findCommentById(id) {
      // 递归查找评论
      const search = (comments) => {
        for (const comment of comments) {
          if (comment.id === id) return comment;
          if (comment.replies && comment.replies.length > 0) {
            const found = search(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };
      return search(this.comments);
    },


    //更新浏览量的方法
    async updateViewCount(postId,userId) {
      const newViews = this.currentPost.views + 1;

      
      try {
        
        const res = await updatePostStats('view', '增加',postId, userId, newViews);
        if (res.data?.code === 200) {
          // 只有后端返回成功，才更新前端
          this.currentPost.views = newViews;
        } else {
          console.warn('浏览量更新失败');
        }
      } catch (err) {
        console.error('浏览量请求失败:', err);
      }
    },
    splitImagePaths(imageString) {
      if (!imageString) return [];
      return imageString.split(',').filter(path => path.trim() !== '');
    },

    joinImagePaths(imageArray) {
      return imageArray.filter(path => path).join(',');
    },
   
    //跳页

      async gotoSpecificPage() {
        // 验证输入是否有效
        if (!this.gotoPage || this.gotoPage < 1 || this.gotoPage > this.totalPages) {
          alert(`请输入有效的页码 (1-${this.totalPages})`);
          this.gotoPage = null;
          return;
        }
        
        // 转换为整数
        const targetPage = parseInt(this.gotoPage);
        
        // 如果已经是当前页，不需要操作
        if (targetPage === this.currentPage) {
          this.gotoPage = null;
          return;
        }
        
        try {
          // 如果有搜索或标签筛选，使用本地过滤数据
          if (this.searchQuery.trim() || this.currentTag !== 'all') {
            this.currentPage = targetPage;
          } else {
            // 否则从API加载对应页码的数据
            await this.loadPage(targetPage);
          }
          
          // 清空输入框
          this.gotoPage = null;
          
          // 滚动到页面顶部
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error('跳转页面失败:', error);
          alert('跳转页面失败，请重试');
        }
      },
      fixHorizontalScroll() {
      // 防止内容溢出导致水平滚动
      document.body.style.overflowX = 'hidden';
      
      
    }
  },
  watch: {
    showPostDetail(newVal) {
      if (!newVal) {
        document.body.style.overflow = '';
        this.commentImages = [];
      }
    },
    showReplyDialog(newVal) {
      if (!newVal) {
        this.replyImages = [];
      }
    },
    currentPage(newVal, oldVal) {
        console.log('currentPage变化:', oldVal, '->', newVal);
      },
      totalPostsFromAPI(newVal, oldVal) {
        console.log('totalPostsFromAPI变化:', oldVal, '->', newVal);
      },
      totalPages(newVal, oldVal) {
        console.log('totalPages变化:', oldVal, '->', newVal);
      },

      
  },
  
  mounted() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUserId = user.userId || 1;
    this.currentUsername = user.username || '游客';
    this.currentUser = {
      id: this.currentUserId,
      name: this.currentUsername,
      avatar: ''
    };

    //读取管理员状态
    this.isManager = user.isManager || false;

    this.fixHorizontalScroll();
    window.addEventListener('resize', this.fixHorizontalScroll);
  },
      
  beforeUnmount() {
    window.removeEventListener('resize', this.fixHorizontalScroll);
  },

 
}
</script>

<style>
:root {
  --primary-gradient: linear-gradient(135deg, #10B981, #0EA5E9);
  --secondary-gradient: linear-gradient(135deg, #EC4899, #F59E0B);
  --accent-gradient: linear-gradient(135deg, #6366F1, #8B5CF6);
  --success-gradient: linear-gradient(135deg, #10B981, #14B8A6);
  --warning-gradient: linear-gradient(135deg, #F59E0B, #EF4444);
  --card-bg: rgba(255, 255, 255, 0.98);
  --card-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}





.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: rgba(28, 93, 179, 0.5);
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #3B82F6;
}

.clear-search-btn {
  position: absolute;
  right: 100px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px 8px; /* 减小内边距 */
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px; /* 减小圆角 */
  cursor: pointer;
  font-size: 11px; /* 适当调整字体大小 */
  font-weight: 500; /* 增加字体粗细 */
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 1px 3px rgba(239, 68, 68, 0.3); /* 减小阴影 */
  min-width: auto; /* 移除最小宽度 */
  height: 22px; /* 固定高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  background: #dc2626;
  box-shadow: 0 2px 5px rgba(239, 68, 68, 0.4);
}



.clear-text {
  display: inline-block;
  color: rgb(150, 147, 147) !important; /* 确保文字是白色 */
  font-weight: 500;
  line-height: 1;
}
/* 基础样式 */
.forum-container {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #e6eff8;
  color: #333;
  min-height: 100vh;
  line-height: 1.6;
  padding-top: 10px;
  max-width: 100vw !important;
  overflow-x: hidden !important;
  overflow-y: auto; 
  height: 100vh;
  position: relative;
}

/* 导航栏 */
.navbar {
  padding: 12px 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  
  display: flex;
  justify-content: flex-end;
  
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  padding-top: 90px;
}

.header-search {
  max-width: 400px;
  width: 100%;
}

.searchs-boxs {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(247, 218, 250, 0.95);
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.searchs-boxs:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  color: #6b7280;
}

.searchs-boxs input {
  flex: 1;
  padding: 10px 15px 10px 10px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.searchs-boxs input::placeholder {
  color: #9ca3af;
}

.search-button {
  padding: 8px 18px;
  margin: 4px;
  background: linear-gradient(135deg, #10B981, #0EA5E9);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.search-button:hover {
  background: linear-gradient(135deg, #0EA5E9, #10B981);
  transform: translateY(-1px);
}

/* 头部横幅 */
.header-banner {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  background: linear-gradient(135deg, #10B981, #0EA5E9);
  border-radius: 0 0 20px 20px;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: linear-gradient(to bottom, rgba(12, 5, 5, 0.1), rgba(0,0,0,0.3));
}

.banner-icon {
  width: 80px;
  height: 80px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: bounceIn 1s ease;
}

.banner-icon svg {
  width: 50px;
  height: 50px;
  color: white;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.banner-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
  animation: fadeInDown 0.8s ease;
  font-family: 'Comic Sans MS', 'Marker Felt', '微软雅黑', sans-serif;
  letter-spacing: 1px;
}

.banner-subtitle {
  font-size: 18px;
  max-width: 600px;
  color: rgba(255,255,255,0.9);
  opacity: 0.9;
  animation: fadeInUp 0.8s ease 0.2s forwards;
  opacity: 0;
  font-weight: 300;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
}

/* 主要内容区 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 30px;
}

.content-wrapper {
  display: flex;
  gap:40px;
  align-items: flex-start; /* 顶部对齐 */
}

.left-sidebar {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: 60px; /* 距离顶部20px，可以根据导航栏高度调整 */
  align-self: flex-start; /* 确保只占用内容高度 */
  max-height: calc(100vh - 40px); /* 视口高度减去上下边距 */
  overflow-y: auto; /* 如果内容过长可以滚动 */
  
}

.right-content {
  flex: 1;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-icon {
  width: 18px;
  height: 18px;
  color: #10B981;
}

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 分类标签框*/
.category-tags {
  background-color: rgb(249, 236, 251);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(90, 19, 19, 0.079);
  margin-bottom: 20px;
  border: 1px solid #dfe5f1;
}

.tags-container span {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tags-container span.active {
  background: linear-gradient(135deg, #dea5c3, #dc34e5);
  color: rgb(12, 0, 0);
  box-shadow: 0 4px 6px rgba(16,185,129,0.2);
}

.tags-container span:hover:not(.active) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border-radius: 50%;
}

/* 快速操作按钮 */
.quick-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-bottom: 25px;
  
}

/* 按钮美化 */
.action-btn {
  min-width: 160px;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 15px;
}


.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 18px;
  height: 18px;
}

.new-post {
  background: var(--primary-gradient);
  color: white;
}

/* 帖子列表 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

/* 帖子卡片 */
.post-item {
  display: flex;
  gap: 18px;
  padding: 20px;
  background-color: white;
  border-radius: 14px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

/* 奇数帖子样式 */
.post-item:nth-child(odd) {
  background-color: #ffffff; /* 白色背景 */
}

/* 偶数帖子样式 */ 
.post-item:nth-child(even) {
  background-color: #f9fef3; /* 浅灰色背景 */
  border-left: 3px solid #10B981; /* 添加左边框作为装饰 */
}

.post-item.even-item {
  background-color: #f9fafb;
  border-left: 4px solid #10B981;
}

.post-item:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
  border-color: #d1d5db;
}

.post-thumbnail {
  width: 160px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-item:hover .post-thumbnail img {
  transform: scale(1.05);
}

.post-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  position: relative; /* 为绝对定位的标签容器提供参照 */
}

/* 帖子标题样式 */
.post-title {
  font-size: 17px;
  font-weight: 600;
  color: #111827;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px; /* 为标签留出空间 */
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0;
}

.post-tags.right-aligned {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
  font-size: 14px;
  max-width: 40%; /* 限制标签区域宽度 */
}



.post-tag {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}



.tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}


/* 标签颜色映射 - 使用更鲜明的颜色 */
.tag-dog {
  background-color: #3B82F6;
}

.tag-cat {
  background-color: #EC4899;
}

.tag-prevention {
  background-color: #10B981;
}

.tag-treatment {
  background-color: #F59E0B;
}

.tag-nutrition {
  background-color: #14B8A6;
}

.tag-behavior {
  background-color: #6366F1;
}

.post-tags:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

/* 上传区域样式 */
.upload-area {
  order: 1; /* 确保上传按钮在左侧 */
  margin-right: auto; /* 推提交按钮到最右边 */
}

.post-upload-btn {
  padding: 10px 16px;
  background-color: rgba(224,242,254,0.8);
  color: #0369a1;
  border: 1px dashed rgba(3,105,161,0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}
@media (max-width: 768px) {
  .post-modal {
    max-width: 90%;
  }
  
  .modal-heade {
    padding: 20px;
  }
  
  .modal-title {
    font-size: 22px;
  }
  
  .form-container {
    padding: 20px;
    max-height: 50vh;
  }
  
  .form-actions {
    padding: 15px 20px;
  }
}


@media (max-width: 768px) {
  .post-tags.right-aligned {
    position: static;
    justify-content: flex-start;
    margin-top: 4px;
    max-width: 100%;
  }
  
  .post-header {
    flex-direction: column;
  }
  
  .post-title {
    padding-right: 0;
    width: 100%;
  }
}

.post-excerpt {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 10px;
  display: block;
  overflow: hidden;
  max-height: 3em;
  line-height: 1.5em;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #9ca3af;
  margin-top: auto;
  flex-wrap: wrap;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
}

.author-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}
.text-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0EA5E9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  user-select: none;
}
.meta-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
}

/* 帖子详情模态框 */
.post-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* 半透明黑色 */
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 15px;
  overflow-y: auto;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 帖子详情页的父容器 */
.post-detail-modal {
  position: relative;
  background-color: rgba(255,255,255,0.95);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 25px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  animation: slideUp 0.4s ease;
  /* backdrop-filter: blur(10px); */
  border: 1px solid rgba(255,255,255,0.2);
  /* z-index: 1000; 确保父容器在较高层级 */
}

/* @keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
} */

.close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  background: rgba(250, 246, 246, 0.2);
  transition: all 0.3s ease;
  z-index: 1001;
}



.close-btn svg {
  width: 24px;
  height: 24px;
  color: white;
  
}


.close-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: rotate(90deg);
}

.form-container {
  padding: 25px 30px;
  max-height: 60vh;
  overflow-y: auto;
}



.post-detail-title {
  font-size: 24px;
  margin-bottom: 15px;
  color: #111827;
  font-weight: 600;
  line-height: 1.4;
}

.post-detail-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b7280;
  flex-wrap: wrap;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(229,231,235,0.5);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-weight: 500;
  color: #111827;
}

.author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(229,231,235,0.8);
}

.post-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-images-carousel {
  margin: 0 -25px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  
}
.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}

.carousel-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 帖子详情页图片切换左右箭头 */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background-color: rgba(250, 247, 247, 0.5);
  border: 2px solid rgba(8, 8, 8, 0.8);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all 0.3s ease;
  opacity: 1 !important;
}

.carousel-btn:hover {
  background-color: rgba(212, 201, 201, 0.7);
  border-color: white;
}

.carousel-btn svg {
  width: 24px;
  height: 24px;
  color: rgb(168, 45, 45) !important;
  fill: currentColor !important;  
  /* filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
  transition: transform 0.2s ease; */
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.carousel-btn:hover svg {
  transform: scale(1.1);
}

.carousel-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  /* transform: translateY(-50%); */
}

.carousel-btn:disabled:hover svg {
  transform: scale(1);
}

@media (max-width: 768px) {
  .carousel-btn {
    width: 36px;
    height: 36px;
  }
  
  .carousel-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .prev {
    left: 10px;
  }
  
  .next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-btn {
    width: 32px;
    height: 32px;
  }
  
  .carousel-btn svg {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .modal-title {
    font-size: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .tag-selector {
    gap: 8px;
  }
  
  .tag-selector span {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .post-upload-btn,
  .cancel-btn,
  .post-submit-btn {
    padding: 10px 18px;
    font-size: 14px;
  }
  
  .image-preview {
    width: 80px;
    height: 80px;
  }
}



.carousel-dots {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}

.carousel-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dots span.active {
  background-color: white;
  transform: scale(1.2);
}

/* 单张图片样式 */
.post-image {
  display: flex;
  justify-content: center;
  margin: 0 -25px;
}

.post-image img {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 8px;
  cursor: zoom-in;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 文本内容样式 */
.post-text-content {
  line-height: 1.8;
  color: #374151;
}

.post-text-content p {
  margin-bottom: 15px;
  font-size: 15px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .carousel-container {
    height: 250px;
  }
  
  .post-image img {
    max-height: 250px;
  }
  
  .post-images-carousel,
  .post-image {
    margin: 0 -20px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 200px;
  }
  
  .post-image img {
    max-height: 200px;
  }
  
  .carousel-btn {
    width: 30px;
    height: 30px;
  }
  
  .carousel-btn svg {
    width: 18px;
    height: 18px;
  }
}

.post-detail-content p {
  margin-bottom: 15px;
  font-size: 15px;
}

.post-image {
  margin: 20px 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.post-image img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-image:hover img {
  transform: scale(1.02);
}

/* 帖子操作按钮 */
.post-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(229,231,235,0.5);
}

.post-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: rgba(243,244,246,0.8);
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.post-actions button:hover {
  background-color: rgba(229,231,235,0.8);
}

.post-actions button.liked {
  background-color: rgba(219,234,254,0.8);
  color: #1d4ed8;
}

.post-actions button.collected {
  background-color: rgba(254,243,199,0.8);
  color: #b45309;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.liked {
  color: #ff4757 !important;
}

.collected {
  color: #ffa502 !important;
}


/* 点赞动画 */
@keyframes likeAnimation {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1) translateY(-50px);
    opacity: 0;
  }
}

.like-effect {
  animation: likeAnimation 1s forwards;
}

.heart-animation {
  animation: heartFloat 1s ease-out forwards;
}

/* 评论点赞动画 */
@keyframes heartFloat {
  0% { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
  100% { 
    transform: translateY(-80px) scale(1.5); 
    opacity: 0; 
  }
}

/* 优化点赞按钮反馈 */
.post-actions button:focus,
.comment-actions button:focus,
.reply-actions button:focus,
.like-btn:focus,
.reply-btn:focus,
.deletes-btns:focus {
  outline: none !important;
  box-shadow: none !important;
}

.like-btn {
  transition: transform 0.2s;
}

.like-btn:active {
  transform: scale(1.1);
}

.post-actions button,
.comment-actions button {
  transition: all 0.3s ease;
}

.collect-effect {
  position: fixed;
  animation: collectAnimation 1s forwards;
  pointer-events: none;
  z-index: 9999;
}

/* 收藏动画 */
@keyframes collectAnimation {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg) translateY(-50px);
    opacity: 0;
  }
}

.collect-effect {
  animation: collectAnimation 1s forwards;
}

/* 评论区 */
.comment-section {
  margin-top: 25px;
}

.comment-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #111827;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: #4b5563;
}

.comment-input {
  margin-bottom: 25px;
  position: relative;
}
.comment-input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.comment-input textarea {
  width: 100%;
  min-height: 80px; /* 设置最小高度 */
  max-height: 200px; /* 设置最大高度 */
  padding: 12px 16px;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 10px;
  resize: vertical; /* 允许垂直调整大小 */
  font-family: inherit;
  font-size: 14px;
  color: #374151;
  transition: all 0.3s ease;
  background-color: rgba(249, 250, 251, 0.8);
  box-sizing: border-box;
  overflow-y: auto; /* 添加滚动条 */
}

.comment-input textarea:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147,197,253,0.2);
}

textarea {
  min-height: 40px;
  max-height: 200px;
  resize: none;
  overflow-y: hidden;
  transition: height 0.2s ease;
}
.like-btn {
  padding: 4px 10px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748b;
  transition: all 0.2s ease;
}

.like-btn:hover {
  color: #ef4444;
}

.like-btn.liked {
  color: #ef4444;
}

.like-btn .action-icon {
  width: 16px;
  height: 16px;
}

.like-btn.liked .action-icon path {
  fill: #ef4444;
}



.upload-area button {
  padding: 6px 12px;
  background-color: rgba(243,244,246,0.8);
  border: 1px dashed rgba(209,213,219,0.8);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4b5563;
}

.upload-area button:hover {
  background-color: rgba(229,231,235,0.8);
  border-color: #9ca3af;
}

.upload-icon {
  width: 18px;
  height: 18px;
  color: white;
}


/* 图片预览区域 */
.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 15px;
}


.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.image-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 24px;
  height: 24px;
  background-color: rgba(239,68,68,0.9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  transition: all 0.2s ease;
}

.remove-image:hover {
  background-color: #dc2626;
  transform: scale(1.1);
}

.remove-image svg {
  width: 16px;
  height: 16px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(16,185,129,0.3);
}

.submit-icon {
  width: 16px;
  height: 16px;
}


/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-item {
  padding: 15px;
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 10px;
  position: relative;
  border: 1px solid rgba(199, 203, 211, 0.8);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(229,231,235,0.8);
}

.comment-author-info {
  display: flex;
  flex-direction: column;
}

.comment-author {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #9ca3af;
}

.comment-content {
  line-height: 1.7;
  color: #374151;
  font-size: 14px;
  margin-bottom: 12px;
}

/* 评论中显示的图片 */
.comment-images {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.comment-image {
  max-width: 150px;
  max-height: 150px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(229,231,235,0.8);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.comment-image:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.comment-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.reply-btn {
  padding: 4px 10px;
  font-size: 12px;
  background-color: rgba(224,242,254,0.8);
  color: #0369a1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.reply-btn:hover {
  background-color: rgba(186,230,253,0.8);
}

.reply-icon {
  width: 12px;
  height: 12px;
}

/* 回复弹窗 */
.reply-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  animation: fadeIn 0.3s ease;
}

.reply-modal {
  position: relative;
  background-color: rgba(255,255,255,0.95);
  border-radius: 10px;
  width: 100%;
  max-width: 450px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  box-sizing: border-box;
  animation: slideUp 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.reply-modal h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #111827;
  font-size: 16px;
  padding: 0 8px;
}

.reply-modal textarea {
  width: calc(100% - 16px);
  min-height: 100px;
  padding: 10px;
  margin: 0 8px 12px;
  border: 1px solid rgba(229,231,235,0.8);
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  font-size: 14px;
  color: #374151;
  transition: all 0.3s ease;
  background-color: rgba(249,250,251,0.8);
}

.reply-modal textarea:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147,197,253,0.2);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 8px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: rgba(243,244,246,0.8);
  color: #4b5563;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cancel-btn:hover {
  background-color: rgba(229,231,235,0.8);
}

.cancel-btn svg {
  width: 18px;
  height: 18px;
}


/* 图片预览弹窗 */
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.9);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

.image-preview-modal {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  animation: zoomIn 0.3s ease;
}

/* 嵌套回复样式 */
.nested-replies {
  margin-left: 40px;
  padding-left: 15px;
  border-left: 2px solid #e5e7eb;
  margin-top: 15px;
}

.nested-item {
  background-color: rgba(249,250,251,0.5);
  margin-top: 10px;
}

.is-reply {
  margin-left: 40px;
}

.reply-to {
  color: #3B82F6;
  font-weight: 500;
  cursor: pointer;
}

.reply-to:hover {
  text-decoration: underline;
}

.self-reply {
  background-color: rgba(239, 246, 255, 0.5);
  border-left: 3px solid #3B82F6;
}

.is-reply.self-reply {
  /* 如果是回复又是自我回复的特殊样式 */
  border-left-color: #10B981; /* 绿色左边框 */
}

@media (max-width: 768px) {
  .nested-replies, .is-reply {
    margin-left: 20px;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.image-preview-modal img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .left-sidebar {
    position: static;
    width: 100%;
    max-height: none;
    margin-bottom: 20px;
  }
  
  .header-banner {
    height: 250px;
  }
  
  .banner-title {
    font-size: 32px;
  }
  
  .banner-subtitle {
    font-size: 16px;
  }
  
  .navbar {
    position: sticky;
    top: 0;
    
    /* 其他样式保持不变 */
  }
  
  .searchs-boxs input {
    padding: 8px 12px 8px 8px;
    font-size: 13px;
  }
  
  .search-button {
    padding: 6px 14px;
    font-size: 13px;
  }
  
  .post-item {
    flex-direction: column;
  }
  
  .post-thumbnail {
    width: 100%;
    height: 160px;
  }
  
  .post-meta {
    gap: 10px;
    font-size: 12px;
  }
  
  .post-detail-modal {
    padding: 20px;
  }
  
  .post-detail-title {
    font-size: 20px;
  }
  
  .post-detail-meta {
    gap: 10px;
    font-size: 13px;
  }
  
  .comment-image {
    max-width: 120px;
    max-height: 120px;
  }
  
  .reply-modal {
    padding: 15px;
  }
  
  .quick-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .header-banner {
    height: 200px;
  }
  
  .banner-title {
    font-size: 28px;
  }
  
  .banner-subtitle {
    font-size: 14px;
  }
  
  .post-detail-overlay {
    padding: 15px 8px;
  }
  
  .comment-item {
  margin-bottom: 15px;
  transition: all 0.3s ease;
  }

  .comment-item:hover {
  background-color: rgba(249, 250, 251, 0.9);
  } 
  
  .comment-avatar {
    width: 30px;
    height: 30px;
  }
  
  .comment-content {
    font-size: 13px;
  }
  
  .comment-image {
    max-width: 100px;
    max-height: 100px;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    min-width: 140px;
    padding: 12px 20px;
    font-size: 14px;
  }
}

/* 发布帖子弹窗 */
.post-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.4s ease;
  background: rgba(0, 0, 0, 0.5); /* 半透明黑色 */
  backdrop-filter: blur(8px); /* 毛玻璃效果 */
}

.post-modal {
  position: relative;
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 650px;
  padding: 0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  border: none;
  
}

.modal-heade {
  padding: 25px 30px;
  background: linear-gradient(135deg, #FF7043, #FFA726);
  color: white;
  position: relative;
}
.modal-heade::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    #FF7043 0%, 
    #FFA726 20%, 
    #66BB6A 40%, 
    #42A5F5 60%, 
    #5C6BC0 80%, 
    #EC407A 100%);
}

.modal-title {
  font-size: 26px;
  margin: 0 0 5px 0;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.modal-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}


.modal-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #10B981, #0EA5E9);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 25px;
}


.form-group label {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
  font-size: 15px;
  gap: 10px;
}

.label-icon {
  width: 20px;
  height: 20px;
}

.input-wrapper {
  position: relative;
}

.char-counter {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #9CA3AF;
  background: white;
  padding: 0 5px;
  border-radius: 4px;
}


.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  color: #374151;
  transition: all 0.3s ease;
  background-color: white;
  box-sizing: border-box;
}

.form-group input[type="text"] {
  height: 50px;
  padding-right: 60px;
}

.form-group textarea {
  min-height: 120px;
  max-height: 200px;
  resize: vertical;
  line-height: 1.6;
  overflow-y: auto;
}


.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42A5F5;
  box-shadow: 0 0 0 4px rgba(66, 165, 245, 0.2);
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147,197,253,0.2);
  background-color: white;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}


.tag-selector span {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  background-color: #F3F4F6;
  color: #4B5563;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
}


.tag-selector span.active {
  background: linear-gradient(135deg, #e49be2, #d129d1b5);
  color: white;
  box-shadow: 0 4px 10px rgba(66, 165, 245, 0.3);
  border-color: transparent;
  transform: translateY(-2px);
}

.tag-selector span:hover:not(.active) {
  background-color: #E5E7EB;
  transform: translateY(-1px);
}


.tag-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border-radius: 50%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 30px;
  background: #F9FAFB;
  border-top: 1px solid #E5E7EB;
}


.cancel-btn {
  padding: 12px 24px;
  background-color: white;
  color: #4B5563;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.cancel-btn:hover {
  background-color: #F3F4F6;
  border-color: #D1D5DB;
}

.submit-btn {
  padding: 12px 24px;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(135deg, #9ca3af, #6b7280);
}

.submit-icon {
  width: 16px;
  height: 16px;
}

/* 响应式调整 */
/* 响应式调整 */
@media (max-width: 600px) {
  .post-modal {
    padding: 25px 20px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .tag-selector {
    gap: 8px;
  }
  
  .tag-selector span {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .form-actions {
    margin-top: 25px;
  }
  
  .cancel-btn,
  .post-submit-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}



/* 发布帖子提交按钮 */
.post-submit-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #66BB6A, #42A5F5);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 187, 106, 0.3);
}

.post-submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #42A5F5, #66BB6A);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 187, 106, 0.4);
}

.post-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: linear-gradient(135deg, #9CA3AF, #6B7280);
}

.post-submit-btn svg {
  width: 18px;
  height: 18px;
  color: white;
}
/* 评论提交按钮 */
.comment-submit-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #EC4899, #F59E0B);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(236, 72, 153, 0.2);
  order: 2; /* 确保按钮在右侧 */
}

.comment-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(236, 72, 153, 0.3);
}

/* 回复提交按钮 */
.reply-submit-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
}

.reply-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(99, 102, 241, 0.3);
}

/* 发布帖子上传按钮 */
.post-upload-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #EC407A, #FF7043);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(236, 64, 122, 0.2);
}

.post-upload-btn:hover {
  background: linear-gradient(135deg, #FF7043, #EC407A);
  box-shadow: 0 6px 8px rgba(236, 64, 122, 0.3);
}


/* 评论上传按钮 */
.comment-upload-btn {
  padding: 6px 12px;
  background-color: rgba(239, 246, 255, 0.8);
  color: #3B82F6;
  border: 1px dashed rgba(59, 130, 246, 0.5);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.comment-upload-btn:hover {
  background-color: rgba(219, 234, 254, 0.8);
  border-color: #3B82F6;
}

/* 回复上传按钮 */
.reply-upload-btn {
  padding: 6px 12px;
  background-color: rgba(238, 242, 255, 0.8);
  color: #4F46E5;
  border: 1px dashed rgba(79, 70, 229, 0.5);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.reply-upload-btn:hover {
  background-color: rgba(224, 231, 255, 0.8);
  border-color: #4F46E5;
}
/* 新增删除按钮样式 */
.deletes-btns {
  padding: 8px 16px;
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 14px;
}

.deletes-btns:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

.deletes-btns svg {
  width: 16px;
  height: 16px;
}

/* 删除确认弹窗 */
.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.delete-confirm-modal {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.delete-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
}

.delete-icon svg {
  width: 36px;
  height: 36px;
}

.delete-confirm-modal h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #1F2937;
}

.delete-confirm-modal p {
  color: #6B7280;
  margin-bottom: 25px;
  line-height: 1.6;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #F3F4F6;
  color: #4B5563;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #E5E7EB;
}

.confirm-delete-btn {
  padding: 10px 20px;
  background-color: #EF4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.confirm-delete-btn:hover {
  background-color: #DC2626;
}


/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.pagination button {
  padding: 8px 16px;
  min-width: 44px;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #4b5563;
}
.pagination button:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.pagination button.active {
  background: linear-gradient(135deg, #10B981, #0EA5E9);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 6px rgba(16,185,129,0.2);
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
/* 确保按钮可点击 */
.pagination button:not(:disabled) {
  cursor: pointer;
  pointer-events: auto;
}



/* 加载样式 */
.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination-info {
  text-align: center;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}


.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9CA3AF;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}
.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
  /* 添加以下样式改善触摸体验 */
  touch-action: pan-y;
  user-select: none;
}

.carousel-slide img {
  /* 防止图片被长按选中 */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* 添加滑动指示器动画 */
.carousel-track.swiping {
  transition: none;
}
.forum-header {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border-radius: 0 0 30px 30px;
  padding: 15px 20px 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.decorative-banner {
  position: absolute;
  top: 0px;

  left: 0;
  right: 0;
  height: 10px;
  display: flex;
  justify-content: center;


}

.pet-paws {
  display: flex;
  gap: 30px;
  animation: bounce 2s infinite ease-in-out;
  
}

.pet-paws span {
  font-size: 18px;
  opacity: 0.7;
}

.header-main {
  max-width: 100vw;
  box-sizing: border-box;
  padding: 0 20px;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  
}

.header-pets {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  max-width: 25%;
}

.floating-pet {
  flex-shrink: 0;
  font-size: clamp(20px, 2.5vw, 28px); /* 响应式字体大小 */
  animation: float 3s infinite ease-in-out;
}

.floating-pet.cat {
  animation-delay: 0s;
  color: #ff6b6b;
}

.floating-pet.dog {
  animation-delay: 0.5s;
  color: #4ecdc4;
}

.floating-pet.rabbit {
  animation-delay: 1s;
  color: #ffbe76;
}

.floating-pet.bird {
  animation-delay: 1.5s;
  color: #a29bfe;
}

.floating-pet.fish {
  animation-delay: 2s;
  color: #74b9ff;
}

.floating-pet.hamster {
  animation-delay: 2.5s;
  color: #fd79a8;
}

.header-center {
  text-align: center;
  flex-grow: 1;
  padding: 0 20px;
}

.forum-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3436;
  margin: 16px 0 10px;
  text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.5);
  background: linear-gradient(45deg, #6c5ce7, #fd79a8, #fdcb6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.forum-subtitle {
  font-size: 1rem;
  color: #636e72;
  margin: 0;
  font-weight: 500;
}

.search-section {
  display: flex;
  justify-content: flex-end; /* 将搜索框靠右对齐 */
  margin-bottom: 20px;
  padding: 0 20px;
}

.searchs-boxs {
  width: 100%; /* 使用相对宽度 */
  max-width: 350px; /* 设置最大宽度 */
  /* 其他样式保持不变 */
}

.searchs-boxs {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 5px;
}

.searchs-boxs:focus-within {
  border-color: #fd79a8;
  box-shadow: 0 8px 25px rgba(253, 121, 168, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  color: #fd79a8;
  flex-shrink: 0;
}

.searchs-boxs input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #2d3436;
  outline: none;
}

.searchs-boxs input::placeholder {
  color: #b2bec3;
}


.search-button {
  padding: 10px 24px;
  background: linear-gradient(45deg, #6c5ce7, #fd79a8);
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(108, 92, 231, 0.4);
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  
  .header-main {
    gap: 20px; /* 在小屏幕上进一步减少间距 */
  }

  
  .header-pets {
    flex-direction: row;
    order: 3;
    margin-top: 15px;
  }
  
  .forum-title {
    font-size: 2rem;
  }
  
  .searchs-boxs {
    flex-direction: column;
    border-radius: 20px;
    padding: 10px;
  }
  
  .searchs-boxs input {
    width: 100%;
    margin: 10px 0;
  }
  
  .search-button {
    width: 100%;
    justify-content: center;
  }
}
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.pagination {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.page-btn {
  padding: 8px 16px;
  min-width: 44px;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #4b5563;
}

.page-btn:hover:not(:disabled):not(.ellipsis) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.page-btn.active {
  background: linear-gradient(135deg, #10B981, #0EA5E9);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 6px rgba(16,185,129,0.2);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.ellipsis {
  cursor: default;
  background: transparent;
  border: none;
  min-width: auto;
}

.page-btn.ellipsis:hover {
  background: transparent;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.page-jump input {
  width: 60px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: center;
}

.page-jump button {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-jump button:hover {
  background-color: #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    gap: 6px;
  }
  
  .page-btn {
    padding: 6px 12px;
    min-width: 40px;
    font-size: 13px;
  }
  
  .page-jump {
    flex-wrap: wrap;
    justify-content: center;
  }
}
.decorative-banner {
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .decorative-banner {
    opacity: 0.6;
  }
}
</style>
