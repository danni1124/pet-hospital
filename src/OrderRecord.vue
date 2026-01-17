<template>
  <div class="order-record-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-receipt"></i>
        </div>
        <div class="header-text">
          <h1>订单记录</h1>
          <p>查看您的购买历史记录</p>
        </div>
      </div>
    </div>
    
    <div class="order-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p>正在加载订单记录...</p>
    </div>
    
    <!-- 订单记录列表 -->
    <div v-else-if="orders.length > 0" class="orders-container">
      <div class="orders-summary">
        <span class="orders-count">共 {{ orders.length }} 条订单记录</span>
      </div>
      
      <div
        v-for="(item, index) in orders"
        :key="item.orderId"
        class="order-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="order-body">
          <div class="product-info">
            <div class="product-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="product-details">
              <h3 class="product-name">{{ item.productName }}</h3>
              <div class="product-meta">
                <span class="quantity">
                  <i class="fas fa-cubes"></i>
                  数量: {{ item.quantity }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="order-footer">
            <div class="order-time">
              <i class="fas fa-clock"></i>
              <span>{{ formatDate(item.createTime) }}</span>
            </div>
            <div class="order-price">
              <span class="price-label">订单金额</span>
              <span class="price-value">¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <h3>暂无订单记录</h3>
      <p class="empty-tip">您还没有任何订单记录哦~</p>
      <button class="shop-now-btn" @click="goToShop">
        <i class="fas fa-shopping-bag"></i>
        立即购物
      </button>
    </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

// 响应式数据
const orders = ref([])
const loading = ref(true)

// 获取用户订单记录
const fetchUserOrders = async () => {
  try {
    console.log('=== 获取用户订单记录 ===')
    
    // 获取当前登录用户信息
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      console.error('未找到用户信息')
      loading.value = false
      return
    }
    
    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.userId
    
    if (!userId) {
      console.error('用户ID不存在')
      loading.value = false
      return
    }
    
    try {
      // 调用后端API获取订单记录
      const response = await axios.get(`${API_BASE_URL}/getOrderInfoByUserId`, {
        params: { 
          userId: userId
        }
      })
      
      console.log('后端订单记录响应:', response.data)
      
      if (response.data && response.data.code === 200) {
        orders.value = response.data.data || []
        console.log('从后端加载订单记录成功:', orders.value.length, '条')
      } else {
        throw new Error('获取订单记录失败: ' + (response.data?.msg || '未知错误'))
      }
      
    } catch (apiError) {
      console.error('获取订单记录API调用失败:', apiError.message)
      orders.value = []
    }
    
  } catch (error) {
    console.error('获取订单记录时发生错误:', error)
    
    // 错误处理：显示空数据
    orders.value = []
  } finally {
    loading.value = false
  }
}

// 格式化日期时间
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return dateStr
  }
}

// 跳转到商城
const goToShop = () => {
  // 这里可以实现跳转到商城的逻辑
  console.log('跳转到商城')
  // 例如：router.push('/shop')
}

// 组件挂载时获取数据
onMounted(() => {
  console.log('订单记录组件挂载，开始获取数据...')
  fetchUserOrders()
})
</script>

<style scoped>
.order-record-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.header-text h1 {
  margin: 0;
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
}

.header-text p {
  margin: 5px 0 0 0;
  color: #718096;
  font-size: 16px;
}

.order-list {
  max-width: 800px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #4a5568;
  font-size: 16px;
  margin: 0;
}

.orders-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.orders-summary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px 25px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.orders-count {
  color: #4a5568;
  font-weight: 600;
  font-size: 14px;
}

.order-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideInUp 0.6s ease forwards;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.order-body {
  padding: 25px;
}

.product-info {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.product-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
}

.product-details {
  flex: 1;
}

.product-name {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 14px;
}

.quantity i {
  color: #667eea;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.order-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 14px;
}

.order-time i {
  color: #667eea;
}

.order-price {
  text-align: right;
}

.price-label {
  display: block;
  color: #718096;
  font-size: 12px;
  margin-bottom: 4px;
}

.price-value {
  color: #e53e3e;
  font-size: 20px;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  margin: 0 auto 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
}

.empty-tip {
  font-size: 16px;
  color: #718096;
  margin: 0 0 30px 0;
}

.shop-now-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.shop-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.shop-now-btn i {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-record-container {
    padding: 15px;
  }
  
  .page-header {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .header-text h1 {
    font-size: 24px;
  }
  
  .order-card {
    margin: 0 -5px;
  }
  
  .order-body {
    padding: 20px;
  }
  
  .product-info {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .order-footer {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .empty-state {
    padding: 60px 15px;
  }
}
</style>
