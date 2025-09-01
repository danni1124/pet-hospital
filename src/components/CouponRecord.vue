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
        :class="['coupon-item', { 'used': userCoupon.used === '是', 'expired': isExpired(userCoupon.coupon) }]"
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
            <span v-if="userCoupon.used === '是'" class="status-used">已使用</span>
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
            v-if="userCoupon.used !== '是' && !isExpired(userCoupon.coupon)"
            @click="useCoupon(userCoupon)"
            class="use-btn"
          >
            立即使用
          </button>
          <button 
            v-else-if="userCoupon.used === '是'"
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
          // 调用后端API获取用户优惠券关联数据
          const response = await axios.get(`${API_BASE_URL}/getCouponByUserId`, {
            params: { userId: userId }
          })
          
          console.log('后端优惠券数据:', response.data)
          
          if (response.data && response.data.code === 200) {
            // 后端返回的是用户优惠券关联数据，包含used状态
            const userCouponsData = response.data.data || []
            
            // 转换数据格式以适配前端组件
            this.coupons = userCouponsData.map(userCoupon => ({
              id: userCoupon.id,
              couponId: userCoupon.couponId,
              used: userCoupon.used, // 使用后端返回的真实状态
              acquiredAt: userCoupon.acquiredAt || new Date().toISOString(),
              source: 'backend', // 来源标记为后端
              coupon: userCoupon.coupon || {
                code: userCoupon.code,
                discountType: userCoupon.discountType,
                discountValue: userCoupon.discountValue,
                minAmount: userCoupon.minAmount,
                validFrom: userCoupon.validFrom,
                validTo: userCoupon.validTo
              }
            }))
            
            console.log('从后端加载优惠券成功:', this.coupons.length, '张')
          } else {
            throw new Error('获取优惠券失败: ' + (response.data?.msg || '未知错误'))
          }
          
        } catch (apiError) {
          console.error('获取优惠券失败:', apiError.message)
          this.coupons = []
        }
        
      } catch (error) {
        console.error('加载优惠券时发生错误:', error)
        this.coupons = []
      } finally {
        this.loading = false
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
        
        // 验证必要的参数
        if (!userCoupon.couponId || !userId) {
          alert('❌ 缺少必要的参数信息')
          return
        }
        
        console.log('使用优惠券参数:', {
          couponId: parseInt(userCoupon.couponId),
          userId: parseInt(userId),
          status: "是"
        })
        
        try {
          // 调用后端API标记优惠券为已使用
          // 根据后端接口定义，使用查询参数方式传递数据
          const response = await axios.post(`${API_BASE_URL}/updateCouponUsed`, null, {
            params: {
              couponId: parseInt(userCoupon.couponId),  // 确保是Integer类型
              userId: parseInt(userId),                  // 确保是Integer类型
              status: "是"                              // String类型
            },
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          console.log('使用优惠券API响应:', response.data)
          
          // 检查响应是否成功
          if (response.data && response.data.code === 200) {
            // 后端更新成功，更新本地状态
            userCoupon.used = "是"  // 更新为数据库的ENUM值
            this.updateLocalStorage(userId)
            alert('✅ 优惠券使用成功！')
            console.log('优惠券使用成功，本地状态已更新')
          } else {
            // 处理业务逻辑错误
            const errorMsg = response.data?.msg || response.data?.message || '未知错误'
            throw new Error('使用优惠券失败: ' + errorMsg)
          }
          
        } catch (apiError) {
          console.error('调用后端API失败:', apiError)
          console.error('API错误详情:', {
            message: apiError.message,
            response: apiError.response?.data,
            status: apiError.response?.status,
            statusText: apiError.response?.statusText,
            url: `${API_BASE_URL}/updateCouponUsed`,
            params: {
              couponId: parseInt(userCoupon.couponId),
              userId: parseInt(userId),
              status: "是"
            }
          })
          
          let errorMessage = '使用优惠券失败'
          if (apiError.response?.data?.msg) {
            errorMessage += ': ' + apiError.response.data.msg
          } else if (apiError.response?.status) {
            errorMessage += ': HTTP ' + apiError.response.status + ' - ' + (apiError.response.statusText || '未知错误')
          } else if (apiError.message) {
            errorMessage += ': ' + apiError.message
          }
          
          throw new Error(errorMessage)
        }
        
      } catch (error) {
        console.error('使用优惠券时发生错误:', error)
        alert('❌ 使用优惠券失败，请稍后重试')
      }
    },
    
    // 更新本地缓存
    updateLocalStorage(userId) {
      try {
        const userCouponsKey = `userCoupons_${userId}`
        localStorage.setItem(userCouponsKey, JSON.stringify(this.coupons))
        console.log('本地优惠券缓存已更新')
      } catch (error) {
        console.error('更新本地优惠券缓存失败:', error)
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