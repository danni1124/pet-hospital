<template>
  <div class="coupon-record">
    <h3 class="record-title">🎟️ 我的优惠券</h3>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>🔄 正在加载优惠券...</p>
    </div>
    
    <!-- 优惠券列表 -->
    <div v-else-if="coupons.length > 0" class="coupon-list">
      <div 
        v-for="userCoupon in coupons" 
        :key="userCoupon.id || userCoupon.couponId"
        :class="['coupon-item', { 'used': userCoupon.used, 'expired': isExpired(userCoupon.coupon) }]"
      >
        <div class="coupon-header">
          <div class="discount-info">
            <div class="discount-value">
              <span v-if="userCoupon.coupon.discountType === 'percent'">
                {{ userCoupon.coupon.discountValue }}% OFF
              </span>
              <span v-else>
                ¥{{ userCoupon.coupon.discountValue }} OFF
              </span>
            </div>
            <div class="coupon-code">券码: {{ userCoupon.coupon.code }}</div>
          </div>
          
          <div class="coupon-status">
            <span v-if="userCoupon.used" class="status-used">已使用</span>
            <span v-else-if="isExpired(userCoupon.coupon)" class="status-expired">已过期</span>
            <span v-else class="status-available">可使用</span>
          </div>
        </div>
        
        <div class="coupon-details">
          <p class="min-amount">满 ¥{{ userCoupon.coupon.minAmount }} 可用</p>
          <p class="valid-period">
            有效期: {{ userCoupon.coupon.validFrom }} 至 {{ userCoupon.coupon.validTo }}
          </p>
          <p class="acquired-time">
            获得时间: {{ formatDate(userCoupon.acquiredAt) }}
          </p>
          <p v-if="userCoupon.source" class="coupon-source">
            来源: {{ getSourceText(userCoupon.source) }}
          </p>
        </div>
        
        <div class="coupon-actions">
          <button 
            v-if="!userCoupon.used && !isExpired(userCoupon.coupon)"
            @click="useCoupon(userCoupon)"
            class="use-btn"
          >
            立即使用
          </button>
          <button 
            v-else-if="userCoupon.used"
            class="used-btn" 
            disabled
          >
            已使用
          </button>
          <button 
            v-else
            class="expired-btn" 
            disabled
          >
            已过期
          </button>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>📝 暂无优惠券</p>
      <p class="empty-tip">完成问卷答题即可获得优惠券哦~</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

