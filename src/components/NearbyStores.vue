<template>
  <div class="nearby-stores">
    <!-- 触发按钮 -->
    <button @click="showStoresModal = true" class="nav-btn stores-trigger">
      <i class="fas fa-map-marker-alt"></i> 附近门店
    </button>

    <!-- 门店弹窗 -->
    <div v-if="showStoresModal" class="stores-modal-overlay" @click="closeModal">
      <div class="stores-modal-content" @click.stop>
        <div class="stores-header">
          <h2>
            <i class="fas fa-store"></i>
            附近门店
          </h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="stores-body">
          <!-- 获取门店按钮 -->
          <div class="fetch-stores-section">
            <!-- 位置状态提示 -->
            <div v-if="!userLocation.isLocationReady" class="location-status">
              <i class="fas fa-map-marker-alt fa-spin"></i>
              正在获取您的位置...
            </div>
            <div v-else class="location-status ready">
              <i class="fas fa-map-marker-alt"></i>
              位置获取成功，显示精确距离
            </div>
            
            <button 
              @click="fetchStoresFromAPI" 
              :disabled="isLoading"
              class="fetch-stores-btn"
            >
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
              {{ isLoading ? '获取中...' : '获取附近门店' }}
            </button>
            
            <button 
              @click="showAddStoreForm = true" 
              class="add-store-btn"
              v-if="props.isManager"
            >
              <i class="fas fa-plus"></i>
              添加门店
            </button>
          </div>

          <!-- 添加门店表单 -->
          <div v-if="showAddStoreForm" class="add-store-form">
            <div class="form-header">
              <h3>
                <i class="fas fa-plus-circle"></i>
                添加新门店
              </h3>
              <button @click="cancelAddStore" class="cancel-form-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <form @submit.prevent="submitAddStore" class="store-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="storeName">门店名称 *</label>
                  <input 
                    type="text" 
                    id="storeName"
                    v-model="newStore.name"
                    placeholder="请输入门店名称"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="storePhone">联系电话 *</label>
                  <input 
                    type="text" 
                    id="storePhone"
                    v-model="newStore.phone"
                    placeholder="请输入11位手机号码"
                    maxlength="11"
                    pattern="[0-9]*"
                    required
                    @input="validatePhone"
                    @blur="validatePhone"
                    :class="{ 'error': phoneError }"
                  />
                  <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="storeAddress">门店地址 *</label>
                <input 
                  type="text" 
                  id="storeAddress"
                  v-model="newStore.address"
                  placeholder="请输入详细地址"
                  required
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="storeLatitude">纬度 * <span class="field-hint">(-90 到 90)</span></label>
                  <input 
                    type="number" 
                    id="storeLatitude"
                    v-model="newStore.latitude"
                    placeholder="请输入纬度"
                    min="-90"
                    max="90"
                    step="0.000001"
                    required
                    @input="validateLatitude"
                    @blur="validateLatitude"
                    :class="{ 'error': latError }"
                  />
                  <span v-if="latError" class="error-text">{{ latError }}</span>
                </div>
                <div class="form-group">
                  <label for="storeLongitude">经度 * <span class="field-hint">(-180 到 180)</span></label>
                  <input 
                    type="number" 
                    id="storeLongitude"
                    v-model="newStore.longitude"
                    placeholder="请输入经度"
                    min="-180"
                    max="180"
                    step="0.000001"
                    required
                    @input="validateLongitude"
                    @blur="validateLongitude"
                    :class="{ 'error': lngError }"
                  />
                  <span v-if="lngError" class="error-text">{{ lngError }}</span>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="storeHours">营业时间 *</label>
                  <div class="time-picker-group">
                    <div class="time-input">
                      <label>开门时间</label>
                      <input 
                        type="time" 
                        v-model="openTime"
                        @change="updateBusinessHours"
                        required
                      />
                    </div>
                    <span class="time-separator">至</span>
                    <div class="time-input">
                      <label>关门时间</label>
                      <input 
                        type="time" 
                        v-model="closeTime"
                        @change="updateBusinessHours"
                        required
                      />
                    </div>
                  </div>
                  <span v-if="businessHoursError" class="error-text">{{ businessHoursError }}</span>
                  <div class="business-hours-display" v-if="newStore.businessHours">
                    营业时间：{{ newStore.businessHours }}
                  </div>
                </div>
                <div class="form-group">
                  <label for="storeRating">评分</label>
                  <input 
                    type="number" 
                    id="storeRating"
                    v-model="newStore.rating"
                    placeholder="请输入评分 (0-5)"
                    min="0"
                    max="5"
                    step="0.1"
                    @input="validateRating"
                    @blur="validateRating"
                    :class="{ 'error': ratingError }"
                  />
                  <span v-if="ratingError" class="error-text">{{ ratingError }}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="busyLevel">繁忙程度 *</label>
                <select id="busyLevel" v-model="newStore.busyLevel" required>
                  <option value="">请选择繁忙程度</option>
                  <option value="1">空闲（绿色）</option>
                  <option value="2">适中（黄色）</option>
                  <option value="3">繁忙（红色）</option>
                </select>
              </div>
              
              <div class="form-actions">
                <button type="button" @click="cancelAddStore" class="cancel-btn">
                  取消
                </button>
                <button type="submit" :disabled="isAdding" class="submit-btn">
                  <i class="fas fa-save" :class="{ 'fa-spin': isAdding }"></i>
                  {{ isAdding ? '添加中...' : '添加门店' }}
                </button>
              </div>
            </form>
          </div>

          <!-- 门店列表 -->
          <div class="stores-list" v-if="storesList.length > 0">
            <div 
              v-for="store in storesList" 
              :key="store.storeId"
              class="store-card"
              :class="getBusyLevelClass(store.busyLevel)"
            >
              <div class="store-info">
                <div class="store-name">
                  <i class="fas fa-hospital"></i>
                  {{ store.name }}
                </div>
                <div class="store-details">
                  <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ formatDistance(store.distance) }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>{{ store.businessHours }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-star"></i>
                    <span>{{ store.rating }}分</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span class="busy-status" :class="getBusyLevelClass(store.busyLevel)">
                      {{ getBusyText(store.busyLevel) }}
                    </span>
                  </div>
                </div>
                <div class="store-address">
                  <i class="fas fa-location-arrow"></i>
                  {{ store.address }}
                </div>
                <div class="store-phone" v-if="store.phone">
                  <i class="fas fa-phone"></i>
                  {{ store.phone }}
                </div>
              </div>
              
              <div class="store-actions">
                <button 
                  @click="navigateToStore(store)" 
                  class="nav-button"
                  :class="getBusyLevelClass(store.busyLevel)"
                >
                  <i class="fas fa-route"></i>
                  到这去
                </button>
                <button 
                  @click="deleteStore(store.storeId)" 
                  class="delete-button"
                  title="删除门店"
                  v-if="props.isManager"
                >
                  <i class="fas fa-trash-alt"></i>
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!isLoading" class="empty-state">
            <i class="fas fa-map-marked-alt"></i>
            <p>点击"获取附近门店"按钮查看附近的宠物医院</p>
          </div>

          <!-- 导航提示 -->
          <div class="navigation-tip" v-if="storesList.length > 0">
            <p>
              <i class="fas fa-mobile-alt"></i>
              点击"到这去"直接跳转高德/腾讯地图。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/index.js'

// 定义props
const props = defineProps({
  isManager: {
    type: Boolean,
    default: false
  }
})

const showStoresModal = ref(false)
const isLoading = ref(false)
const isAdding = ref(false)
const storesList = ref([])
const showAddStoreForm = ref(false)

// 用户位置状态
const userLocation = ref({
  latitude: 39.9042, // 默认位置（北京）
  longitude: 116.4074,
  isLocationReady: false
})

// 表单验证错误状态
const latError = ref('')
const lngError = ref('')
const phoneError = ref('')
const ratingError = ref('')
const businessHoursError = ref('')

// 营业时间相关状态
const openTime = ref('')
const closeTime = ref('')

// 新门店表单数据
const newStore = ref({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  businessHours: '',
  rating: '',
  busyLevel: ''
})

// 从后端获取门店数据
const fetchStoresFromAPI = async () => {
  try {
    isLoading.value = true
    console.log('正在获取附近门店...')
    
    const response = await axios.get(`${API_BASE_URL}/getAllStores`)
    
    console.log('门店数据响应:', response.data)
    
    if (response.data && response.data.code === 200) {
      const stores = response.data.data || []
      
      // 转换后端数据格式
      storesList.value = stores.map(store => ({
        storeId: store.storeId,
        name: store.name,
        address: store.address,
        phone: store.phone,
        businessHours: store.businessHours,
        rating: store.rating,
        busyLevel: store.busyLevel,
        latitude: store.latitude,
        longitude: store.longitude,
        distance: calculateDistance(store.latitude, store.longitude), // 计算距离
        coordinates: { lat: store.latitude, lng: store.longitude }
      }))
      
      console.log('门店列表已更新:', storesList.value)
      
      if (stores.length === 0) {
        alert('暂无附近门店数据')
      }
    } else {
      throw new Error(response.data?.msg || '获取门店失败')
    }
    
  } catch (error) {
    console.error('获取门店失败:', error)
    alert('获取门店数据失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 重置新门店表单
const resetNewStoreForm = () => {
  newStore.value = {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    businessHours: '',
    rating: '',
    busyLevel: ''
  }
  // 清除验证错误
  latError.value = ''
  lngError.value = ''
  phoneError.value = ''
  ratingError.value = ''
  businessHoursError.value = ''
  
  // 清除时间选择器
  openTime.value = ''
  closeTime.value = ''
}

// 验证纬度
const validateLatitude = () => {
  const lat = parseFloat(newStore.value.latitude)
  latError.value = ''
  
  if (newStore.value.latitude === '') {
    return // 空值不验证
  }
  
  if (isNaN(lat)) {
    latError.value = '请输入有效的数字'
    return
  }
  
  if (lat < -90 || lat > 90) {
    latError.value = '纬度必须在-90到90之间'
    return
  }
  
  // 检查小数位数（最多6位小数）
  const decimalPlaces = (newStore.value.latitude.toString().split('.')[1] || '').length
  if (decimalPlaces > 6) {
    latError.value = '纬度小数位数不能超过6位'
    return
  }
}

// 验证经度
const validateLongitude = () => {
  const lng = parseFloat(newStore.value.longitude)
  lngError.value = ''
  
  if (newStore.value.longitude === '') {
    return // 空值不验证
  }
  
  if (isNaN(lng)) {
    lngError.value = '请输入有效的数字'
    return
  }
  
  if (lng < -180 || lng > 180) {
    lngError.value = '经度必须在-180到180之间'
    return
  }
  
  // 检查小数位数（最多6位小数）
  const decimalPlaces = (newStore.value.longitude.toString().split('.')[1] || '').length
  if (decimalPlaces > 6) {
    lngError.value = '经度小数位数不能超过6位'
    return
  }
}

// 验证电话号码
const validatePhone = () => {
  phoneError.value = ''
  
  if (newStore.value.phone === '') {
    return // 空值不验证
  }
  
  // 检查是否为纯数字
  if (!/^\d+$/.test(newStore.value.phone)) {
    phoneError.value = '电话号码只能包含数字'
    return
  }
  
  // 检查是否为11位
  if (newStore.value.phone.length !== 11) {
    phoneError.value = '电话号码必须为11位数字'
    return
  }
  
  // 检查是否以1开头（中国手机号格式）
  if (!newStore.value.phone.startsWith('1')) {
    phoneError.value = '请输入有效的手机号码'
    return
  }
}

// 验证评分
const validateRating = () => {
  ratingError.value = ''
  
  if (newStore.value.rating === '') {
    return // 空值不验证
  }
  
  const rating = parseFloat(newStore.value.rating)
  
  if (isNaN(rating)) {
    ratingError.value = '请输入有效的数字'
    return
  }
  
  if (rating < 0 || rating > 5) {
    ratingError.value = '评分必须在0-5之间'
    return
  }
  
  // 检查小数位数（最多1位小数）
  const ratingStr = newStore.value.rating.toString()
  if (ratingStr.includes('.')) {
    const decimalPlaces = ratingStr.split('.')[1].length
    if (decimalPlaces > 1) {
      ratingError.value = '评分最多只能有1位小数'
      return
    }
  }
  
  // 格式化评分，确保格式正确
  newStore.value.rating = rating.toString()
}

// 更新营业时间
const updateBusinessHours = () => {
  businessHoursError.value = ''
  
  if (!openTime.value || !closeTime.value) {
    newStore.value.businessHours = ''
    return
  }
  
  // 验证开门时间不能比关门时间晚
  if (openTime.value >= closeTime.value) {
    businessHoursError.value = '开门时间不能晚于或等于关门时间'
    newStore.value.businessHours = ''
    return
  }
  
  // 格式化营业时间
  newStore.value.businessHours = `${openTime.value}-${closeTime.value}`
}

// 验证整个表单
const validateForm = () => {
  validateLatitude()
  validateLongitude()
  validatePhone()
  validateRating()
  updateBusinessHours() // 验证营业时间
  
  // 检查是否有验证错误
  if (latError.value || lngError.value || phoneError.value || 
      ratingError.value || businessHoursError.value) {
    return false
  }
  
  // 检查必填字段
  if (!newStore.value.name || !newStore.value.address || 
      !newStore.value.latitude || !newStore.value.longitude ||
      !newStore.value.phone || !newStore.value.businessHours ||
      !newStore.value.busyLevel) {
    return false
  }
  
  return true
}

// 取消添加门店
const cancelAddStore = () => {
  showAddStoreForm.value = false
  resetNewStoreForm()
}

// 提交添加门店
const submitAddStore = async () => {
  // 首先验证表单
  if (!validateForm()) {
    alert('请检查表单输入是否正确')
    return
  }

  try {
    isAdding.value = true
    console.log('正在添加门店...', newStore.value)
    
    // 构建请求数据
    const storeData = {
      name: newStore.value.name,
      address: newStore.value.address,
      latitude: parseFloat(newStore.value.latitude),
      longitude: parseFloat(newStore.value.longitude),
      phone: newStore.value.phone,
      businessHours: newStore.value.businessHours,
      rating: parseFloat(newStore.value.rating),
      busyLevel: parseInt(newStore.value.busyLevel)
    }
    
    console.log('发送门店数据:', storeData)
    
    const response = await axios.post(`${API_BASE_URL}/addStore`, storeData)
    
    console.log('添加门店响应:', response.data)
    
    if (response.data && response.data.code === 200) {
      alert('门店添加成功！')
      
      // 重置表单并关闭
      cancelAddStore()
      
      // 重新获取门店列表
      await fetchStoresFromAPI()
      
    } else {
      throw new Error(response.data?.msg || '添加门店失败')
    }
    
  } catch (error) {
    console.error('添加门店失败:', error)
    
    if (error.response) {
      // 服务器返回错误
      alert(`添加失败: ${error.response.data?.msg || error.message}`)
    } else if (error.request) {
      // 网络错误
      alert('网络连接失败，请检查网络后重试')
    } else {
      // 其他错误
      alert(`添加失败: ${error.message}`)
    }
  } finally {
    isAdding.value = false
  }
}

// 删除门店
const deleteStore = async (storeId) => {
  if (!confirm('确定要删除这个门店吗？此操作不可撤销。')) {
    return
  }
  
  try {
    console.log('正在删除门店，ID:', storeId)
    
    const response = await axios.delete(`${API_BASE_URL}/deleteStore`, {
      params: { storeId: storeId }
    })
    
    console.log('删除门店响应:', response.data)
    
    if (response.data && response.data.code === 200) {
      alert('门店删除成功！')
      
      // 重新获取门店列表
      await fetchStoresFromAPI()
      
    } else {
      throw new Error(response.data?.msg || '删除门店失败')
    }
    
  } catch (error) {
    console.error('删除门店失败:', error)
    
    if (error.response) {
      // 服务器返回错误
      alert(`删除失败: ${error.response.data?.msg || error.message}`)
    } else if (error.request) {
      // 网络错误
      alert('网络连接失败，请检查网络后重试')
    } else {
      // 其他错误
      alert(`删除失败: ${error.message}`)
    }
  }
}

// 计算距离（使用用户真实位置）
const calculateDistance = (lat, lng) => {
  const userLat = userLocation.value.latitude
  const userLng = userLocation.value.longitude
  
  const R = 6371 // 地球半径（公里）
  const dLat = (lat - userLat) * Math.PI / 180
  const dLng = (lng - userLng) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
}

// 格式化距离显示
const formatDistance = (distance) => {
  if (typeof distance === 'string') {
    return distance
  }
  return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
}

// 关闭弹窗
const closeModal = () => {
  showStoresModal.value = false
  // 关闭附近门店弹窗时自动关闭添加门店表单
  if (showAddStoreForm.value) {
    cancelAddStore()
  }
}

// 获取繁忙状态的CSS类
const getBusyLevelClass = (level) => {
  const levelMap = {
    1: 'green',
    2: 'yellow', 
    3: 'red'
  }
  return levelMap[level] || 'green'
}

// 获取繁忙状态文本
const getBusyText = (level) => {
  const busyTexts = {
    1: '空闲',
    2: '适中',
    3: '繁忙',
    green: '空闲',
    yellow: '适中',
    red: '繁忙'
  }
  return busyTexts[level] || '未知'
}

// 导航到门店
const navigateToStore = (store) => {
  // 构建高德地图URL
  const amapUrl = `https://uri.amap.com/navigation?to=${store.coordinates.lng},${store.coordinates.lat}&toname=${encodeURIComponent(store.name)}&coordinate=gaode&callnative=1`
  
  // 构建腾讯地图URL作为备选
  const qqmapUrl = `https://apis.map.qq.com/uri/v1/routeplan?type=drive&to=${encodeURIComponent(store.name)}&tocoord=${store.coordinates.lat},${store.coordinates.lng}&referer=PetHospital`
  
  // 尝试打开高德地图，如果失败则使用腾讯地图
  try {
    window.open(amapUrl, '_blank')
  } catch (error) {
    console.log('高德地图打开失败，尝试腾讯地图')
    window.open(qqmapUrl, '_blank')
  }
  
  // 关闭弹窗
  closeModal()
}

// 获取用户位置
const getUserLocation = () => {
  if (!navigator.geolocation) {
    console.warn('浏览器不支持地理位置服务，使用默认位置')
    userLocation.value.isLocationReady = true
    return
  }

  const options = {
    enableHighAccuracy: true, // 高精度定位
    timeout: 10000, // 10秒超时
    maximumAge: 300000 // 5分钟内的缓存位置有效
  }

  console.log('正在获取用户位置...')
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value.latitude = position.coords.latitude
      userLocation.value.longitude = position.coords.longitude
      userLocation.value.isLocationReady = true
      
      console.log('用户位置获取成功:', {
        latitude: userLocation.value.latitude,
        longitude: userLocation.value.longitude,
        accuracy: position.coords.accuracy
      })
      
      // 如果门店列表已经加载，重新计算距离
      if (storesList.value.length > 0) {
        updateStoresDistance()
      }
    },
    (error) => {
      console.warn('获取用户位置失败:', error.message)
      userLocation.value.isLocationReady = true // 即使失败也标记为已就绪，使用默认位置
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          console.warn('用户拒绝了地理位置请求，使用默认位置')
          break
        case error.POSITION_UNAVAILABLE:
          console.warn('位置信息不可用，使用默认位置')
          break
        case error.TIMEOUT:
          console.warn('获取位置超时，使用默认位置')
          break
        default:
          console.warn('获取位置时发生未知错误，使用默认位置')
          break
      }
    },
    options
  )
}

// 更新门店距离
const updateStoresDistance = () => {
  storesList.value = storesList.value.map(store => ({
    ...store,
    distance: calculateDistance(store.latitude, store.longitude)
  }))
  console.log('门店距离已更新')
}

onMounted(() => {
  // 获取用户位置
  getUserLocation()
})
</script>

<style scoped>
.nearby-stores {
  position: relative;
}

.stores-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #4a5568;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stores-trigger:hover {
  background: #f7fafc;
  color: #2d3748;
}

