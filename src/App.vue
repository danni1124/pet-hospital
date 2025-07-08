<template>
  <div>
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="logo-container">
        <div class="logo">
          <i class="fas fa-cube"></i>
        </div>
        <div class="logo-text">VueAdmin</div>
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
      
      <div class="user-profile">
        <div class="avatar">JS</div>
        <div>管理员</div>
        <i class="fas fa-chevron-down"></i>
      </div>
    </header>
    
    <!-- 路由视图容器 -->
    <router-view></router-view>
  </div>
</template>


<script setup>
// 这里不需要路由跳转逻辑，因为使用了 router-link
</script>

<style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        padding-top: 40px; /* 为固定导航栏留出空间 */
      }

      /* 顶部导航栏样式 */
      .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
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
      }

      .logo {
        height: 40px;
        width: 40px;
        background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      .logo-text {
        font-weight: 700;
        font-size: 20px;
        letter-spacing: 0.5px;
      }

      .nav-buttons {
        display: flex;
        gap: 15px;
      }

      .nav-btn {
        padding: 8px 16px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .nav-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      .nav-btn.active {
        background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }

      
    </style>



