<template>
    <div>
      <!-- 主内容区域 -->
      <main class="main-content">
        <!-- 左侧区域 (2/3宽度) -->
        <div class="left-panel">
          <!-- 统计卡片 -->
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-icon blue">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-value">1,254</div>
              <div class="stat-label">总用户数</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="stat-value">324</div>
              <div class="stat-label">今日订单</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="stat-value">+12.5%</div>
              <div class="stat-label">增长率</div>
            </div>
          </div>
          
          <!-- 图片栏 -->
          <div class="gallery-section">
            <div class="section-header">
              <h2 class="section-title">图片资源</h2>
              <button class="nav-btn">
                <i class="fas fa-plus"></i> 添加图片
              </button>
            </div>
            <div class="gallery-grid">
              <div class="gallery-item">
                <div class="gallery-item-text">产品展示图</div>
              </div>
              <div class="gallery-item">
                <div class="gallery-item-text">用户活动</div>
              </div>
              <div class="gallery-item">
                <div class="gallery-item-text">设计素材</div>
              </div>
              <div class="gallery-item">
                <div class="gallery-item-text">宣传海报</div>
              </div>
              <div class="gallery-item">
                <div class="gallery-item-text">团队照片</div>
              </div>
              <div class="gallery-item">
                <div class="gallery-item-text">品牌标识</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧区域 (1/3宽度) -->
        <div class="right-panel">
          <!-- 公告栏 -->
          <div class="announcement-section">
            <div class="section-header">
              <h2 class="section-title">系统公告</h2>
              <button class="nav-btn">
                <i class="fas fa-bell"></i>
              </button>
            </div>
            <div class="announcement-list">
              <div class="announcement-item">
                <div class="announcement-title">系统维护通知</div>
                <div class="announcement-date">2023-06-30 10:30</div>
                <div class="announcement-content">本周六凌晨2:00-4:00将进行系统维护，届时服务将短暂不可用。</div>
              </div>
              <div class="announcement-item">
                <div class="announcement-title">新功能上线</div>
                <div class="announcement-date">2023-06-28 14:15</div>
                <div class="announcement-content">数据统计模块已更新，新增了用户行为分析功能。</div>
              </div>
              <div class="announcement-item">
                <div class="announcement-title">安全升级提醒</div>
                <div class="announcement-date">2023-06-25 09:45</div>
                <div class="announcement-content">请所有用户及时更新密码，增强账户安全性。</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
    

    
  </script>
  
  <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
  
        body {
          font-family: 'Roboto', sans-serif;
          background: #f0f2f5;
          color: #333;
          overflow-x: hidden;
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
  
        /* 主内容区域样式 */
        .main-content {
          display: flex;
          min-height: calc(100vh - 60px);
          padding: 20px;
          margin-top: 60px;
        }
  
        .left-panel {
          flex: 2;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-right: 20px;
        }
  
        .right-panel {
          flex: 1;
        }
  
        /* 图片栏样式 */
        .gallery-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 20px;
        }
  
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
  
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2a5298;
        }
  
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
  
        .gallery-item {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          height: 180px;
          background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
          position: relative;
        }
  
        .gallery-item:hover {
          transform: translateY(-5px);
        }
  
        .gallery-item:nth-child(2) {
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
        }
  
        .gallery-item:nth-child(3) {
          background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }
  
        .gallery-item:nth-child(4) {
          background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
        }
  
        .gallery-item:nth-child(5) {
          background: linear-gradient(135deg, #a6c0fe 0%, #f68084 100%);
        }
  
        .gallery-item:nth-child(6) {
          background: linear-gradient(135deg, #fccb90 0%, #d57eeb 100%);
        }
  
        .gallery-item-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px;
          font-size: 14px;
        }
  
        /* 公告栏样式 */
        .announcement-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 20px;
          height: 100%;
        }
  
        .announcement-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
  
        .announcement-item {
          padding: 15px;
          border-radius: 8px;
          background: #f9f9ff;
          border-left: 4px solid #4facfe;
          transition: all 0.3s ease;
        }
  
        .announcement-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
  
        .announcement-item:nth-child(2) {
          border-left-color: #ff9a9e;
        }
  
        .announcement-item:nth-child(3) {
          border-left-color: #84fab0;
        }
  
        .announcement-title {
          font-weight: 600;
          margin-bottom: 5px;
          color: #2a5298;
        }
  
        .announcement-date {
          font-size: 12px;
          color: #777;
          margin-bottom: 8px;
        }
  
        .announcement-content {
          font-size: 14px;
          line-height: 1.5;
          color: #555;
        }
  
        /* 统计卡片样式 */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
  
        .stat-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
  
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          font-size: 24px;
          color: white;
        }
  
        .stat-icon.blue {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
  
        .stat-icon.green {
          background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%);
        }
  
        .stat-icon.orange {
          background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
        }
  
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 5px;
          color: #2a5298;
        }
  
        .stat-label {
          font-size: 14px;
          color: #777;
        }
  
        /* 响应式设计 */
        @media (max-width: 992px) {
          .main-content {
            flex-direction: column;
          }
          
          .left-panel {
            margin-right: 0;
            margin-bottom: 20px;
          }
          
          .stats-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
  
        @media (max-width: 768px) {
          .nav-buttons {
            display: none;
          }
          
          .stats-container {
            grid-template-columns: 1fr;
          }
          
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
  
        /* 动画效果 */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
  
        .gallery-item, .announcement-item, .stat-card {
          animation: fadeIn 0.5s ease forwards;
        }
  
        .gallery-item:nth-child(1) { animation-delay: 0.1s; }
        .gallery-item:nth-child(2) { animation-delay: 0.2s; }
        .gallery-item:nth-child(3) { animation-delay: 0.3s; }
        .gallery-item:nth-child(4) { animation-delay: 0.4s; }
        .gallery-item:nth-child(5) { animation-delay: 0.5s; }
        .gallery-item:nth-child(6) { animation-delay: 0.6s; }
  
        .announcement-item:nth-child(1) { animation-delay: 0.2s; }
        .announcement-item:nth-child(2) { animation-delay: 0.3s; }
        .announcement-item:nth-child(3) { animation-delay: 0.4s; }
  
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
      </style>
  
  
  
  