.stores-trigger.active {
  background: #e2e8f0;
  color: #2d3748;
}

/* 弹窗遮罩 */
.stores-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
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

/* 弹窗内容 */
.stores-modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 弹窗头部 */
.stores-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.stores-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stores-header h2 i {
  color: #3182ce;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #718096;
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
  background: #f7fafc;
  color: #2d3748;
}

/* 弹窗内容 */
.stores-body {
  padding: 0 24px 24px;
}

/* LBS信息 */
.lbs-info {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  border: 1px solid #bee3f8;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.lbs-info p {
  margin: 0;
  color: #2b6cb0;
  font-size: 14px;
  font-weight: 500;
}

.lbs-info i {
  color: #3182ce;
  margin-right: 8px;
}

.status-indicators {
  font-weight: 600;
}

.status {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status.green {
  background: #c6f6d5;
  color: #22543d;
}

.status.yellow {
  background: #fef5e7;
  color: #c05621;
}

.status.red {
  background: #fed7d7;
  color: #c53030;
}

/* 获取门店按钮区域 */
.fetch-stores-section {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

/* 位置状态提示 */
.location-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e9ecef;
}

.location-status.ready {
  color: #22543d;
  background: #c6f6d5;
  border-color: #68d391;
}

.location-status i {
  color: #3182ce;
}

.location-status.ready i {
  color: #22543d;
}

.fetch-stores-btn {
  background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  box-shadow: 0 4px 16px rgba(49, 130, 206, 0.3);
}

.fetch-stores-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(49, 130, 206, 0.4);
}

