<template>
  <div class="forum-container">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="header-search">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
          <input 
            type="text" 
            placeholder="搜索帖子、问题或关键词..." 
            v-model="searchQuery" 
            @keyup.enter="searchPosts"
            @input="handleSearchInput"
          >
          <button class="search-button" @click="searchPosts">
            <span>搜索</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 横幅 -->
    <div class="header-banner">
      <div class="banner-overlay">
        <div class="banner-icon">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,7H18V5H20V7Z" />
          </svg>
        </div>
        <h1 class="banner-title">宠物交流社区</h1>
        <p class="banner-subtitle">分享经验 · 获取专业建议 · 共同关爱宠物健康</p>
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

          <!-- 在帖子列表上方添加 -->
          <div class="search-results-info" v-if="searchQuery.trim()">
            <span>搜索"{{ searchQuery }}"的结果 ({{ filteredPosts.length }}条)</span>
            <button @click="clearSearch" class="clear-search-btn">清除搜索</button>
          </div>

          <!-- 帖子列表 -->
          <div class="post-list">
            <div class="post-item" 
              v-for="post in paginatedPosts" :key="post.id" 
              @click="viewPost(post.id)"
            >
              <div class="post-thumbnail" v-if="post.thumbnail">
                <img :src="post.thumbnail" :alt="post.title">
              </div>
              <div class="post-content">
                <div class="post-header">
                    <span class="post-title">{{ post.title || post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '') }}</span>
                  <div class="post-tags right-aligned" v-if="post.tags && post.tags.length > 0">
                    <span 
                      class="post-tag" 
                      v-for="tag in post.tags" 
                      :key="tag"
                      :style="{ backgroundColor: getTagColor(tag), color: '#fff' }"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <div class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</div>
                <div class="post-meta">
                  <span class="post-author">
                    <img :src="post.authorAvatar || defaultAvatar" class="author-avatar">
                    {{ post.author }}
                  </span>
                  <span class="post-time">{{ post.time }}</span>
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

          <!-- 分页控件 -->
          <div class="pagination">
            <button 
              v-for="page in totalPages" 
              :key="page" 
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
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
            <img :src="currentPost.authorAvatar || defaultAvatar" class="author-avatar">
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
          <div class="post-images-carousel" v-if="currentPost.images && currentPost.images.length > 1">
            <div class="carousel-container">
              <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <div class="carousel-slide" v-for="(image, index) in currentPost.images" :key="index">
                  <img :src="image.url" :alt="'图片' + (index + 1)" @click="showImagePreview(image.url)">
                </div>
              </div>
              <button class="carousel-btn prev" @click="prevSlide" :disabled="currentSlide === 0">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.42z" />
                </svg>
              </button>

              <!-- 右箭头 -->
              <button class="carousel-btn next" @click="nextSlide" :disabled="currentSlide === currentPost.images.length - 1">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.42z" />
                </svg>
              </button>
              <!-- <div class="carousel-dots" v-if="currentPost.images.length > 1">
                <span v-for="(image, index) in currentPost.images" 
                      :key="index" 
                      :class="{ active: index === currentSlide }"
                      @click="goToSlide(index)"></span>
              </div> -->
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
          <button @click="likePost" :class="{ liked: currentPost.isLiked }">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path fill="currentColor" :d="currentPost.isLiked ? 'M23,10C23,8.89 22.1,8 21,8H14.68L15.64,3.43C15.66,3.33 15.67,3.22 15.67,3.11C15.67,2.7 15.5,2.32 15.23,2.05L14.17,1L7.59,7.58C7.22,7.95 7,8.45 7,9V19A2,2 0 0,0 9,21H18C18.83,21 19.54,20.5 19.84,19.78L22.86,12.73C22.95,12.5 23,12.26 23,12V10M1,21H5V9H1V21Z' : 'M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z'" />
            </svg>
            <span>点赞 ({{ currentPost.likes }})</span>
          </button>
          <button @click="collectPost" :class="{ collected: currentPost.isCollected }">
            <svg viewBox="0 0 24 24" class="action-icon">
              <path fill="currentColor" :d="currentPost.isCollected ? 'M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z' : 'M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z'" />
            </svg>
            <span>收藏 ({{ currentPost.collections }})</span>
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
                <img :src="comment.authorAvatar || defaultAvatar" class="comment-avatar">
                <div class="comment-author-info">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-time">{{ comment.time }}</span>
                </div>
              </div>


              <div class="comment-content">
                <template v-if="comment.parentId">
                  回复 <span class="reply-to">@{{ getCommentAuthor(comment.parentId) }}</span>: 
                </template>
                {{ comment.content }}
              </div>

              <div class="comment-images" v-if="comment.images && comment.images.length > 0">
                <img 
                  v-for="(image, index) in comment.images" 
                  :key="index" 
                  :src="image.url" 
                  class="comment-image"
                  @click="showImagePreview(image.url)"
                >
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
  </div>

  
  <!-- 发布帖子模态框 -->
  <div class="post-overlay" v-if="showNewPostModal" @click.self="closeNewPostModal">
    <div class="post-modal">
      <span class="close-btn" @click="closeNewPostModal">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </span>
      
      <div class="modal-header">
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
            placeholder="详细描述你的问题或分享经验...支持Markdown格式"
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