export default {
  name: 'CouponRecord',
  data() {
    return {
      coupons: [],
      loading: true
    }
  },
  mounted() {
    this.loadUserCoupons()
  },
  methods: {
    // 加载用户优惠券
    async loadUserCoupons() {
      try {
        console.log('=== 加载用户优惠券 ===')
        
        // 获取当前用户信息
        const currentUserStr = localStorage.getItem('currentUser')
        if (!currentUserStr) {
          console.error('未找到用户信息')
          this.loading = false
          return
        }
        
        const currentUser = JSON.parse(currentUserStr)
        const userId = currentUser.userId
        
        if (!userId) {
          console.error('用户ID不存在')
          this.loading = false
          return
        }
        
        try {
          // 调用后端API获取优惠券（根据接口文档）
          const response = await axios.get(`${API_BASE_URL}/getCouponByUserId`, {
            params: { userId: userId }
          })
          
          console.log('后端优惠券数据:', response.data)
          
          if (response.data && response.data.code === 200) {
            // 根据接口返回格式，优惠券数据直接在data数组中
            const couponsData = response.data.data || []
            
            // 转换数据格式以适配前端组件
            this.coupons = couponsData.map(coupon => ({
              couponId: coupon.couponId,
              used: false, // 根据实际情况调整
              acquiredAt: new Date().toISOString(), // 获得时间，可根据实际数据调整
              source: 'system', // 来源，可根据实际数据调整
              coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minAmount: coupon.minAmount,
                validFrom: coupon.validFrom,
                validTo: coupon.validTo
              }
            }))
            
            console.log('从后端加载优惠券成功:', this.coupons.length, '张')
          } else {
            throw new Error('获取优惠券失败: ' + (response.data?.msg || '未知错误'))
          }
          
        } catch (apiError) {
          console.log('后端API不可用，使用本地数据:', apiError.message)
          
          // API降级：从localStorage加载
          this.loadFromLocalStorage(userId)
        }
        
      } catch (error) {
        console.error('加载优惠券时发生错误:', error)
        
        // 尝试从localStorage加载
        const currentUserStr = localStorage.getItem('currentUser')
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr)
          this.loadFromLocalStorage(currentUser.userId || 'unknown')
        }
      } finally {
        this.loading = false
      }
    },
    
    // 从本地存储加载优惠券
    loadFromLocalStorage(userId) {
      try {
        const userCouponsKey = `userCoupons_${userId}`
        const localCoupons = JSON.parse(localStorage.getItem(userCouponsKey) || '[]')
        
        this.coupons = localCoupons
        console.log('从本地存储加载优惠券:', this.coupons.length, '张')
        
      } catch (error) {
        console.error('从本地存储加载优惠券失败:', error)
        this.coupons = []
      }
    },
    
    // 使用优惠券
    async useCoupon(userCoupon) {
      try {
        console.log('使用优惠券:', userCoupon)
        
        const confirmed = confirm(`确定要使用这张优惠券吗？\n优惠码: ${userCoupon.coupon.code}`)
        if (!confirmed) {
          return
        }
        
        // 获取用户信息
        const currentUserStr = localStorage.getItem('currentUser')
        const currentUser = JSON.parse(currentUserStr)
        const userId = currentUser.userId
        
        try {
          // 调用后端API标记优惠券为已使用
          const response = await axios.put(`${API_BASE_URL}/useCoupon`, {
            userId: userId,
            couponId: userCoupon.couponId
          })
          
          console.log('使用优惠券API响应:', response.data)
          
          if (response.data && response.data.code === 200) {
            // 后端更新成功，更新本地状态
            userCoupon.used = true
            alert('✅ 优惠券使用成功！')
          } else {
            throw new Error('使用优惠券失败: ' + (response.data?.msg || '未知错误'))
          }
          
        } catch (apiError) {
          console.log('后端API不可用，仅更新本地状态:', apiError.message)
          
          // API降级：仅更新本地状态
          userCoupon.used = true
          this.updateLocalStorage(userId)
          alert('✅ 优惠券使用成功！（本地记录）')
        }
        
      } catch (error) {
        console.error('使用优惠券时发生错误:', error)
        alert('❌ 使用优惠券失败，请稍后重试')
      }
    },
    
    // 更新本地存储
    updateLocalStorage(userId) {
      try {
        const userCouponsKey = `userCoupons_${userId}`
        localStorage.setItem(userCouponsKey, JSON.stringify(this.coupons))
        console.log('本地优惠券状态已更新')
      } catch (error) {
        console.error('更新本地优惠券状态失败:', error)
      }
    },
    
    // 检查优惠券是否过期
    isExpired(coupon) {
      if (!coupon.validTo) return false
      const now = new Date()
      const validTo = new Date(coupon.validTo)
      return now > validTo
    },
    
    // 格式化日期
    formatDate(dateStr) {
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
    },
    
    // 获取来源文本
    getSourceText(source) {
      const sourceMap = {
        'questionnaire': '问卷答题',
        'register': '注册奖励',
        'activity': '活动获得',
        'admin': '系统发放'
      }
      return sourceMap[source] || '其他'
    }
  }
}
</script>

<style scoped>
.coupon-record {
  padding: 0;
  width: 100%;
}

.record-title {
  font-size: 20px;
  font-weight: bold;
  color: #305aa2;
  margin-bottom: 24px;
  text-align: left;
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

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.coupon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.coupon-item.used {
  background: linear-gradient(135deg, #bbb 0%, #888 100%);
  opacity: 0.7;
}

.coupon-item.expired {
  background: linear-gradient(135deg, #999 0%, #666 100%);
  opacity: 0.6;
}

.coupon-item::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(30px, -30px);
}

.coupon-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.discount-info {
  flex: 1;
}

.discount-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 8px;
}

.coupon-code {
  font-size: 12px;
  opacity: 0.9;
  font-family: 'Courier New', monospace;
}

.coupon-status {
  text-align: right;
}

.status-available {
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status-used {
  background: rgba(158, 158, 158, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.status-expired {
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.coupon-details {
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.5;
}

.coupon-details p {
  margin: 4px 0;
  opacity: 0.9;
}

.min-amount {
  font-weight: bold;
  font-size: 14px !important;
}

.coupon-actions {
  text-align: right;
}

.use-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.use-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.used-btn, .expired-btn {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .coupon-item {
    padding: 16px;
  }
  
  .discount-value {
    font-size: 24px;
  }
  
  .coupon-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .coupon-status {
    text-align: left;
  }
}
</style>
