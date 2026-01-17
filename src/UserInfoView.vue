<template>
  <div class="user-center-container">
    <!-- 上部背景区域 -->
    <div class="header-background">
      <!-- 用户信息区域 -->
      <div class="user-profile">
        <img class="user-avatar clickable" :src="getAvatarUrl(userInfo.avatar_url)" alt="用户头像" @click="refreshUserInfo" title="点击刷新个人信息"/>
        <div class="user-details">
          <div class="username-row">
            <span class="username">{{ userInfo.username || 'loading...' }}</span>
            <span class="user-level">Lv.{{ userInfo.level || 1 }}</span>
            <span v-if="userInfo.isMember" class="member-badge">会员</span>
          </div>
          <div class="user-id">ID: {{ userInfo.userId || 'loading...' }}</div>
          <div v-if="userInfo.isMember" class="member-benefits">
            剩余免费洗澡次数: {{ userInfo.freeBathCount || 0 }}次
          </div>
        </div>
      </div>
      
      <!-- 会员快速操作面板 -->
      <div class="member-panel">
        <div v-if="!userInfo.isMember" class="join-member-card">
          <div class="card-header">
            <span class="crown-icon">👑</span>
            <h3>加入会员</h3>
          </div>
          <p class="benefit-desc">享受专属优惠和免费服务</p>
          <button class="join-btn" @click="showMemberCenter = true">
            立即开通
          </button>
        </div>
        
        <div v-else class="member-info-card">
          <!-- 右上角小会员码图标 -->
          <div class="member-code-mini" @click="showMemberCodeModal = true">
            <div class="code-icon">📱</div>
          </div>
          
          <div class="card-header">
            <span class="member-type-icon">
              {{ userInfo.memberType === 'vip' ? '👑' : userInfo.memberType === 'premium' ? '💎' : '⭐' }}
            </span>
            <h3>{{ userInfo.memberType === 'vip' ? 'VIP会员' : userInfo.memberType === 'premium' ? '白金会员' : '普通会员' }}</h3>
          </div>
          <div class="member-benefits-list">
            <div class="benefit-item">
              <span class="benefit-icon">🛁</span>
              <span>免费洗澡：{{ userInfo.freeBathCount }}次</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📅</span>
              <span>到期时间：{{ userInfo.membershipExpiry || '永久' }}</span>
            </div>
          </div>
          <button class="manage-btn" @click="showMemberCenter = true">
            查看明细
          </button>
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
    
    <!-- 会员中心弹窗 -->
    <div v-if="showMemberCenter" class="modal-overlay" @click="showMemberCenter = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>会员明细</h2>
          <button class="close-btn" @click="showMemberCenter = false">×</button>
        </div>
        <div class="modal-body">
          <MemberCenter />
        </div>
      </div>
    </div>
    
    <!-- 会员码模态框 -->
    <div v-if="showMemberCodeModal" class="member-code-modal" @click="closeMemberCodeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>我的会员码</h3>
          <button class="close-btn" @click="closeMemberCodeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="member-code-display">
            <div class="qr-code">
              <div class="qr-placeholder">
                <div class="qr-pattern"></div>
              </div>
            </div>
            <div class="code-number">{{ memberCode }}</div>
            <div class="code-hint">请向工作人员出示此码</div>
          </div>
          <div class="modal-actions">
            <button class="refresh-btn" @click="generateMemberCode">
              <span class="refresh-icon">🔄</span>
              刷新会员码
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, provide } from 'vue'
import axios from 'axios'

import { API_BASE_URL } from '@/config/index.js'
import CasesPage from './CasesPage.vue'
import MemberCenter from './MemberCenter.vue'
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
  address: '',
  isMember: false,
  memberType: '', // 'basic', 'premium', 'vip'
  freeBathCount: 0,
  membershipExpiry: null
})

// Tab数据和状态
const tabs = [
  { key: 'coupon',  label: '优惠券记录', icon: '🎟' },
  { key: 'booking', label: '预约记录',   icon: '📅' },
  { key: 'order',   label: '订单记录',   icon: '📦' },
  { key: 'cases',   label: '病例记录',   icon: '📋' }
]

const activeTab = ref('coupon')
const showMemberCenter = ref(false)

// 会员码相关状态
const showMemberCodeModal = ref(false)
const memberCode = ref('')

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
          address: userData.address || '',
          isMember: false,
          memberType: '',
          freeBathCount: 0,
          membershipExpiry: null
        }
        
        // 获取用户信息成功后，获取会员信息
        await fetchMemberInfo(userId)
      } else {
        throw new Error(response.data?.msg || '获取用户信息失败')
      }
      
    } catch (apiError) {
      console.error('获取用户信息API调用失败:', apiError.message)
      throw apiError
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
      address: '',
      isMember: false,
      memberType: '',
      freeBathCount: 0,
      membershipExpiry: null
    }
  }
}

