<template>
  <div class="member-center">
    <!-- 非会员用户显示注册区域 -->
    <div v-if="!userInfo.isMember" class="membership-registration">
      <div class="header-section">
        <h2 class="section-title">🏆 加入会员，尊享专属特权</h2>
        <p class="section-subtitle">选择适合您的会员套餐，为爱宠提供更好的服务体验</p>
      </div>
      
      <div class="membership-plans">
        <div class="plan-card basic" @click="selectPlan('basic')">
          <div class="plan-header">
            <div class="plan-badge basic-badge">⭐ 入门首选</div>
            <h3>基础会员</h3>
            <div class="price">¥99/年</div>
            <div class="price-note">相当于每月仅需8.25元</div>
          </div>
          <div class="plan-benefits">
            <div class="benefit">✨ 免费洗澡 6次/年</div>
            <div class="benefit">🎁 生日专属礼包</div>
            <div class="benefit">📱 专属客服支持</div>
            <div class="benefit">💰 商城9.5折优惠</div>
          </div>
          <button class="register-btn" @click="selectPlan('basic')" :disabled="isRegistering">
            {{ isRegistering ? '注册中...' : '立即注册' }}
          </button>
        </div>
        
        <div class="plan-card premium popular" @click="selectPlan('premium')">
          <div class="popular-tag">🔥 热门推荐</div>
          <div class="plan-header">
            <div class="plan-badge premium-badge">💎 超值体验</div>
            <h3>高级会员</h3>
            <div class="price">¥199/年</div>
            <div class="price-note">相当于每月仅需16.6元</div>
          </div>
          <div class="plan-benefits">
            <div class="benefit">✨ 免费洗澡 12次/年</div>
            <div class="benefit">💅 免费美容 3次/年</div>
            <div class="benefit">🎁 节日精美礼包</div>
            <div class="benefit">🏥 健康体检 1次/年</div>
            <div class="benefit">💰 商城9折优惠</div>
          </div>
          <button class="register-btn premium" @click="selectPlan('premium')" :disabled="isRegistering">
            {{ isRegistering ? '注册中...' : '立即注册' }}
          </button>
        </div>
        
        <div class="plan-card vip" @click="selectPlan('vip')">
          <div class="plan-header">
            <div class="vip-badge">💎 尊享VIP</div>
            <h3>VIP会员</h3>
            <div class="price">¥399/年</div>
            <div class="price-note">相当于每天仅需1.1元</div>
          </div>
          <div class="plan-benefits">
            <div class="benefit highlight">✨ 免费洗澡 99次/年</div>
            <div class="benefit">💅 免费美容 12次/年</div>
            <div class="benefit">🏥 免费体检 4次/年</div>
            <div class="benefit">🚗 上门服务 6次/年</div>
            <div class="benefit">👑 专属VIP通道</div>
            <div class="benefit">🎁 节日专属大礼包</div>
          </div>
          <button class="register-btn vip" @click="selectPlan('vip')" :disabled="isRegistering">
            {{ isRegistering ? '注册中...' : '立即注册' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 已是会员用户显示会员信息 -->
    <div v-else class="member-dashboard">
      <!-- 加载状态 -->
      <div v-if="isLoadingMemberInfo" class="loading-state">
        <div class="loading-spinner">🔄</div>
        <p>正在加载会员信息...</p>
      </div>
      
      <!-- 会员信息 -->
      <div v-else>
        <div class="member-status">
          <div class="status-header">
            <h2>{{ getMemberTypeName(userInfo.memberType) }}</h2>
            <div class="expiry-date">有效期至: {{ formatDate(userInfo.membershipExpiry) }}</div>
          </div>
          
          <div class="benefits-usage">
            <div class="usage-item">
              <div class="usage-label">免费洗澡</div>
              <div class="usage-count">{{ userInfo.freeBathCount || 0 }}次</div>
              <div class="usage-total">/ {{ getTotalBenefits(userInfo.memberType).bath }}次</div>
            </div>
            
            <div class="usage-item" v-if="userInfo.memberType !== 'basic'">
              <div class="usage-label">免费美容</div>
              <div class="usage-count">{{ userInfo.freeGroomingCount || 0 }}次</div>
              <div class="usage-total">/ {{ getTotalBenefits(userInfo.memberType).grooming }}次</div>
            </div>
            
            <div class="usage-item" v-if="userInfo.memberType === 'premium' || userInfo.memberType === 'vip'">
              <div class="usage-label">免费体检</div>
              <div class="usage-count">{{ userInfo.freeCheckupCount || 0 }}次</div>
              <div class="usage-total">/ {{ getTotalBenefits(userInfo.memberType).checkup }}次</div>
            </div>
          </div>
          
          <div class="member-actions">
            <button class="action-btn" @click="renewMembership">续费会员</button>
            <button class="action-btn secondary" @click="upgradeMembership">升级会员</button>
            <button class="action-btn secondary" @click="fetchMemberInfo">刷新信息</button>
          </div>
        </div>
        
        <div class="usage-history">
          <h3>使用记录</h3>
          <div class="history-list">
            <div class="history-item" v-for="record in usageHistory" :key="record.id">
              <div class="service-type">{{ record.service }}</div>
              <div class="service-date">{{ formatDate(record.date) }}</div>
              <div class="service-status">{{ record.status }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

// 从父组件获取用户信息
const userInfo = inject('userInfo')

// 加载状态
const isRegistering = ref(false)
const isLoadingMemberInfo = ref(false)

// 示例使用记录
const usageHistory = ref([
  { id: 1, service: '免费洗澡', date: '2025-08-15', status: '已完成' },
  { id: 2, service: '免费美容', date: '2025-08-01', status: '已完成' },
  { id: 3, service: '健康体检', date: '2025-07-20', status: '已完成' }
])

// 获取会员信息
const fetchMemberInfo = async () => {
  try {
    // 获取当前登录用户ID
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      console.error('未找到登录用户信息')
      return
    }
    
    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.userId
    
    if (!userId) {
      console.error('用户ID不存在')
      return
    }
    
    isLoadingMemberInfo.value = true
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
  } finally {
    isLoadingMemberInfo.value = false
  }
}

// 选择会员套餐
const selectPlan = async (planType) => {
  if (isRegistering.value) return // 防止重复点击
  
  console.log('选择套餐:', planType)
  
  // 获取当前登录用户ID
  const currentUserStr = localStorage.getItem('currentUser')
  if (!currentUserStr) {
    console.error('未找到登录用户信息')
    alert('请先登录后再注册会员')
    return
  }
  
  const currentUser = JSON.parse(currentUserStr)
  const userId = currentUser.userId
  
  if (!userId) {
    console.error('用户ID不存在')
    alert('用户信息异常，请重新登录')
    return
  }
  
  isRegistering.value = true // 开始加载
  
  // 根据套餐类型设置洗澡次数
  const benefits = getTotalBenefits(planType)
  
  // 构建请求数据
  const memberCardData = {
    userId: userId,
    balance: benefits.bath, // 使用洗澡次数作为balance
    validFrom: new Date().toISOString().split('T')[0], // 当前日期
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 一年后
  }
  
  console.log('发送会员注册请求:', memberCardData)
  
  try {
    // 向后端发送注册请求
    const response = await axios.post(`${API_BASE_URL}/addMemberCard`, memberCardData)
    
    console.log('会员注册响应:', response.data)
    
    if (response.data && response.data.code === 200) {
      // 注册成功，重新获取会员信息
      alert(`恭喜您成功注册${getMemberTypeName(planType)}！`)
      await fetchMemberInfo() // 重新从后端获取最新的会员信息
    } else {
      throw new Error(response.data?.msg || '注册会员失败')
    }
    
  } catch (error) {
    console.error('会员注册失败:', error)
    
    if (error.response) {
      // 服务器返回错误
      alert(`注册失败: ${error.response.data?.msg || error.message}`)
    } else if (error.request) {
      // 网络错误
      alert('网络连接失败，请检查网络后重试')
    } else {
      // 其他错误
      alert(`注册失败: ${error.message}`)
    }
  } finally {
    isRegistering.value = false // 结束加载
  }
}

// 注册会员（本地状态更新）
const registerMembership = (planType) => {
  userInfo.value.isMember = true
  userInfo.value.memberType = planType
  userInfo.value.membershipExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1年后
  
  const benefits = getTotalBenefits(planType)
  userInfo.value.freeBathCount = benefits.bath
  userInfo.value.freeGroomingCount = benefits.grooming || 0
  userInfo.value.freeCheckupCount = benefits.checkup || 0
  
  // 更新localStorage中的用户信息
  const currentUserStr = localStorage.getItem('currentUser')
  if (currentUserStr) {
    const currentUser = JSON.parse(currentUserStr)
    currentUser.userData = {
      ...currentUser.userData,
      isMember: true,
      memberType: planType,
      membershipExpiry: userInfo.value.membershipExpiry,
      freeBathCount: benefits.bath,
      freeGroomingCount: benefits.grooming || 0,
      freeCheckupCount: benefits.checkup || 0
    }
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }
  
  console.log('本地会员信息已更新:', userInfo.value)
}

// 获取会员类型名称
const getMemberTypeName = (type) => {
  const names = {
    basic: '基础会员',
    premium: '高级会员',
    vip: 'VIP会员'
  }
  return names[type] || '普通用户'
}

// 获取会员福利总数
const getTotalBenefits = (type) => {
  const benefits = {
    basic: { bath: 6, grooming: 0, checkup: 0 },
    premium: { bath: 12, grooming: 3, checkup: 1 },
    vip: { bath: 99, grooming: 12, checkup: 4 }
  }
  return benefits[type] || { bath: 0, grooming: 0, checkup: 0 }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

// 续费会员
const renewMembership = () => {
  console.log('续费会员')
}

// 升级会员
const upgradeMembership = () => {
  console.log('升级会员')
}

// 组件挂载时获取会员信息
onMounted(() => {
  fetchMemberInfo()
})
</script>

<style scoped>
.member-center {
  width: 100%;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 600px;
}

.header-section {
  text-align: center;
  margin-bottom: 36px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.loading-spinner {
  font-size: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 会员套餐卡片 */
.membership-plans {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.plan-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  height: fit-content;
}

.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.plan-card:hover::before {
  opacity: 1;
}

.plan-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.plan-card.popular {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
}

.plan-card.vip {
  border-color: #fbbf24;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 20%, #ffffff 100%);
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.2);
}

.popular-tag {
  position: absolute;
  top: -2px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
}

.plan-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
}

.basic-badge {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.premium-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.vip-badge {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  font-weight: 700;
}

.plan-header {
  text-align: center;
  margin-bottom: 20px;
}

.plan-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 8px 0 6px 0;
  color: #1f2937;
}

.price {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.vip .price {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price-note {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.plan-benefits {
  margin-bottom: 20px;
}

.benefit {
  padding: 8px 0;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f8fafc;
}

.benefit:last-child {
  border-bottom: none;
}

.benefit.highlight {
  color: #1f2937;
  font-weight: 600;
  background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 20%, #fef3c7 100%);
  margin: 0 -12px;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
}

.register-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.3);
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2) !important;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.register-btn.premium {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.3);
}

.register-btn.premium:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.register-btn.vip {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  box-shadow: 0 3px 12px rgba(251, 191, 36, 0.3);
}

.register-btn.vip:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
}

/* 会员仪表板 */
.member-dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.member-status {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
}

.status-header {
  text-align: center;
  margin-bottom: 32px;
}

.status-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.expiry-date {
  opacity: 0.9;
  font-size: 16px;
}

.benefits-usage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.usage-item {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.usage-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
  font-weight: 500;
}

.usage-count {
  font-size: 28px;
  font-weight: 800;
  display: inline;
}

.usage-total {
  font-size: 16px;
  opacity: 0.8;
  display: inline;
  font-weight: 500;
}

.member-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.action-btn {
  padding: 14px 28px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  background: transparent;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: transparent;
}

.action-btn.secondary:hover {
  background: white;
  transform: translateY(-2px);
}

/* 使用记录 */
.usage-history {
  background: white;
  padding: 32px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.usage-history h3 {
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 20px;
  font-weight: 700;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  align-items: center;
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.service-type {
  font-weight: 600;
  color: #1f2937;
  font-size: 15px;
}

.service-date {
  color: #64748b;
  font-weight: 500;
}

.service-status {
  color: #10b981;
  font-weight: 600;
  padding: 4px 12px;
  background: #d1fae5;
  border-radius: 20px;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 768px) {
  .member-center {
    padding: 16px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .membership-plans {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .plan-card {
    padding: 20px 16px;
  }
  
  .plan-header h3 {
    font-size: 18px;
  }
  
  .price {
    font-size: 24px;
  }
  
  .member-actions {
    flex-direction: column;
  }
  
  .history-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 12px;
  }
  
  .benefits-usage {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>