export default {
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

      currentSlide: 0, 

      currentTag: 'all',
      postsPerPage: 10, // 每页显示的帖子数量
      currentPage: 1,

      showNewPostModal: false,
      newPostTitle: '',
      newPostContent: '',
      newPostImages: [],
      newPostSelectedTag:[] ,

      defaultAvatar: 'https://via.placeholder.com/40',
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
      posts: [
        {
          id: 1,
          title: '幼犬接种疫苗的注意事项及常见问题解答',
          author: '王兽医',
          authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          time: '2023-05-15 10:30',
          views: 1250,
          comments: 32,
          excerpt: '幼犬疫苗接种是保障狗狗健康的重要环节，但很多新手家长对疫苗接种的时间和注意事项不太了解，本文将详细介绍幼犬疫苗接种的流程和常见问题...',
          content: '幼犬疫苗接种是保障狗狗健康的重要环节，但很多新手家长对疫苗接种的时间和注意事项不太了解。本文将详细介绍幼犬疫苗接种的流程和注意事项。\n\n1. 疫苗接种时间表：\n- 6-8周：首次接种犬瘟热、细小病毒等核心疫苗\n- 10-12周：第二次接种，加强免疫效果\n- 14-16周：第三次接种，完成基础免疫程序\n- 1年后：年度加强免疫\n\n2. 注意事项：\n- 接种前确保幼犬健康，无发热、腹泻等症状\n- 接种后观察30分钟，防止过敏反应\n- 接种后24小时内避免剧烈运动和洗澡\n- 保持接种部位的清洁干燥\n\n3. 常见不良反应：\n- 轻微发热、食欲下降（1-2天可恢复）\n- 接种部位轻微肿胀（通常3天内消退）\n- 若出现严重过敏反应（如呼吸困难、面部肿胀）应立即就医',
          thumbnail: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
          likes: 45,
          isLiked: false,
          collections: 12,
          isCollected: false,
          tag: '犬科',
          image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80'
        },
        {
          id: 2,
          title: '猫咪绝育手术后的护理指南：从术前准备到术后恢复',
          author: '李医生',
          authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          time: '2023-05-14 15:20',
          views: 980,
          comments: 18,
          excerpt: '猫咪绝育手术后需要特别的护理，本文将介绍术前准备、术后护理的要点和常见问题，帮助猫咪顺利恢复...',
          content: '猫咪绝育手术后需要特别的护理，本文将介绍术前准备、术后护理的要点和常见问题。\n\n术前准备：\n- 术前8-12小时禁食，4小时禁水\n- 准备舒适的猫窝和干净的猫砂盆\n- 提前修剪猫咪指甲，防止术后抓挠伤口\n\n术后护理：\n- 保持环境安静，避免剧烈运动\n- 佩戴伊丽莎白圈防止舔舐伤口\n- 按医嘱给予止痛药和抗生素\n- 观察伤口是否有红肿、渗液等异常\n- 术后24小时后可少量喂食易消化食物\n\n常见问题：\nQ: 猫咪术后不吃不喝怎么办？\nA: 可能是麻醉后反应，可尝试喂食罐头或加热食物刺激食欲\n\nQ: 伤口多久能愈合？\nA: 通常7-10天拆线，公猫恢复更快\n\nQ: 术后行为异常怎么办？\nA: 麻醉完全代谢需要24-48小时，期间可能出现走路不稳、嗜睡等情况',
          thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
          likes: 30,
          isLiked: false,
          collections: 8,
          isCollected: false,
          tag: '猫科',
          image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80'
        },
        {
          id: 3,
          title: '如何识别宠物皮肤病？常见症状与家庭处理方法',
          author: '张兽医',
          authorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          time: '2023-05-13 09:10',
          views: 2100,
          comments: 56,
          excerpt: '宠物皮肤病是常见问题，早期识别和治疗非常重要。本文将介绍常见皮肤病的症状、原因和家庭处理方法...',
          content: '宠物皮肤病是常见问题，早期识别和治疗非常重要。本文将介绍常见皮肤病的症状、原因和家庭处理方法。\n\n常见皮肤病类型：\n1. 过敏性皮炎\n- 症状：剧烈瘙痒、皮肤发红、脱毛\n- 原因：食物过敏、环境过敏原\n\n2. 真菌感染（如癣菌病）\n- 症状：圆形脱毛、皮屑、红斑\n- 原因：真菌感染，具有传染性\n\n3. 寄生虫感染（如螨虫）\n- 症状：剧烈瘙痒、结痂、皮肤增厚\n- 原因：疥螨、蠕形螨等寄生虫\n\n家庭处理方法：\n- 定期梳毛，检查皮肤状况\n- 使用宠物专用沐浴露\n- 保持环境干燥清洁\n- 补充Omega-3脂肪酸改善皮肤健康\n\n何时就医：\n- 症状持续超过3天\n- 出现大面积脱毛或溃烂\n- 宠物明显不适或食欲下降\n- 家庭治疗无效时',
          thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
          likes: 78,
          isLiked: false,
          collections: 25,
          isCollected: false,
          tag: '疾病预防',
          image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80'
        },
        {
          id: 4,
          title: '宠物营养指南：如何为不同年龄段的狗狗选择合适食物',
          author: '营养师陈',
          authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
          time: '2023-05-12 14:45',
          views: 870,
          comments: 22,
          excerpt: '不同年龄段的狗狗对营养需求各不相同，本文将详细介绍幼犬、成犬和老年犬的营养需求及食物选择建议...',
          content: '不同年龄段的狗狗对营养需求各不相同，本文将详细介绍幼犬、成犬和老年犬的营养需求及食物选择建议。\n\n1. 幼犬（0-12个月）\n- 营养需求：高蛋白、高热量、易消化\n- 推荐食物：幼犬专用粮、煮熟的鸡肉、蛋黄\n- 喂养频率：每天3-4次\n\n2. 成犬（1-7岁）\n- 营养需求：均衡蛋白质、适量脂肪和碳水化合物\n- 推荐食物：优质成犬粮、蔬菜、水果（如胡萝卜、苹果）\n- 喂养频率：每天2次\n\n3. 老年犬（7岁以上）\n- 营养需求：低热量、高纤维、关节保健成分\n- 推荐食物：老年犬专用粮、鱼类、南瓜\n- 喂养频率：每天2-3次少量多餐\n\n注意事项：\n- 避免喂食巧克力、葡萄、洋葱等有毒食物\n- 根据活动量调整喂食量\n- 提供充足清洁饮水\n- 定期监测体重，防止肥胖',
          thumbnail: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
          likes: 42,
          isLiked: false,
          collections: 15,
          isCollected: false,
          tag: '营养饮食',
          image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80'
        },
        {
          id: 5,
          title: '解决猫咪乱尿问题的实用技巧与行为矫正方法',
          author: '行为学家刘',
          authorAvatar: 'https://randomuser.me/api/portraits/men/53.jpg',
          time: '2023-05-11 11:20',
          views: 1560,
          comments: 34,
          excerpt: '猫咪乱尿是常见行为问题，可能由多种原因引起。本文将分析常见原因并提供实用解决方案...',
          content: '猫咪乱尿是常见行为问题，可能由多种原因引起。本文将分析常见原因并提供实用解决方案。\n\n常见原因：\n1. 医疗问题\n- 尿路感染、膀胱炎、结石等\n- 解决方案：及时就医检查\n\n2. 猫砂盆问题\n- 猫砂盆不干净、位置不合适、猫砂类型不喜欢\n- 解决方案：\n  - 每天清理猫砂盆\n  - 提供多个猫砂盆（数量=猫数量+1）\n  - 尝试不同猫砂类型\n\n3. 压力或焦虑\n- 环境变化、新宠物、陌生人\n- 解决方案：\n  - 提供安全隐蔽空间\n  - 使用费洛蒙扩散剂\n  - 保持规律作息\n\n4. 标记行为\n- 未绝育公猫常见\n- 解决方案：尽早绝育\n\n行为矫正技巧：\n- 彻底清洁被尿区域（使用酶清洁剂）\n- 在被尿区域放置食盆或猫床\n- 提供垂直空间（猫树、架子）\n- 避免惩罚，采用正向强化',
          thumbnail: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80',
          likes: 63,
          isLiked: false,
          collections: 28,
          isCollected: false,
          tag: '行为问题',
          image: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80'
        }
      ],
      currentPage: 1,
      totalPages: 5,
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
      isLiked: false   // 当前用户是否已点赞
    }
  },
   
  created() {
    // 保存原始帖子数据
    this.originalPosts = [...this.posts];
  },
   computed: {

    paginatedPosts() {
      const start = (this.currentPage - 1) * this.postsPerPage;
      const end = start + this.postsPerPage;
      return this.filteredPosts.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    },

    filteredPosts() {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.trim().toLowerCase();
      return this.originalPosts.filter(post => {
        return (
          (post.title && post.title.toLowerCase().includes(query)) ||
          (post.content && post.content.toLowerCase().includes(query)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query))) ||
          post.author.toLowerCase().includes(query)
        );
      });
    }
    
    if (this.currentTag === 'all') {
      return this.posts;
    }
    
    const selectedTagName = this.tags.find(tag => tag.id === this.currentTag)?.name;
    return this.posts.filter(post => 
      post.tags && post.tags.includes(selectedTagName)
    );
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
      this.posts = [...this.originalPosts];
      this.isSearching = false;
    },

    handleSearchInput() {
      // 如果搜索框为空，恢复原始数据
      if (!this.searchQuery.trim()) {
        this.currentPage = 1;
      }
    },


    searchPosts() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) {
        this.posts = [...this.originalPosts];
        this.isSearching = false;
        return;
      }
      this.isSearching = true;
    
        // 搜索逻辑 - 在标题、内容、标签和作者中查找匹配项
        this.posts = this.originalPosts.filter(post => {
          return (
            post.title.toLowerCase().includes(query) ||
            (post.content && post.content.toLowerCase().includes(query)) ||
            post.tag.toLowerCase().includes(query) ||
            post.author.toLowerCase().includes(query)
          );
        });
        
        // 重置分页到第一页
        this.currentPage = 1;
  
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
    
    handlePostImageUpload(e) {
      const files = e.target.files;
      if (files.length === 0) return;
      
      // 限制最多5张图片
      if (this.newPostImages.length + files.length > 5) {
        alert('最多只能上传5张图片');
        return;
      }
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) {
          alert('请上传图片文件');
          continue;
        }
        
        // 检查图片大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB');
          continue;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.newPostImages.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
      
      // 清空input值，允许重复选择同一文件
      this.$refs.postFileInput.value = '';
    },
    
    removePostImage(index) {
      this.newPostImages.splice(index, 1);
    },
    
    async submitNewPost() {
      // 移除标题验证
      if (!this.newPostContent.trim() && this.newPostImages.length === 0) {
        alert('帖子内容或图片不能为空');
        return;
      }
      
      if (this.newPostSelectedTag.length === 0) {
        alert('请选择至少一个帖子标签');
        return;
      }
      
      // 上传图片到服务器（模拟）
      const uploadedImages = await this.uploadImages(this.newPostImages);
      
      // 创建新帖子
      const newPost = {
        id: this.posts.length + 1,
        title: this.newPostTitle.trim() || '', // 允许空标题
        author: '当前用户',
        authorAvatar: this.defaultAvatar,
        time: new Date().toLocaleString(),
        views: 0,
        comments: 0,
        content: this.newPostContent,
        images: uploadedImages,
        thumbnail: uploadedImages.length > 0 ? uploadedImages[0].thumbnail : null,
        likes: 0,
        isLiked: false,
        collections: 0,
        isCollected: false,
        tags: this.newPostSelectedTag.map(tagId => {
          const tag = this.tags.find(t => t.id === tagId);
          return tag ? tag.name : '';
        }).filter(name => name)
      };
      
      // 添加到帖子列表开头
      this.posts.unshift(newPost);
      this.originalPosts.unshift(newPost);
      
      this.closeNewPostModal();
    },

    uploadImages(images) {
      return new Promise(resolve => {
        // 模拟上传延迟
        setTimeout(() => {
          const result = images.map(img => ({
            url: img.preview, // 实际项目中应该是服务器返回的URL
            thumbnail: img.preview
          }));
          resolve(result);
        }, 500);
      });
    },

    toggleLike(comment, event) {
        // 确保likes是数字类型，默认为0
        const currentLikes = Number(comment.likes) || 0;
        const isLiked = !comment.isLiked;
        
        // 创建新对象确保Vue响应性
        const updatedComment = {
          ...comment,
          isLiked,
          likes: isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1) // 确保不小于0
        };

        // 递归更新评论列表
        const updateComments = (comments) => {
          return comments.map(c => {
            if (c.id === comment.id) {
              return updatedComment;
            }
            if (c.replies && c.replies.length > 0) {
              return {
                ...c,
                replies: updateComments(c.replies)
              };
            }
            return c;
          });
        };

        this.comments = updateComments(this.comments);
        
        // 点赞动画
        if (isLiked && event) {
          this.playLikeAnimation(event);
        }
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
    
    playLikeAnimation(event) {
      const heart = document.createElement('div');
      heart.className = 'heart-animation';
      heart.innerHTML = '❤️';
      heart.style.left = `${event.clientX - 10}px`;
      heart.style.top = `${event.clientY - 10}px`;
      document.body.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1000);
    },

    searchPosts() {
      console.log('搜索:', this.searchQuery);
      // 实际项目中这里会有搜索逻辑
    },
    selectTag(tagId) {
      this.currentTag = tagId;
      // 重置到第一页
      this.currentPage = 1;
      
      // 如果选择"全部"标签，则显示所有帖子
      if (tagId === 'all') {
        return;
      }
      
      // 实际项目中这里会有API请求获取对应标签的帖子
      // 这里我们只是在前端过滤
    },
    changePage(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.currentPost.images.length;
    },
    
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.currentPost.images.length) % this.currentPost.images.length;
    },
    
    goToSlide(index) {
      this.currentSlide = index;
    },

    viewPost(postId) {
      this.currentPost = this.posts.find(post => post.id === postId);
      this.currentSlide = 0; // 重置轮播图索引
      this.showPostDetail = true;
      document.body.style.overflow = 'hidden';
      
      // 模拟增加浏览量
      this.currentPost.views++;
    },

    closeModal() {
      this.showPostDetail = false;
      document.body.style.overflow = '';
      this.commentImages = [];
    },
    likePost() {
      this.currentPost.isLiked = !this.currentPost.isLiked;
      this.currentPost.likes += this.currentPost.isLiked ? 1 : -1;
      
      // 点赞特效
      if (this.currentPost.isLiked) {
        this.createLikeEffect();
      }
    },
    collectPost() {
      this.currentPost.isCollected = !this.currentPost.isCollected;
      this.currentPost.collections += this.currentPost.isCollected ? 1 : -1;
      
      // 收藏特效
      if (this.currentPost.isCollected) {
        this.createCollectEffect();
      }
    },
    createLikeEffect(event) {
      const effect = document.createElement('div');
      effect.className = 'like-effect';
      effect.innerHTML = '❤️';
      effect.style.position = 'fixed';
      effect.style.fontSize = '30px';
      effect.style.pointerEvents = 'none';
      effect.style.left = (event.clientX - 15) + 'px';
      effect.style.top = (event.clientY - 15) + 'px';
      effect.style.animation = 'likeAnimation 1s forwards';
      document.body.appendChild(effect);
      
      setTimeout(() => {
        effect.remove();
      }, 1000);
    },
    createCollectEffect() {
      const effect = document.createElement('div');
      effect.className = 'collect-effect';
      effect.innerHTML = '⭐';
      effect.style.position = 'fixed';
      effect.style.fontSize = '30px';
      effect.style.pointerEvents = 'none';
      effect.style.left = (event.clientX - 15) + 'px';
      effect.style.top = (event.clientY - 15) + 'px';
      effect.style.animation = 'collectAnimation 1s forwards';
      document.body.appendChild(effect);
      
      setTimeout(() => {
        effect.remove();
      }, 1000);
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
    handleCommentImageUpload(e) {
      const files = e.target.files;
      if (files.length === 0) return;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) {
          alert('请上传图片文件');
          continue;
        }
        
        // 检查图片大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB');
          continue;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.commentImages.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
      
      // 清空input值，允许重复选择同一文件
      this.$refs.commentFileInput.value = '';
    },
    handleReplyImageUpload(e) {
      const files = e.target.files;
      if (files.length === 0) return;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) {
          alert('请上传图片文件');
          continue;
        }
        
        // 检查图片大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB');
          continue;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.replyImages.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
      
      // 清空input值，允许重复选择同一文件
      this.$refs.replyFileInput.value = '';
    },
    removeCommentImage(index) {
      this.commentImages.splice(index, 1);
    },
    removeReplyImage(index) {
      this.replyImages.splice(index, 1);
    },
    async submitComment() {
      if (!this.newComment.trim() && this.commentImages.length === 0) {
        alert('评论内容或图片不能为空');
        return;
      }
      
      // 上传图片到服务器（实际项目中需要实现）
      const uploadedImages = await this.uploadImages(this.commentImages);
      
      this.comments.push({
        id: this.comments.length + 1,
        author: '当前用户',
        authorAvatar: this.defaultAvatar,
        content: this.newComment,
        images: uploadedImages,
        time: new Date().toLocaleString()
      });
      
      this.currentPost.comments++;
      this.newComment = '';
      this.commentImages = [];
    },
    async submitReply() {
    if (!this.replyContent.trim() && this.replyImages.length === 0) {
      alert('回复内容或图片不能为空');
      return;
    }

    // 上传图片到服务器（模拟）
    const uploadedImages = await this.uploadImages(this.replyImages);
    
    // 创建新回复
    const newReply = {
      id: Date.now(),
      author: '当前用户',
      authorAvatar: this.defaultAvatar,
      content: this.replyContent,
      images: uploadedImages,
      time: new Date().toLocaleString(),
      parentId: this.replyingTo.id,
      replies: [],
      likes: 0,        // 新增
      isLiked: false   // 新增
    };
    
    // 确保评论数组是响应式的
    if (!Array.isArray(this.comments)) {
      this.comments = [];
    }
    
    // 找到被回复的评论并添加回复
    const addReplyToComment = (comments) => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === this.replyingTo.id) {
          // 确保replies数组存在
          if (!comments[i].replies) {
            this.$set(comments[i], 'replies', []);
          }
          // 使用Vue.set确保响应式
          this.$set(comments[i].replies, comments[i].replies.length, newReply);
          return true;
        }
        if (comments[i].replies && comments[i].replies.length > 0) {
          if (addReplyToComment(comments[i].replies)) {
            return true;
          }
        }
      }
      return false;
    };
    
    // 添加回复
    if (!addReplyToComment(this.comments)) {
      // 如果没找到被回复的评论，则作为顶级评论添加
      this.comments.push(newReply);
    }
    
    // 强制更新视图
    this.$forceUpdate();
    
    this.currentPost.comments++;
    this.closeReplyDialog();

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
    
    // 修改提交回复方法
    async submitReply() {
      if (!this.replyContent.trim() && this.replyImages.length === 0) {
        alert('回复内容或图片不能为空');
        return;
      }

      // 上传图片到服务器（模拟）
      const uploadedImages = await this.uploadImages(this.replyImages);
      
      // 创建新回复
      const newReply = {
        id: Date.now(), // 使用时间戳作为临时ID
        author: '当前用户',
        authorAvatar: this.defaultAvatar,
        content: this.replyContent,
        images: uploadedImages,
        time: new Date().toLocaleString(),
        parentId: this.replyingTo.id,
        replies: []
      };

      // 递归查找并添加回复
      const addReply = (comments) => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === this.replyingTo.id) {
            if (!comments[i].replies) {
              this.$set(comments[i], 'replies', []);
            }
            comments[i].replies.push(newReply);
            return true;
          }
          if (comments[i].replies && comments[i].replies.length > 0) {
            if (addReply(comments[i].replies)) {
              return true;
            }
          }
        }
        return false;
      };

      // 添加回复
      if (!addReply(this.comments)) {
        // 如果没找到被回复的评论，则作为顶级评论添加
        this.comments.push(newReply);
      }

      // 清空回复内容
      this.replyContent = '';
      this.replyImages = [];
      this.closeReplyDialog();
      
      // 增加评论数
      this.currentPost.comments++;
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
    }
  }
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