.fetch-stores-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.add-store-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
}

.add-store-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.fetch-stores-btn .fa-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #718096;
}

.empty-state i {
  font-size: 48px;
  color: #cbd5e0;
  margin-bottom: 16px;
  display: block;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* 添加门店表单 */
.add-store-form {
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-header h3 i {
  color: #10b981;
}

.cancel-form-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #718096;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.cancel-form-btn:hover {
  background: #e2e8f0;
  color: #2d3748;
}

.store-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.form-group input::placeholder {
  color: #a0aec0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 门店列表 */
.stores-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 门店卡片 */
.store-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
}

.store-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.store-card.green {
  border-color: #68d391;
  background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
}

.store-card.yellow {
  border-color: #f6e05e;
  background: linear-gradient(135deg, #fffbf0 0%, #ffffff 100%);
}

.store-card.red {
  border-color: #fc8181;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
}

/* 门店信息 */
.store-info {
  flex: 1;
}

.store-name {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.store-name i {
  color: #3182ce;
}

.store-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4a5568;
}

.detail-item i {
  width: 14px;
  color: #718096;
}

.busy-status {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.busy-status.green {
  background: #c6f6d5;
  color: #22543d;
}

.busy-status.yellow {
  background: #fef5e7;
  color: #c05621;
}

.busy-status.red {
  background: #fed7d7;
  color: #c53030;
}

.store-address {
  font-size: 13px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.store-address i {
  color: #a0aec0;
}

.store-phone {
  font-size: 13px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 6px;
}

.store-phone i {
  color: #a0aec0;
}

/* 门店操作 */
.store-actions {
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-button {
  background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(49, 130, 206, 0.4);
}

.nav-button.green:hover {
  box-shadow: 0 6px 20px rgba(104, 211, 145, 0.4);
}

.nav-button.yellow {
  background: linear-gradient(135deg, #d69e2e 0%, #b7791f 100%);
}

.nav-button.yellow:hover {
  box-shadow: 0 6px 20px rgba(214, 158, 46, 0.4);
}

.nav-button.red {
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
}

.nav-button.red:hover {
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
}

/* 删除按钮样式 */
.delete-button {
  padding: 8px 16px;
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  min-width: 70px;
  justify-content: center;
}

.delete-button:hover {
  background: linear-gradient(135deg, #c53030 0%, #9c2626 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
}

.delete-button:active {
  transform: translateY(0);
}

.delete-button i {
  font-size: 12px;
}

/* 导航提示 */
.navigation-tip {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-top: 20px;
  text-align: center;
}

.navigation-tip p {
  margin: 0;
  color: #4a5568;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.navigation-tip i {
  color: #3182ce;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stores-modal-content {
    max-width: 95%;
    margin: 20px;
  }
  
  .fetch-stores-section {
    flex-direction: column;
    align-items: center;
  }
  
  .location-status {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .fetch-stores-btn,
  .add-store-btn {
    width: 100%;
    max-width: 280px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
  
  .store-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .store-actions {
    margin-left: 0;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .store-details {
    grid-template-columns: 1fr;
    text-align: left;
  }
}

/* 表单验证样式 */
.error-text {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.form-group input.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 1px #e53e3e;
}

.form-group input:focus.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.2);
}

.field-hint {
  color: #718096;
  font-size: 12px;
  font-weight: normal;
}

/* 时间选择器样式 */
.time-picker-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.time-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-input label {
  font-size: 12px;
  color: #4a5568;
  margin: 0;
}

.time-input input[type="time"] {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
}

.time-input input[type="time"]:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}

.time-separator {
  color: #4a5568;
  font-weight: 500;
  margin-top: 20px;
}

.business-hours-display {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #2d3748;
}

@media (max-width: 768px) {
  .time-picker-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .time-separator {
    margin: 0;
    text-align: center;
  }
  
  .time-input {
    width: 100%;
  }
  
  .time-input input[type="time"] {
    width: 100%;
    min-width: auto;
  }
}
</style>
