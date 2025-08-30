<template>
  <div class="order-list">
    <!-- 鍔犺浇鐘舵€� -->
    <div v-if="loading" class="loading-state">
      <p>馃攧 姝ｅ湪鍔犺浇璁㈠崟璁板綍...</p>
    </div>
    
    <!-- 璁㈠崟璁板綍鍒楄〃 -->
    <div v-else-if="orders.length > 0">
      <div
        v-for="item in orders"
        :key="item.orderId"
        class="order-card"
      >
        <div class="order-row">
          <span class="order-label">鍟嗗搧鍚嶇О</span>
          <span class="order-value">{{ item.productName }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">鏁伴噺</span>
          <span class="order-value">{{ item.quantity }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">浠锋牸</span>
          <span class="order-value">楼{{ item.price }}</span>
        </div>
        <div class="order-row">
          <span class="order-label">涓嬪崟鏃堕棿</span>
          <span class="order-value">{{ formatDate(item.createTime) }}</span>
        </div>
      </div>
    </div>
    
    <!-- 绌虹姸鎬� -->
    <div v-else class="empty-state">
      <p>锟斤笍 鏆傛棤璁㈠崟璁板綍</p>
      <p class="empty-tip">鎮ㄨ繕娌℃湁浠讳綍璁㈠崟璁板綍鍝</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

// 鍝嶅簲寮忔暟鎹�
const orders = ref([])
const loading = ref(true)

// 鑾峰彇鐢ㄦ埛璁㈠崟璁板綍
const fetchUserOrders = async () => {
  try {
    console.log('=== 鑾峰彇鐢ㄦ埛璁㈠崟璁板綍 ===')
    
    // 鑾峰彇褰撳墠鐧诲綍鐢ㄦ埛淇℃伅
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      console.error('鏈壘鍒扮敤鎴蜂俊鎭�')
      loading.value = false
      return
    }
    
    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.userId
    
    if (!userId) {
      console.error('鐢ㄦ埛ID涓嶅瓨鍦�')
      loading.value = false
      return
    }
    
    try {
      // 璋冪敤鍚庣API鑾峰彇璁㈠崟璁板綍
      const response = await axios.get(`${API_BASE_URL}/getOrderInfoByUserId`, {
        params: { 
          userId: userId
        }
      })
      
      console.log('鍚庣璁㈠崟璁板綍鍝嶅簲:', response.data)
      
      if (response.data && response.data.code === 200) {
        orders.value = response.data.data || []
        console.log('浠庡悗绔姞杞借鍗曡褰曟垚鍔�:', orders.value.length, '鏉�')
      } else {
        throw new Error('鑾峰彇璁㈠崟璁板綍澶辫触: ' + (response.data?.msg || '鏈煡閿欒'))
      }
      
    } catch (apiError) {
      console.log('鍚庣API涓嶅彲鐢紝浣跨敤鏈湴闄嶇骇鏁版嵁:', apiError.message)
      
      // API闄嶇骇锛氫娇鐢ㄦ湰鍦版ā鎷熸暟鎹�
      loadLocalOrders(userId)
    }
    
  } catch (error) {
    console.error('鑾峰彇璁㈠崟璁板綍鏃跺彂鐢熼敊璇�:', error)
    
    // 閿欒澶勭悊锛氭樉绀虹┖鏁版嵁
    orders.value = []
  } finally {
    loading.value = false
  }
}

// 鏈湴闄嶇骇鏁版嵁锛圓PI涓嶅彲鐢ㄦ椂鐨勫鐢ㄦ柟妗堬級
const loadLocalOrders = (userId) => {
  // 妯℃嫙璁㈠崟鏁版嵁锛堟牴鎹悗绔帴鍙ｈ繑鍥炵殑鏁版嵁缁撴瀯锛�
  const mockOrders = [
    {
      orderId: 1,
      userId: userId,
      productName: '瀹犵墿钀ュ吇鑶忥紙鐚敤锛�',
      quantity: 2,
      price: 89.00,
      createTime: '2025-07-20 10:30:00'
    },
    {
      orderId: 2,
      userId: userId,
      productName: '鑶ㄦ鼎鍦熺尗鐮� 10kg',
      quantity: 1,
      price: 56.00,
      createTime: '2025-07-25 15:20:00'
    },
    {
      orderId: 3,
      userId: userId,
      productName: '鐨囧鐙楃伯 5kg瑁�',
      quantity: 1,
      price: 128.00,
      createTime: '2025-07-28 09:45:00'
    },
    {
      orderId: 4,
      userId: userId,
      productName: '瀹犵墿鐜╁叿濂楄锛�3浠跺锛�',
      quantity: 1,
      price: 45.00,
      createTime: '2025-07-30 16:10:00'
    }
  ]
  
  orders.value = mockOrders
  console.log('浣跨敤鏈湴闄嶇骇璁㈠崟鏁版嵁:', orders.value.length, '鏉�')
}

// 鏍煎紡鍖栨棩鏈熸椂闂�
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

// 缁勪欢鎸傝浇鏃惰幏鍙栨暟鎹�
onMounted(() => {
  console.log('璁㈠崟璁板綍缁勪欢鎸傝浇锛屽紑濮嬭幏鍙栨暟鎹�...')
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
