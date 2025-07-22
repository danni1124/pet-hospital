<template>
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div>
        <img src="@/assets/logo.jpg" alt="Logo" class="logo">
      </div>
      
      <div class="nav-buttons">
        <router-link to="/" class="nav-btn" active-class="active" exact>
          <i class="fas fa-home"></i> 首页
        </router-link>
        <router-link to="/manage" class="nav-btn" active-class="active">
          <i class="fas fa-tasks"></i> 管理
        </router-link>
         <router-link to="/department" class="nav-btn" active-class="active">
            <i class="fas fa-chart-bar"></i> 预约
         </router-link>
        <router-link to="/questionnaire" class="nav-btn" active-class="active">
          <i class="fas fa-question"></i> 问卷
        </router-link>
          <button class="nav-btn">
            <i class="fas fa-users"></i> 用户
          </button>
          <button class="nav-btn">
            <i class="fas fa-cog"></i> 设置
          </button>
          <button class="nav-btn">
            <i class="fas fa-question-circle"></i> 帮助
          </button>
          <router-link to="/forum" class="nav-btn" active-class="active" exact>
            <i class="fas fa-forum"></i>论坛
          </router-link>
          <router-link to="/introduction" class="nav-btn" active-class="active" exact>
            <i class="fas fa-info"></i>概况
          </router-link>
      </div>
      
      <!-- 右侧用户下拉菜单 -->
      <div class="user-dropdown">
        <div class="user-box">
          <div class="user-avatar-placeholder">
            <span>ZX</span>
          </div>
          <span class="user-name">张小明</span>
          <i class="arrow-down">▼</i>
        </div>
        
        <!-- 下拉菜单内容 -->
        <div class="dropdown-menu">
          <div class="dropdown-item">
            <i class="icon">👤</i>
            <span>个人信息</span>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item">
            <i class="icon">🚪</i>
            <span>退出登录</span>
          </div>
        </div>
      </div>
      
    </header>
    
    <!-- 路由视图容器 -->
        <router-view></router-view>
  
</template>

<script setup>
// 这里不需要路由跳转逻辑，因为使用了 router-link
</script>

<style>
      body {
        background-image: url('@/assets/background.jpg');
        background-size: cover; /* 确保背景图片覆盖整个页面 */
        background-position: center; /* 居中显示背景图片 */
        background-repeat: no-repeat; /* 防止背景图片重复 */
        margin: 0;
        padding: 0 !important;/* 与导航栏高度一致 */
        width: 100vw;
        height: 100%;
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* 顶部导航栏样式 */
      /* 所有页面的导航栏基本样式 */
      .app-header {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100px;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color: white;
        padding: 0 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      .logo-container {
        display: flex;
        align-items: center;
        height: 80px;
        background: white;
        border-bottom: 1px solid #e5e5e5;
      }

      .logo {
        width: 150px;
        height: 80px;
        display: flex;
      }

      .nav-buttons {
        display: flex;;
        gap: 15px;
      }

      .nav-list {
        display: flex;

        list-style-type: none;
        gap: 30px;
      }

      .nav-btn {
        position: relative; /* 为了使用 ::before 定位 */
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.1);
        color: black;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 500;
        align-items: center;
        text-align: center;
        cursor: pointer;
        overflow: hidden; /* 防止伪元素溢出 */
        z-index: 1; /* 确保内容在背景之上 */
      }
      
      /* 背景颜色从左到右展开的效果 */
      .nav-btn::before {
        content: ''; /* 创建伪元素 */
        position: absolute;
        top: 0;
        left: 0;
        width: 0; /* 初始宽度为 0 */
        height: 100%;
        background-color: rgba(220, 230, 255, 0.9); /* 展开时的背景色 */
        transition: width 0.3s ease; /* 设置动画效果，控制宽度变化 */
        z-index: -1; /* 确保背景在内容下方 */
      }
      
      /* 鼠标悬停时的效果 */
      .nav-btn:hover::before {
        width: 100%; /* 悬停时背景扩展到与按钮等宽 */
        background-color: rgba(235, 240, 255, 0.8); /* 悬停时的背景色，比点击时稍浅 */
      }
      
      /* 点击时的效果 */
      .nav-btn:active::before {
        width: 100%; /* 点击时背景扩展到与按钮等宽 */
        background-color: rgba(220, 230, 255, 0.9); /* 点击时的背景色，更深 */
      }

            /* 用户下拉菜单样式 */
      .user-dropdown {
        position: relative;
        margin-left: auto; /* 确保用户框靠右 */
        cursor: pointer;
      }
      
      .user-box {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 6px;
        background-color: rgba(235, 240, 255, 0.5);
        transition: background-color 0.3s;
      }
      
      .user-box:hover {
        background-color: rgba(220, 230, 255, 0.8);
      }
      
      .user-avatar-placeholder {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #1e88e5;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        margin-right: 8px;
      }
      
      .user-name {
        font-size: 14px;
        font-weight: 500;
        margin-right: 5px;
      }
      
      .arrow-down {
        font-size: 10px;
        color: #666;
      }
      
      /* 下拉菜单样式 */
      .dropdown-menu {
        position: absolute;
        top: calc(100% + 5px);
        right: 0; /* 右对齐 */
        width: 200px;
        background-color: white;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 8px 0;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1001;
      }
      
      /* 鼠标悬停时显示下拉菜单 */
      .user-dropdown:hover .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .dropdown-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        transition: background-color 0.3s;
        position: relative;
      }
      
      .dropdown-item:hover {
        background-color: #f5f7fa;
      }
      
      .dropdown-item .icon {
        margin-right: 10px;
        font-size: 16px;
      }
      
      .notification-badge {
        position: absolute;
        right: 15px;
        background-color: #f44336;
        color: white;
        font-size: 12px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .dropdown-divider {
        height: 1px;
        background-color: #eeeeee;
        margin: 5px 0;
      }
      
      /* 调整app-header的布局 */
      .app-header {
        justify-content: space-between; /* 修改布局，使内容分布在两端 */
        padding: 0 20px; /* 添加左右内边距 */
        box-sizing: border-box;
      }

    </style>
