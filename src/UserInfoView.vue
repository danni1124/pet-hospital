<template>
  <div class="user-center-container">
    <!-- 上部背景区域 -->
    <div class="header-background">
      <!-- 用户信息区域 -->
      <div class="user-profile">
        <img class="user-avatar" :src="getAvatarUrl(userInfo.avatar_url)" alt="用户头像"/>
        <div class="user-details">
          <div class="username-row">
            <span class="username">{{ userInfo.username || 'loading...' }}</span>
            <span class="user-level">Lv.{{ userInfo.level || 1 }}</span>
          </div>
          <div class="user-id">ID: {{ userInfo.userId || 'loading...' }}</div>
        </div>
      </div>
    </div>
    
    <!-- 下部内容区域 -->
    <div class="content-section">
      <!-- 导航标签 -->
      <div class="nav-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </div>
      </div>
      
      <!-- 内容展示区 -->
      <div class="tab-content">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'
import CasesPage from './CasesPage.vue'

import CouponRecord from './components/CouponRecord.vue'
import BookingRecord from './BookingRecord.vue'
import OrderRecord from './OrderRecord.vue'

// 用户信息响应式数据
const userInfo = ref({
  userId: null,
  username: '',
  level: 1,
  phone: '',
  email: '',
  avatar_url: '',
  address: ''
})

// Tab数据和状态
const tabs = [
  { key: 'coupon',  label: '优惠券记录', icon: '🎟' },
  { key: 'booking', label: '预约记录',   icon: '📅' },
  { key: 'order',   label: '订单记录',   icon: '📦' },
  { key: 'cases',   label: '病例记录',   icon: '📋' }
]

const activeTab = ref('coupon')

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'cases':   return CasesPage
    case 'booking': return BookingRecord
    case 'coupon':  return CouponRecord
    case 'order':   return OrderRecord
    default:        return CouponRecord
  }
})

// 获取用户详细信息
const fetchUserInfo = async () => {
  try {
    // 首先从localStorage获取当前登录用户的基本信息
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      console.error('未找到登录用户信息')
      return
    }
    
    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.userId
    
    if (!userId) {
      console.error('用户ID不存在，无法获取详细信息')
      // 使用localStorage中的基本信息作为降级方案
      userInfo.value = {
        userId: 'unknown',
        username: currentUser.username || 'unknown',
        level: 1,
        phone: '',
        email: '',
        avatar_url: '',
        address: ''
      }
      return
    }
    
    console.log('获取用户详细信息，userId:', userId)
    
    let response
    
    try {
      // 调用后端API获取用户详细信息
      response = await axios.get(`${API_BASE_URL}/getUser`, {
        params: { userId: userId }
      })
      
      console.log('后端用户信息响应:', response.data)
      
      if (response.data && response.data.code === 200) {
        // 成功获取用户信息
        const userData = response.data.user || response.data.data || {}
        userInfo.value = {
          userId: userData.userId || userId,
          username: userData.username || currentUser.username,
          level: userData.level || 1,
          phone: userData.phone || '',
          email: userData.email || '',
          avatar_url: userData.avatar_url || '',
          address: userData.address || ''
        }
      } else {
        throw new Error(response.data?.msg || '获取用户信息失败')
      }
      
    } catch (apiError) {
      console.log('真实API不可用，使用本地降级:', apiError.message)
      
      // API降级：使用localStorage中已保存的用户数据
      if (currentUser.userData) {
        userInfo.value = {
          userId: currentUser.userData.userId || userId,
          username: currentUser.userData.username || currentUser.username,
          level: currentUser.userData.level || 1,
          phone: currentUser.userData.phone || '',
          email: currentUser.userData.email || '',
          avatar_url: currentUser.userData.avatar_url || '',
          address: currentUser.userData.address || ''
        }
      } else {
        // 如果没有详细数据，使用基本信息，添加一个示例头像
        userInfo.value = {
          userId: userId,
          username: currentUser.username || 'unknown',
          level: 1,
          phone: '',
          email: '',
          avatar_url: '/uploads/avatars/default-user.jpg', // 示例头像路径
          address: ''
        }
      }
      
      console.log('降级用户信息:', userInfo.value)
    }
    
  } catch (error) {
    console.error('获取用户信息时发生错误:', error)
    
    // 错误处理：显示默认信息
    userInfo.value = {
      userId: 'error',
      username: '加载失败',
      level: 1,
      phone: '',
      email: '',
      avatar_url: '',
      address: ''
    }
  }
}

// 获取完整的头像URL
const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) {
    // 返回默认头像，可以是一个占位图或默认头像
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjE1IiBmaWxsPSIjQzRDNEM0Ii8+CjxwYXRoIGQ9Ik0yMCA4MEMyMCA2NS44NTc5IDMxLjQzMTUgNTUgNDUgNTVINTVDNjguNTY4NSA1NSA4MCA2NS44NTc5IDgwIDgwVjEwMEgyMFY4MFoiIGZpbGw9IiNDNEM0QzQiLz4KPC9zdmc+'
  }
  
  // 如果avatar_url已经是完整的URL（包含http或https），直接返回
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  
  // 否则拼接基本网址
  const baseUrl = 'http://47.113.205.34:8085'
  // 确保路径以/开头
  const path = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`
  return `${baseUrl}${path}`
}

// 页面加载时自动获取用户信息
onMounted(() => {
  console.log('个人中心页面加载，开始获取用户信息...')
  fetchUserInfo()
})

</script>

<style scoped>
/* 整体容器 */
.user-center-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  overflow-x: hidden;
}

/* 上部背景区域 */
.header-background {
  width: 100%;
  height: 35vh;
  background-image: url('./assets/userinfo3.webp');
  background-size: cover;
  background-position: center;
  position: relative;
}

/* 用户信息区域 */
.user-profile {
  position: absolute;
  bottom: 20px;
  left: 80px;
  display: flex;
  align-items: flex-end;
  gap: 24px;
  z-index: 10;
}

/* 用户头像 */
.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  object-fit: cover;
}

/* 用户详细信息 */
.user-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.username {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.user-level {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2c3e50;
  padding: 4px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.user-id {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}

/* 下部内容区域 */
.content-section {
  width: 100%;
  background-color: #f5f5f5;
  min-height: 65vh;
  padding: 40px 80px 40px 80px;
  box-sizing: border-box;
}

/* 导航标签 */
.nav-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tab-item {
  flex: 1;
  padding: 16px 12px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #666666;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-right: 1px solid #e8e8e8;
}

.tab-item:last-child {
  border-right: none;
}

.tab-item.active {
  background: #4A90E2;
  color: #ffffff;
}

.tab-item:hover:not(.active) {
  background: #f8f9fa;
  color: #4A90E2;
}

.tab-icon {
  font-size: 16px;
}

/* 内容展示区 */
.tab-content {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  min-height: 350px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-background {
    height: 30vh;
  }
  
  .user-profile {
    left: 20px;
    bottom: -50px;
    gap: 16px;
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 18px;
  }
  
  .content-section {
    padding: 20px 20px 20px 20px;
  }
  
  .nav-tabs {
    flex-direction: column;
  }
  
  .tab-item {
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }
  
  .tab-item:last-child {
    border-bottom: none;
  }
}
</style>