.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0;
}


.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: rgba(239, 246, 255, 0.5);
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #3B82F6;
}

.clear-search-btn {
  padding: 4px 10px;
  background-color: rgba(239, 68, 68, 0.1);
  color: #EF4444;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
}

.clear-search-btn:hover {
  background-color: rgba(239, 68, 68, 0.2);
}

/* 基础样式 */
.forum-container {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-color: #e6eff8;
  color: #333;
  min-height: 100vh;
  line-height: 1.6;
}

/* 导航栏 */
.navbar {
  padding: 12px 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: flex-end;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.header-search {
  max-width: 400px;
  width: 100%;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(255,255,255,0.95);
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.search-box:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  color: #6b7280;
}

.search-box input {
  flex: 1;
  padding: 10px 15px 10px 10px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
}

.search-box input::placeholder {
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
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
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
  gap: 20px;
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

.post-tags.right-aligned {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
  max-width: 50%; /* 限制标签区域宽度 */
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

.post-tag:hover {
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
  
  .modal-header {
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

.meta-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
  vertical-align: middle;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 30px;
}

.pagination button {
  padding: 6px 12px;
  min-width: 36px;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #4b5563;
}

.pagination button.active {
  background: linear-gradient(135deg, #10B981, #0EA5E9);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 6px rgba(16,185,129,0.2);
}

.pagination button:hover:not(.active) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
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
  background-color: rgba(15, 14, 14, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
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
  background-color: rgba(0, 0, 0, 0.7);
  border-color: white;
}

.carousel-btn svg {
  width: 24px;
  height: 24px;
  color: white !important;
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

.heart-animation {
  position: fixed;
  font-size: 20px;
  pointer-events: none;
  animation: heartFloat 1s ease-out forwards;
  z-index: 9999;
}

@keyframes heartFloat {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
}

/* 优化点赞按钮反馈 */
.like-btn {
  transition: transform 0.2s;
}

.like-btn:active {
  transform: scale(1.2);
}

.collect-effect {
  position: fixed;
  animation: collectAnimation 1s forwards;
  pointer-events: none;
  z-index: 9999;
}

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
    z-index: 100;
    /* 其他样式保持不变 */
  }
  
  .search-box input {
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

.modal-header {
  padding: 25px 30px;
  background: linear-gradient(135deg, #FF7043, #FFA726);
  color: white;
  position: relative;
}
.modal-header::after {
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
</style>