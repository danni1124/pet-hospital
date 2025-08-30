<template>
  <div class="order-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>🔄 正在加载订单记录...</p>
    </div>
    
    <!-- 订单记录列表 -->
    <div v-else-if="orders.length > 0">
      <div
        v-for="item in orders"
        :key="item.orderId"
        class="order-card"
      >
        <div class="order-row">
          <span class="order-label">商品名称</span>
          <span class="order-value">{{ item.productName }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">数量</span>
          <span class="order-value">{{ item.quantity }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">价格</span>
          <span class="order-value">¥{{ item.price }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">下单时间</span>
          <span class="order-value">{{ formatDate(item.createTime) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>�️ 暂无订单记录</p>
      <p class="empty-tip">您还没有任何订单记录哦~</p>
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
      console.log('后端API不可用:', apiError.message)
      
      // API降级方案已注释，只保留真实API调用
      // loadLocalOrders(userId)
      
      // 显示空数据
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

// 本地降级数据函数（已注释，不再使用）
/*
const loadLocalOrders = (userId) => {
  // 模拟订单数据（根据后端接口返回的数据结构）
  const mockOrders = [
    {
      orderId: 1,
      userId: userId,
      productName: '宠物营养膏（猫用）',
      quantity: 2,
      price: 89.00,
      createTime: '2025-07-20 10:30:00'
    },
    {
      orderId: 2,
      userId: userId,
      productName: '膨润土猫砂 10kg',
      quantity: 1,
      price: 56.00,
      createTime: '2025-07-25 15:20:00'
    },
    {
      orderId: 3,
      userId: userId,
      productName: '皇家狗粮 5kg装',
      quantity: 1,
      price: 128.00,
      createTime: '2025-07-28 09:45:00'
    },
    {
      orderId: 4,
      userId: userId,
      productName: '宠物玩具套装（3件套）',
      quantity: 1,
      price: 45.00,
      createTime: '2025-07-30 16:10:00'
    }
  ]
  
  orders.value = mockOrders
  console.log('使用本地降级订单数据:', orders.value.length, '条')
}
*/

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

// 组件挂载时获取数据
onMounted(() => {
  console.log('订单记录组件挂载，开始获取数据...')
  fetchUserOrders()
})
</script>

<style scoped>
.order-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 600px;
  max-height: 340px;
  overflow-y: auto;
  padding-right: 8px;
  box-sizing: border-box;
  margin: 0 auto;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-tip {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.order-card {
  background: #f7fafd;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(41,122,184,0.08);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 6px solid #4CAF50;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: 0 4px 24px rgba(41,122,184,0.16);
}

.order-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
}

.order-label {
  color: #305aa2;
  font-weight: 600;
  min-width: 100px;
  display: inline-block;
}

.order-value {
  color: #222;
  font-weight: 500;
}
</style>