// 获取会员信息
const fetchMemberInfo = async (userId) => {
  try {
    console.log('获取用户会员信息，userId:', userId)
    
    // 向后端发送GET请求获取会员信息
    const response = await axios.get(`${API_BASE_URL}/getMemberCardByUserId`, {
      params: { 
        userId: userId
      }
    })
    
    console.log('会员信息响应:', response.data)
    
    if (response.data && response.data.code === 200) {
      const memberCards = response.data.data
      
      if (memberCards && Array.isArray(memberCards) && memberCards.length > 0) {
        // 取最新的会员卡记录（通常是数组的最后一个或第一个）
        const latestMemberCard = memberCards[memberCards.length - 1]
        
        // 有会员信息，更新用户状态
        userInfo.value.isMember = true
        userInfo.value.freeBathCount = latestMemberCard.balance || 0
        userInfo.value.membershipExpiry = latestMemberCard.validUntil
        
        // 根据洗澡次数判断会员类型
        const balance = latestMemberCard.balance || 0
        if (balance >= 99) {
          userInfo.value.memberType = 'vip'
          userInfo.value.freeGroomingCount = 12
          userInfo.value.freeCheckupCount = 4
        } else if (balance >= 12) {
          userInfo.value.memberType = 'premium'
          userInfo.value.freeGroomingCount = 3
          userInfo.value.freeCheckupCount = 1
        } else {
          userInfo.value.memberType = 'basic'
          userInfo.value.freeGroomingCount = 0
          userInfo.value.freeCheckupCount = 0
        }
        
        console.log('会员信息已更新:', {
          isMember: userInfo.value.isMember,
          memberType: userInfo.value.memberType,
          freeBathCount: userInfo.value.freeBathCount,
          membershipExpiry: userInfo.value.membershipExpiry,
          memberCard: latestMemberCard
        })
      } else {
        // 没有会员信息或数组为空
        console.log('用户尚未注册会员或会员卡数组为空')
        userInfo.value.isMember = false
        userInfo.value.memberType = ''
        userInfo.value.freeBathCount = 0
        userInfo.value.membershipExpiry = null
      }
    } else {
      throw new Error(response.data?.msg || '获取会员信息失败')
    }
    
  } catch (error) {
    console.error('获取会员信息失败:', error)
    
    if (error.response && error.response.status === 404) {
      // 404表示用户没有会员卡
      console.log('用户尚未注册会员')
      userInfo.value.isMember = false
      userInfo.value.memberType = ''
      userInfo.value.freeBathCount = 0
      userInfo.value.membershipExpiry = null
    } else {
      console.error('会员信息查询出错:', error.message)
      // 其他错误不修改会员状态，保持现有状态
    }
  }
}

// 刷新用户信息（点击头像时触发）
const refreshUserInfo = async () => {
  console.log('刷新用户信息...')
  await fetchUserInfo()
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
  generateMemberCode() // 生成会员码
})

// 生成会员码
const generateMemberCode = () => {
  // 基于用户ID和当前时间生成唯一会员码
  const currentUserStr = localStorage.getItem('currentUser')
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.userId
    const timestamp = Date.now()
    // 生成10位数字会员码
    memberCode.value = String(userId).padStart(4, '0') + String(timestamp).slice(-6)
  } else {
    // 如果没有用户信息，生成随机码
    memberCode.value = Math.random().toString().slice(2, 12)
  }
}

// 关闭会员码模态框
const closeMemberCodeModal = () => {
  showMemberCodeModal.value = false
}

// 提供用户信息给子组件
provide('userInfo', userInfo)

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
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 80px 20px 80px;
  box-sizing: border-box;
}

/* 用户信息区域 */
.user-profile {
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

.user-avatar.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-avatar.clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
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

.member-badge {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%);
  color: white;
  padding: 4px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.member-benefits {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin-top: 4px;
}

.user-id {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}

/* 会员快速操作面板 */
.member-panel {
  z-index: 10;
}

.join-member-card,
.member-info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

/* 右上角小会员码图标 */
.member-code-mini {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.member-code-mini:hover {
  background: rgba(102, 126, 234, 0.3);
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.member-code-mini .code-icon {
  font-size: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.crown-icon,
.member-type-icon {
  font-size: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.benefit-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.join-btn,
.manage-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%);
  color: white;
}

.join-btn:hover {
  background: linear-gradient(135deg, #FF5252 0%, #E53935 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.manage-btn {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
}

.manage-btn:hover {
  background: linear-gradient(135deg, #357ABD 0%, #2E6DA4 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.member-benefits-list {
  margin: 16px 0;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.benefit-icon {
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
  background: #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 0;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
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
    height: 40vh;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;
  }
  
  .user-profile {
    align-items: center;
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
  }
  
  .username {
    font-size: 18px;
  }
  
  .member-panel {
    width: 100%;
    max-width: 300px;
  }
  
  .join-member-card,
  .member-info-card {
    width: 100%;
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
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

/* 会员码模态框样式 */
.member-code-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.member-code-modal .modal-content {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.member-code-modal .modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

/* 会员码显示 */
.member-code-display {
  text-align: center;
  padding: 32px 16px;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
}

.qr-placeholder {
  width: 160px;
  height: 160px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.qr-pattern {
  width: 120px;
  height: 120px;
  background-image: 
    linear-gradient(90deg, #1f2937 50%, transparent 50%),
    linear-gradient(#1f2937 50%, transparent 50%);
  background-size: 8px 8px;
  opacity: 0.8;
}

.code-number {
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.code-hint {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.refresh-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.refresh-icon {
  animation: none;
  transition: transform 0.3s ease;
}

.refresh-btn:active .refresh-icon {
  animation: spin 0.5s ease;
}
</style>
