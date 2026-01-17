<!-- filepath: d:\PetHospital\pet-hospital\src\BookingRecord.vue -->
<template>
  <div class="booking-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <p>🔄 正在加载预约记录...</p>
    </div>
    
    <!-- 预约记录列表 -->
    <div v-else-if="appointments.length > 0">
      <div
        v-for="item in appointments"
        :key="item.appointmentId"
        class="booking-card"
      >
        <div class="booking-row">
          <span class="booking-label">预约日期</span>
          <span class="booking-value">{{ item.date }}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">预约时间</span>
          <span class="booking-value">{{ item.time }}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">医生名字</span>
          <span class="booking-value">{{ item.doctorName || '加载中...' }}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">医生位置</span>
          <span class="booking-value">{{ item.doctorLocation || '加载中...' }}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">状态</span>
          <span
            class="booking-status"
            :class="{
              pending: item.status === 'pending',
              approved: item.status === 'approved',
              rejected: item.status === 'rejected'
            }"
          >
            {{ getStatusText(item.status) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>📝 暂无预约记录</p>
      <p class="empty-tip">您还没有任何预约记录哦~</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

// 响应式数据
const appointments = ref([])
const loading = ref(true)

// 获取用户预约记录
const fetchUserAppointments = async () => {
  try {
    console.log('=== 获取用户预约记录 ===')
    
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
      // 调用后端API获取预约记录
      const response = await axios.get(`${API_BASE_URL}/getAppointmentsById`, {
        params: { 
          idType: 'userId',
          id: userId 
        }
      })
      
      console.log('后端预约记录响应:', response.data)
      
      if (response.data && response.data.code === 200) {
        appointments.value = response.data.data || []
        console.log('从后端加载预约记录成功:', appointments.value.length, '条')
        
        // 获取每个预约的医生信息
        await fetchDoctorInfo()
      } else {
        throw new Error('获取预约记录失败: ' + (response.data?.msg || '未知错误'))
      }
      
    } catch (apiError) {
      console.error('获取预约记录API调用失败:', apiError.message)
      appointments.value = []
    }
    
  } catch (error) {
    console.error('获取预约记录时发生错误:', error)
    
    // 错误处理：显示空数据
    appointments.value = []
  } finally {
    loading.value = false
  }
}

// 获取医生信息
const fetchDoctorInfo = async () => {
  try {
    console.log('=== 开始获取医生信息 ===')
    
    // 为每个预约获取医生信息
    for (let appointment of appointments.value) {
      if (appointment.doctorId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/getDoctorById`, {
            params: { 
              doctorId: appointment.doctorId 
            }
          })
          
          console.log(`医生ID ${appointment.doctorId} 信息响应:`, response.data)
          
          if (response.data && response.data.code === 200 && response.data.data) {
            const doctorData = response.data.data
            // 添加医生信息到预约记录中
            appointment.doctorName = doctorData.name || '未知医生'
            appointment.doctorLocation = doctorData.location || '未知位置'
            console.log(`医生信息获取成功: ${doctorData.name}, ${doctorData.location}`)
          } else {
            console.warn(`获取医生ID ${appointment.doctorId} 信息失败`)
            appointment.doctorName = '获取失败'
            appointment.doctorLocation = '获取失败'
          }
        } catch (doctorError) {
          console.error(`获取医生ID ${appointment.doctorId} 信息时出错:`, doctorError)
          appointment.doctorName = '获取失败'
          appointment.doctorLocation = '获取失败'
        }
      } else {
        appointment.doctorName = '无医生信息'
        appointment.doctorLocation = '无位置信息'
      }
    }
    
    console.log('医生信息获取完成')
  } catch (error) {
    console.error('获取医生信息时发生错误:', error)
  }
}

// 状态文本转换
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'approved': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[status] || status
}

// 组件挂载时获取数据
onMounted(() => {
  console.log('预约记录组件挂载，开始获取数据...')
  fetchUserAppointments()
})
</script>

<style scoped>
.booking-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 600px;         /* 缩短整体宽度 */
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

.booking-card {
  background: #f7fafd;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(41,122,184,0.08);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 6px solid #1976d2;
  transition: box-shadow 0.2s;
}
.booking-card:hover {
  box-shadow: 0 4px 24px rgba(41,122,184,0.16);
}
.booking-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
}
.booking-label {
  color: #305aa2;
  font-weight: 600;
  min-width: 100px;     /* 保持左侧部分宽度不变，与病例记录一致 */
  display: inline-block;
}
.booking-value {
  color: #222;
  font-weight: 500;
}
.booking-status {
  font-weight: bold;
  padding: 2px 16px;
  border-radius: 8px;
  font-size: 16px;
  background: #e3f0ff;
  color: #1976d2;
  border: 1.5px solid #b6d0f7;
  transition: background 0.2s, color 0.2s;
}
.booking-status.pending {
  background: #fffbe6;
  color: #fbc02d;
  border-color: #ffe082;
}
.booking-status.approved {
  background: #e8f5e9;
  color: #43a047;
  border-color: #a5d6a7;
}
.booking-status.rejected {
  background: #ffebee;
  color: #d32f2f;
  border-color: #ffcdd2;
}
.empty-tip {
  font-size: 14px;
  color: #999;
  margin-top: 8px;
}

.booking-card {
  background: #f7fafd;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(41,122,184,0.08);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 6px solid #1976d2;
  transition: box-shadow 0.2s;
}
.booking-card:hover {
  box-shadow: 0 4px 24px rgba(41,122,184,0.16);
}
.booking-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
}
.booking-label {
  color: #305aa2;
  font-weight: 600;
  min-width: 100px;     /* 保持左侧部分宽度不变，与病例记录一致 */
  display: inline-block;
}
.booking-value {
  color: #222;
  font-weight: 500;
}
.booking-status {
  font-weight: bold;
  padding: 2px 16px;
  border-radius: 8px;
  font-size: 16px;
  background: #e3f0ff;
  color: #1976d2;
  border: 1.5px solid #b6d0f7;
  transition: background 0.2s, color 0.2s;
}
.booking-status.pending {
  background: #fffbe6;
  color: #fbc02d;
  border-color: #ffe082;
}
.booking-status.approved {
  background: #e8f5e9;
  color: #43a047;
  border-color: #a5d6a7;
}
.booking-status.rejected {
  background: #ffebee;
  color: #d32f2f;
  border-color: #ffcdd2;
}
</style>