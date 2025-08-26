<template>
  <div class="user-center-bg">
    <!-- 顶部用户信息卡片 -->
    <div class="user-card">
      <img class="avatar" :src="getAvatarUrl(userInfo.avatar_url)" alt="用户头像"/>
      <div class="user-info">
        <div class="user-row">
          <span class="user-username">@ {{ userInfo.username || 'loading...' }}</span>
          <span class="level">Lv.{{ userInfo.level || 1 }}</span>
        </div>
        <div class="user-id">通行证ID:{{ userInfo.userId || 'loading...' }}</div>
        <div v-if="userInfo.phone || userInfo.email" class="user-contact">
          <span v-if="userInfo.phone">📱 {{ userInfo.phone }}</span>
          <span v-if="userInfo.email">📧 {{ userInfo.email }}</span>
        </div>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="main-area">
      <!-- 左侧导航 -->
      <aside class="side-nav">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['nav-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </div>
      </aside>

      <!-- 右侧内容 -->
      <main class="content-area">
        <component :is="currentComponent" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'
import CasesRecord from './CasesRecord.vue'
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
  { key: 'cases',   label: '病例记录',   icon: '📋' },
  { key: 'booking', label: '预约记录',   icon: '📅' },
  { key: 'coupon',  label: '优惠券记录', icon: '🎟' },
  { key: 'order',   label: '订单记录',   icon: '📦' }
]

const activeTab = ref('cases')

// 组件映射

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'cases':   return CasesRecord
    case 'booking': return BookingRecord
    case 'coupon':  return CouponRecord
    case 'order':   return OrderRecord
    default:        return BookingRecord
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
.user-center-bg {
  background: linear-gradient(120deg, #f5f7fa 60%, #e3f0ff 100%);
  min-height: 100vh;
  width: 100vw;
  padding: 1px 0 0 0;
  box-sizing: border-box;
}

/* 顶部用户信息卡片美化 */
.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #f3cdf6 80%, #e3f0ff 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(200, 209, 223, 0.18);
  padding: 36px 80px;
  margin: 32px auto 0 auto;
  max-width: 935px;
  position: relative;
  transition: box-shadow 0.2s;
}
.user-card:hover {
  box-shadow: 0 8px 32px rgba(200, 209, 223, 0.22);
}
.avatar {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 40px;
  border: 5px solid #fff;
  box-shadow: 0 2px 12px rgba(200, 209, 223, 0.18);
  background: #e3f0ff;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 26px;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
}

.level {
  background: linear-gradient(90deg, #e3f0ff 60%, #f3cdf6 100%);
  color: #305aa2;
  border-radius: 10px;
  padding: 3px 16px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 1px 6px #e3f0ff;
}

.user-id {
  font-size: 15px;
  color: #888;
  margin-top: 2px;
  letter-spacing: 1px;
}

.user-contact {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: flex;
  gap: 16px;
}

.user-username {
  font-size: 18px;
  color: #e57373;
  font-weight: bold;
  letter-spacing: 1px;
}

.user-stats {
  display: flex;
  gap: 32px;
  margin-top: 8px;
  font-size: 15px;
  color: #888;
}

.edit-btn {
  position: absolute;
  right: 32px;
  top: 32px;
  background: #fff;
  border: 1px solid #b6d0f7;
  color: #305aa2;
  border-radius: 10px;
  padding: 8px 28px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #e3f0ff;
}

.edit-btn:hover {
  background: #e3f0ff;
  box-shadow: 0 4px 16px #e3f0ff;
}

/* 主体区域布局 */
.main-area {
  display: flex;
  width: 1090px;             /* 与卡片同宽 */
  margin: 32px auto 0;      /* 增加上间距 */
  gap: 28px;
  box-sizing: border-box;
}

/* 左侧导航 */
.side-nav {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.10);
  padding: 28px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-item {
  padding: 14px 36px;
  font-size: 17px;
  color: #305aa2;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;
  margin: 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.nav-icon {
  font-size: 20px;
}

.nav-item.active {
  background: linear-gradient(90deg, #e3f0ff 70%, #f3cdf6 100%);
  color: #222;
  font-weight: bold;
  box-shadow: 0 2px 8px #e3f0ff;
}

.nav-item:hover {
  background: #f5f7fa;
}

/* 右侧内容区 */
.content-area {
  flex: 1 1 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.10);
  padding: 32px 32px;
  min-height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
}

.placeholder {
  font-size: 20px;
  font-weight: 500;
  color: #305aa2;
}
.prescription-wrapper {
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 6px;
  padding: 24px 32px 12px 32px;
  font-family: 'SimSun', 'serif';
  color: #222;
  min-width: 600px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}
.prescription-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 12px;
}
.prescription-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
  font-size: 16px;
}
.prescription-table td {
  padding: 4px 8px 4px 0;
  border: none;
  white-space: nowrap;
}
.line {
  display: inline-block;
  min-width: 60px;
  border-bottom: 1px solid #888;
  margin-left: 4px;
  margin-right: 12px;
  height: 22px;
  vertical-align: bottom;
}
.prescription-main {
  display: flex;
  border-top: 1px solid #888;
  border-bottom: 1px solid #888;
  margin: 12px 0;
  min-height: 120px;
}
.diagnosis, .rp {
  flex: 1;
  padding: 12px 8px;
  font-size: 16px;
}
.diag-content, .rp-content {
  min-height: 60px;
  padding-top: 8px;
}
.prescription-footer {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-top: 16px;
  border-top: 1px solid #888;
  padding-top: 8px;
}
.prescription-note {
  position: absolute;
  right: 8px;
  top: 50%;
  writing-mode: vertical-rl;
  font-size: 13px;
  color: #888;
  letter-spacing: 2px;
}
/* 响应式 */
@media (max-width: 900px) {
  .user-card,
  .main-area {
    width: 100%;
    padding: 0 24px;        /* 小屏时也保持左右 padding 一致 */
    margin: 16px;
    flex-direction: column;
    gap: 0;
  }
}
@media (max-width: 900px) {
  .user-card, .main-area {
    max-width: 100%;
    margin: 16px;
    flex-direction: column;
    gap: 0;
    padding: 0 8px;
  }
  .side-nav {
    width: 100%;
    flex-direction: row;
    padding: 12px 0;
    gap: 0;
    margin-bottom: 12px;
  }
  .nav-item {
    flex: 1;
    margin: 0;
    text-align: center;
  }
  .content-area {
    padding: 16px;
    min-height: 200px;
  }
}
</style>