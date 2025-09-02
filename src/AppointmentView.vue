<template>
  <div class="app-container">
    <div class="header">
      <button @click="goBack" class="header-back-button">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1><i class="fas fa-hospital-alt"></i> 医院科室导航系统</h1>
    </div>
    
    <!-- 新增排班管理按钮 -->
    <button @click="goToScheduleManagement" class="floating-schedule-button">
      <i class="fas fa-calendar-plus"></i>
    </button>
    
    <button @click="goBack" class="floating-back-button">
      <i class="fas fa-arrow-left"></i>
    </button>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>
    
    <div v-else class="pet-appointment">
      <!-- 左侧日期列 -->
      <div class="date-column">
        <div class="calendar-icon" @click="showCalendar = true">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="#42b983" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z"/>
          </svg>
        </div>
        <div 
          v-for="(date, index) in dateList" 
          :key="index" 
          class="date-item"
          :class="{ 
            'selected-date': isDateSelected(date),
            'today': isToday(date.date)
          }"
          @click="selectDate(date)"
        >
          <span class="date-day">{{ date.day }}</span>
          <span class="date-week">{{ date.week }}</span>
          <span v-if="isToday(date.date)" class="today-badge">今天</span>
        </div>
      </div>

      <!-- 悬浮日历 -->
      <div v-if="showCalendar" class="calendar-overlay" @click.self="closeCalendar">
        <div class="calendar-popup">
          <div class="calendar-header">
            <h2>选择预约日期</h2>
            <button class="close-button" @click="closeCalendar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <v-calendar
            v-model="selectedDate"
            :attributes="attributes"
            :min-date="minDate"
            :max-date="maxDate"
            @dayclick="handleDayClick"
            is-expanded
          />
        </div>
      </div>

      <!-- 右侧医生预约表格 -->
      <div class="doctor-table-container">
        <div class="filter-container">
          <!-- 调换位置：职称在左，搜索框在右 -->
          <div class="filter-options">
            <span class="filter-label">职称：</span>
            <div 
              v-for="(title, index) in titleFilters" 
              :key="index"
              class="filter-tag"
              :class="{ 'active': activeTitle === title.value }"
              @click="activeTitle = activeTitle === title.value ? '' : title.value"
            >
              {{ title.label }}
            </div>
          </div>
          <div class="search-container">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="搜索医生姓名、科室或专长..."
                class="search-input"
              >
            </div>
          </div>
        </div>
        
        <div class="doctor-table">
          <div v-if="filteredDoctors.length === 0" class="no-data">
            <i class="fas fa-calendar-times"></i>
            <p>当前日期暂无医生排班</p>
          </div>
          <div v-for="doctor in filteredDoctors" :key="doctor.id" class="doctor-row">
            <div class="doctor-basic">
              <img :src="getFullImageUrl(doctor.avatar)" alt="医生头像" class="doctor-avatar" @error="handleImageError">
              <div class="doctor-info">
                <div class="name-title-container">
                  <p class="doctor-name">{{ doctor.fullName }}</p>
                  <span class="doctor-title">{{ doctor.title }}</span>
                </div>
                <p class="doctor-expertise">擅长：{{ doctor.expertise.join('、') }}</p>
                <p class="doctor-brief">{{ doctor.brief }}</p>
              </div>
            </div>
            
            <div class="doctor-schedule-details">
              <div class="schedule-header">
                <span class="schedule-title">排班详情</span>
                <span class="schedule-date">{{ selectedDateStr }}</span>
              </div>
              <div class="time-slots-container">
                <div 
                  v-for="(slot, index) in doctor.scheduleSlots" 
                  :key="index"
                  class="time-slot"
                  :class="{
                    'available': slot.available > 0,
                    'limited': slot.available <= 2 && slot.available > 0,
                    'unavailable': slot.available === 0,
                    'selected': selectedSlot && selectedSlot.id === slot.id
                  }"
                  @click="selectTimeSlot(doctor, slot)"
                >
                  <span class="slot-time">{{ slot.time }}</span>
                  <span class="slot-available" v-if="slot.available > 0">
                    {{ slot.available }}个号源
                  </span>
                  <span class="slot-available unavailable" v-else>
                    已约满
                  </span>
                </div>
              </div>
            </div>
            
            <div class="appointment-actions">
              <div class="appointment-header">
                <div class="available-count">
                  <span :class="{
                    'available-normal': doctor.totalAvailable > 2,
                    'available-low': doctor.totalAvailable <= 2 && doctor.totalAvailable > 0, 
                    'available-none': doctor.totalAvailable === 0
                  }">
                    今日号源：{{ doctor.totalAvailable }}
                  </span>
                </div>
              </div>
              <button 
                @click="openAppointmentDialog(doctor)" 
                :disabled="doctor.totalAvailable <= 0"
                class="appointment-btn"
              >
                {{ doctor.totalAvailable <= 0 ? '已约满' : '预约' }}
              </button>
              <div class="doctor-fee">
                  <span class="fee-label">挂号费：</span>
                  <i class="fas fa-yen-sign"></i> {{ doctor.fee }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 预约时间选择对话框 -->
    <div v-if="showAppointmentDialog" class="appointment-dialog-overlay" @click.self="closeAppointmentDialog">
      <div class="appointment-dialog">
        <div class="dialog-header">
          <h2>确认预约信息</h2>
          <button class="close-button" @click="closeAppointmentDialog">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="doctor-info-summary">
          <img :src="getFullImageUrl(selectedDoctor.avatar)" alt="医生头像" class="dialog-avatar" @error="handleImageError">
          <div class="dialog-doctor-info">
            <p class="doctor-name">{{ selectedDoctor.fullName }} <span class="doctor-title">{{ selectedDoctor.title }}</span></p>
            <p class="expertise">擅长：{{ selectedDoctor.expertise.join('、') }}</p>
            <p class="appointment-date"><i class="far fa-calendar-alt"></i> {{ selectedDateStr }}</p>
          </div>
        </div>
        
        <div class="time-selection">
          <h3>选择具体时间段</h3>
          <div class="time-options">
            <div 
              v-for="(slot, index) in selectedDoctor.scheduleSlots" 
                  :key="index"
                  class="time-option"
                  :class="{
                    'available': slot.available > 0,
                    'selected': selectedSlot && selectedSlot.id === slot.id
                  }"
                  @click="selectTimeSlot(selectedDoctor, slot)"
                >
                  <span class="option-time">{{ slot.time }}</span>
                  <span class="option-available">{{ slot.available }}个号源</span>
                </div>
          </div>
        </div>
        
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeAppointmentDialog">取消</button>
          <button 
            class="confirm-btn" 
            :disabled="!selectedSlot || selectedSlot.available <= 0"
            @click="confirmAppointment"
          >
            确认预约
          </button>
        </div>
      </div>
    </div>
    
    <!-- 预约成功提示 -->
    <div v-if="showSuccessDialog" class="success-dialog-overlay">
      <div class="success-dialog">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>预约成功</h2>
        <div class="appointment-details">
          <p><strong>医生：</strong>{{ selectedDoctor.fullName }} {{ selectedDoctor.title }}</p>
          <p><strong>日期：</strong>{{ selectedDateStr }}</p>
          <p><strong>时间：</strong>{{ selectedSlot.time }}</p>
          <p><strong>就诊地点：</strong>{{ selectedDoctor.location }}</p>
          <p><strong>预约号：</strong>{{ appointmentNumber }}</p>
        </div>
        <button class="confirm-btn" @click="closeSuccessDialog">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Calendar } from 'v-calendar';
import axios from 'axios';
import { API_BASE_URL } from '@/config/index';
import { ref, onMounted, nextTick } from 'vue';
export default {
  name: 'PetAppointment',
  components: {
    VCalendar: Calendar
  },
  setup() {
    const currentUserId = ref(null);
    const currentUsername = ref('');

     onMounted(() => { 
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUserId.value = user.userId || 1;
      currentUsername.value = user.username || '游客';
      
    });

    return {
      currentUserId,
      currentUsername
    };

  },
  mounted() {
    const deptId = Number(this.$route.query.departmentId || this.$route.params.departmentId);
    this.departmentId = deptId;
    this.fetchDoctors();
  },
  data() {
    // 生成未来7天的日期数据
    const dateList = [];
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const now = new Date();
    
    // 设置minDate为今天，maxDate为6天后
    const minDate = new Date(now);
    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + 6);

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      dateList.push({
        date: date,
        day: date.getDate(),
        week: `周${weekDays[date.getDay()]}`
      });
    }

    return {
      API_BASE_URL,
      loading: false,
      dateList,
      selectedDate: new Date(),
      minDate,
      maxDate,
      showCalendar: false,
      selectedDateItem: dateList[0],
      searchQuery: '',
      activeTitle: '',
      showAppointmentDialog: false,
      showSuccessDialog: false,
      selectedDoctor: null,
      selectedSlot: null,
      appointmentNumber: '',
      titleFilters: [
        { label: '全部', value: '' },
        { label: '主任医师', value: '主任医师' },
        { label: '副主任医师', value: '副主任医师' },
        { label: '主治医师', value: '主治医师' }
      ],
      doctors: [],
      allDoctors: [], // 存储所有医生数据
      displayDoctors: [], // 新增：专门用于显示的医生列表
      departmentId: null,
      attributes: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#ff9800',
            color: 'white',
            borderRadius: '50%'
          },
          dates: new Date()
        }
      ]
    };
  },
  computed: {
    selectedDateStr() {
      const date = this.selectedDateItem.date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    
    filteredDoctors() {
      // 直接使用displayDoctors而不是doctors
      const query = this.searchQuery.toLowerCase();
      return this.displayDoctors.filter(doctor => {
        // 职称过滤
        const titleMatch = this.activeTitle ? doctor.title === this.activeTitle : true;
        
        // 搜索过滤
        const nameMatch = doctor.fullName.toLowerCase().includes(query);
        const expertiseMatch = doctor.expertise.some(e => e.toLowerCase().includes(query));
        
        return titleMatch && (nameMatch || expertiseMatch);
      });
    }
  },
  methods: {
    // 获取完整的图片URL
    getFullImageUrl(path) {
      if (!path) return this.getAvatarPlaceholder();
      if (path.startsWith('http')) return path;
      return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    },
    
    // 处理图片加载错误
    handleImageError(event) {
      event.target.src = this.getAvatarPlaceholder();
    },
    
    getAvatarPlaceholder() {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M30,85 Q50,65 70,85' stroke='%23ccc' stroke-width='5' fill='none'/%3E%3C/svg%3E";
    },
    
    async fetchDoctors() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllDoctors`);
        if (response.data.code === 200) {
          const targetDepartmentId = Number(this.departmentId);
          
          // 过滤医生
          const filteredDoctors = response.data.data.filter(d => {
            const doctorDeptId = Number(d.departmentId);
            return doctorDeptId === targetDepartmentId;
          });
          
          // 保存所有医生数据
          this.allDoctors = filteredDoctors.map(doctor => ({
            id: doctor.doctorId,
            fullName: doctor.name,
            title: doctor.title,
            fee: doctor.fee,
            expertise: doctor.expertise ? doctor.expertise.split('、') : [],
            brief: doctor.brief,
            avatar: doctor.avatar,
            location: doctor.location,
            departmentId: doctor.departmentId,
            scheduleSlots: [],
            totalAvailable: 0
          }));
          
          // 初始时，doctors为空数组，避免闪烁
          this.doctors = [];
          
          // 为每个医生获取排班信息
          await this.fetchSchedulesForDoctors();
        }
      } catch (error) {
        console.error('获取医生数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchSchedulesForDoctors() {
      const dateStr = this.formatDate(this.selectedDateItem.date);
      
      // 直接使用allDoctors来获取排班，避免闪烁
      const doctorsWithSchedules = [];
      
      for (let doctor of this.allDoctors) {
        try {
          const response = await axios.get(`${API_BASE_URL}/getSchedule?doctorId=${doctor.id}&date=${dateStr}`);
          
          if (response.data.code === 200 && response.data.data && response.data.data.length > 0) {
            // 创建医生对象的副本，避免修改原始数据
            const doctorCopy = JSON.parse(JSON.stringify(doctor));
            
            // 转换排班数据格式
            doctorCopy.scheduleSlots = response.data.data.map(schedule => ({
              id: schedule.scheduleId,
              time: schedule.timeSlot,
              available: schedule.maxCapacity - schedule.booked,
              booked: schedule.booked,
              maxCapacity: schedule.maxCapacity
            }));
            
            // 计算总可用号源
            doctorCopy.totalAvailable = doctorCopy.scheduleSlots.reduce((sum, slot) => sum + slot.available, 0);
            
            // 只有有排班的医生才添加到新数组中
            doctorsWithSchedules.push(doctorCopy);
          }
        } catch (error) {
          console.error(`获取医生 ${doctor.fullName} 的排班失败:`, error);
        }
      }
      
      // 直接更新显示列表，避免中间状态
      this.displayDoctors = doctorsWithSchedules;
    },
    
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    isDateSelected(date) {
      return this.selectedDateItem.date.getTime() === date.date.getTime();
    },
    
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() && 
             date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear();
    },
    
    async selectDate(date) {
      this.selectedDateItem = date;
      await this.fetchSchedulesForDoctors();
    },
    
    handleDayClick(day) {
      if (day.date >= this.minDate && day.date <= this.maxDate) {
        this.selectedDate = day.date;
        
        // 查找匹配的日期项
        const selected = this.dateList.find(d => {
          const dDate = d.date;
          return dDate.getDate() === day.date.getDate() &&
                 dDate.getMonth() === day.date.getMonth() &&
                 dDate.getFullYear() === day.date.getFullYear();
        });
        
        if (selected) {
          this.selectedDateItem = selected;
          this.fetchSchedulesForDoctors();
        }
      }
      this.closeCalendar();
    },
    
    closeCalendar() {
      this.showCalendar = false;
    },
    
    openAppointmentDialog(doctor) {
      this.selectedDoctor = doctor;
      this.selectedSlot = null;
      this.showAppointmentDialog = true;
    },
    
    closeAppointmentDialog() {
      this.showAppointmentDialog = false;
      this.selectedDoctor = null;
      this.selectedSlot = null;
    },
    
    selectTimeSlot(doctor, slot) {
      if (slot.available > 0) {
        this.selectedSlot = slot;
      }
    },
    
    async confirmAppointment() {
      if (!this.selectedSlot || this.selectedSlot.available <= 0) {
        console.warn("无效的时间段选择");
        return;
      }
      
      try {
        // 获取当前登录用户信息
        const currentUserStr = localStorage.getItem('currentUser');
        if (!currentUserStr) {
          console.error('未找到登录用户信息');
          alert('请先登录再进行预约');
          return;
        }
        
        const currentUser = JSON.parse(currentUserStr);
        const userId = currentUser.userId;
        
        if (!userId) {
          console.error('用户ID不存在');
          alert('用户信息异常，请重新登录');
          return;
        }
        
        console.log('当前登录用户ID:', userId);
        
        const appointmentData = {
          userId: this.currentUserId,
          doctorId: this.selectedDoctor.id,
          scheduleId: this.selectedSlot.id,
          date: this.formatDate(this.selectedDateItem.date),
          time: this.selectedSlot.time
        };
        
        console.log('发送预约数据:', appointmentData);
        
        const response = await axios.post(`${API_BASE_URL}/addAppointment`, appointmentData);
        
        if (response.data.code === 200) {
          await axios.post(`${API_BASE_URL}/updateBook?scheduleId=${this.selectedSlot.id}&&newBook=${this.selectedSlot.booked + 1}`);
          
          // 更新本地数据
          const doctorIndex = this.displayDoctors.findIndex(d => d.id === this.selectedDoctor.id);
          if (doctorIndex !== -1) {
            const slotIndex = this.displayDoctors[doctorIndex].scheduleSlots.findIndex(s => s.id === this.selectedSlot.id);
            if (slotIndex !== -1) {
              this.displayDoctors[doctorIndex].scheduleSlots[slotIndex].available -= 1;
              this.displayDoctors[doctorIndex].totalAvailable -= 1;
            }
          }
          
          this.appointmentNumber = response.data.data.appointmentNum;
          
          this.showAppointmentDialog = false;
          this.showSuccessDialog = true;
        }
      } catch (error) {
        console.error('预约失败:', error);
      }
    },
    
    closeSuccessDialog() {
      this.showSuccessDialog = false;
      this.selectedDoctor = null;
      this.selectedSlot = null;
    },
    
    goBack() {
      if (this.$router) {
        this.$router.go(-1);
      } else {
        console.warn('Router 实例不可用，无法执行返回操作');
      }
    },
    
    goToScheduleManagement() {
      if (this.$router) {
        this.$router.push('/schedule-management');
      } else {
        console.warn('Router 实例不可用，无法跳转到排班管理页面');
      }
    }
  }
};
</script>

<style scoped>
/* 样式保持不变，只添加无数据提示样式 */
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.no-data p {
  font-size: 16px;
}

/* 添加过渡效果，减少视觉闪烁 */
.doctor-table {
  transition: opacity 0.3s ease;
}

.loading-container {
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<style scoped>
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-data i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.no-data p {
  font-size: 16px;
}
.doctor-table {
  transition: opacity 0.3s ease;
}

.loading-container {
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

html, body, .app-container {
  height: 100%;
  overflow: hidden;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8f9fa;
  position: relative;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 头部样式 */
.header {
  text-align: center;
  padding: 15px;
  background: linear-gradient(90deg, #0072bc, #42b983);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  position: relative;
  padding: 15px 50px; /* 增加左右内边距给按钮留空间 */
}

/* 头部返回按钮 */
.header-back-button {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

/* 新增排班管理按钮 */
.floating-schedule-button {
  position: fixed;
  bottom: 110px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7043, #ff5252);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(255, 112, 67, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.8) inset;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  outline: none;
}

.floating-schedule-button:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 8px 20px rgba(255, 112, 67, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.9) inset;
  background: linear-gradient(135deg, #f4511e, #e53935);
}

.floating-back-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b983, #0072bc);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(66, 185, 131, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.8) inset;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: none;
  outline: none;
}
.floating-back-button:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 8px 20px rgba(66, 185, 131, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.9) inset;
  background: linear-gradient(135deg, #3aac78, #0062a3);
}
.header h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
}

/* 主要内容区域 */
.pet-appointment {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 10px;
  position: relative;
}

/* 左侧日期栏 */
.date-column {
  width: 120px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-radius: 8px 0 0 8px;
  margin-right: 10px;
  overflow-y: auto;
}

.calendar-icon {
  cursor: pointer;
  align-self: center;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.3s;
  background: #f0f8ff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.calendar-icon:hover {
  background: #e0f0ff;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #f9f9f9;
  position: relative;
}

.date-item:hover {
  background: #e8f5e9;
  transform: translateY(-3px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.date-item.selected-date {
  background: #42b983;
  color: white;
}

.date-item.today {
  border: 2px solid #42b983;
}

.today-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff9800;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.date-day {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.date-week {
  font-size: 0.9rem;
  color: #666;
}

.date-item.selected-date .date-week {
  color: rgba(255, 255, 255, 0.9);
}

/* 右侧医生列表 */
.doctor-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}
.search-container{
  display: flex;
  justify-content: flex-end;
  flex: 0 0 auto; /* 不增长，不收缩，自动宽度 */
  margin-left: 20px; /* 添加间距 */
}
/* 搜索框样式 */
.search-box {
  width: 350px;
  position: relative;
  
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd; /* 添加基础边框 */
  border-radius: 10px; /* 圆角边框 */
  background: #f0f4f8;
  font-size: 0.95rem;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  outline: none;
}

.search-input:focus {
  border: 1px solid #42b983;
  background: white;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.3)
  
}

/* 职称筛选样式 */
.filter-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.filter-label {
  font-size: 0.95rem;
  color: #555;
  font-weight: 500;
}

.filter-tag {
  padding: 5px 12px;
  background: #e9ecef;
  border-radius: 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
}

.filter-tag:hover {
  background: #dee2e6;
}

.filter-tag.active {
  background: #42b983;
  color: white;
  font-weight: 500;
  border-color: #42b983;
}

.doctor-table {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.doctor-row {
  display: flex;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.doctor-row:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.doctor-basic {
  display: flex;
  flex: 1;
}

.doctor-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0f7fa;
  margin-right: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.doctor-info {
  flex: 1;
  min-width: 0;
}

.name-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.doctor-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: 2c3e50;
  margin-right: 12px;
}

.doctor-title {
  background: #e8f5e9;
  color: #42b983;
  font-size: 0.85rem;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.doctor-expertise {
  font-size: 0.95rem;
  color: #0072bc;
  margin-bottom: 8px;
  font-weight: 500;
}

.doctor-brief {
  font-size: 0.92rem;
  color: #555;
  line-height: 1.6;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e0e0e0;
}

.doctor-schedule-details {
  width: 300px;
  margin: 0 20px;
  border-left: 1px solid #eee;
  padding-left: 20px;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.schedule-title {
  font-weight: 600;
  color: #0072bc;
}

.schedule-date {
  font-size: 0.9rem;
  color: #42b983;
  font-weight: 500;
}

.time-slots-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.time-slot {
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.time-slot.available {
  background: #e8f5e9;
  border-color: #c8e6c9;
}

.time-slot.available:hover {
  background: #d4edda;
  transform: translateY(-2px);
}

.time-slot.limited {
  background: #fff3cd;
  border-color: #ffeeba;
}

.time-slot.limited:hover {
  background: #ffeeba;
  transform: translateY(-2px);
}

.time-slot.unavailable {
  background: #f8f9fa;
  color: #adb5bd;
  cursor: not-allowed;
}

.time-slot.selected {
  background: #42b983;
  color: white;
  border-color: #2e8b57;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.slot-time {
  font-weight: 500;
  margin-bottom: 3px;
}

.slot-available {
  font-size: 0.8rem;
}

/* 预约操作区域 - 重新设计布局 */
.appointment-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  margin-left: 10px;
  padding: 15px 10px;
  border-radius: 8px;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.appointment-header {
  width: 100%;
  margin-bottom: 15px;
}

/* 挂号费样式 - 移动到预约按钮附近 */
.doctor-fee {
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
  color: #040404;
  margin-bottom: 5px;
  margin-top: 15px;
  display: flex;
  align-items: center;
}

.doctor-fee i {
  font-size: 0.9rem;
  margin-right: 4px;
}

.fee-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: normal;
  margin-top: 4px;
}

.available-count {
 
  text-align: center;
  font-size: 0.95rem;
  padding: 8px 0;
  border-radius: 6px;

 
}

.available-normal {
  color: #42b983;
  font-weight: bold;
}

.available-low {
  color: #ff9800;
  font-weight: bold;
}

.available-none {
  color: #f44336;
  font-weight: bold;
}

.appointment-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #42b983, #0072bc);
  color: white;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 100px;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
  width: 100%;
}

.appointment-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 12p rgba(66, 185, 131, 0.4);
}

.appointment-btn:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  color: #9e9e9e;
  box-shadow: none;
}

/* 悬浮日历样式 */
.calendar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.calendar-popup {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 500px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #777;
  transition: color 0.2s;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #f5f5f5;
  color: #f44336;
}

/* 预约对话框样式 */
.appointment-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.appointment-dialog {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.dialog-header {
  padding: 20px 25px;
  background: linear-gradient(90deg, #0072bc, #42b983);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h2 {
  font-size: 1.5rem;
  font-weight: 500;
}

.doctor-info-summary {
  display: flex;
  padding: 25px;
  border-bottom: 1px solid #eee;
}

.dialog-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0f7fa;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dialog-doctor-info {
  flex: 1;
}

.dialog-doctor-info .doctor-name {
  font-size: 1.4rem;
  font-weight: 600;
  color: 2c3e50;
  margin-bottom: 8px;
}

.dialog-doctor-info .doctor-title {
  background: #e8f5e9;
  color: #42b983;
  font-size: 0.9rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.dialog-doctor-info .expertise {
  font-size: 0.95rem;
  color: #0072bc;
  margin-bottom: 12px;
}

.dialog-doctor-info .appointment-date {
  font-size: 1rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-selection {
  padding: 20px 25px;
}

.time-selection h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: 2c3e50;
}

.time-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.time-option {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.time-option.available {
  background: #e8f5e9;
  border-color: #c8e6c9;
}

.time-option.available:hover {
  background: #d4edda;
  transform: translateY(-2px);
}

.time-option.selected {
  background: #42b983;
  color: white;
  border-color: #2e8b57;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.option-time {
  font-weight: 500;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 5px;
}

.option-available {
  font-size: 0.85rem;
}

.dialog-actions {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn {
  padding: 10px 25px;
  border: 1px solid #ddd;
  border-radius: 25px;
  background: white;
  color: #555;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.confirm-btn {
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #42b983, #0072bc);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(66, 185, 131, 0.4);
}

.confirm-btn:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  color: #9e9e9e;
  box-shadow: none;
}

/* 预约成功对话框 */
.success-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.success-dialog {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  text-align: center;
  padding: 30px;
}

.success-icon {
  font-size: 4rem;
  color: #42b983;
  margin-bottom: 20px;
}

.success-dialog h2 {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: 2c3e50;
}

.appointment-details {
  text-align: left;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.appointment-details p {
  margin-bottom: 10px;
  font-size: 1.05rem;
}

.appointment-details strong {
  color: #0072bc;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .doctor-schedule-details {
    width: 250px;
  }
  
  .time-slots-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .doctor-row {
    flex-direction: column;
  }
  
  .doctor-basic {
    margin-bottom: 20px;
  }
  
  .doctor-schedule-details {
    width: 100%;
    margin: 0 0 20px 0;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid #eee;
    padding-top: 20px;
  }
  
  .appointment-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .time-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .pet-appointment {
    flex-direction: column;
  }
  
  .date-column {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 10px;
    margin-bottom: 15px;
    border-right: none;
    border-radius: 8px;
  }
  
  .calendar-icon {
  margin-right: 15px;
  margin-bottom: 0;
  }
  
  .date-item {
  margin-right: 10px;
  margin-bottom: 0;
  min-width: 70px;
  }
  
  .doctor-table-container {
  width: 100%;
  }
  
  .filter-container {
  flex-direction: column;
  gap: 15px;
  }
  
  .search-box {
  max-width: 100%;
  width: 100%;
  }
  
  .time-options {
  grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .header h1 {
  font-size: 1.4rem;
  }
  
  .doctor-name {
  font-size: 1.15rem;
  }
  
  .doctor-title {
  font-size: 0.8rem;
  }
  
  .doctor-expertise, .doctor-brief {
  font-size: 0.85rem;
  }
  
  .appointment-actions {
  flex-direction: column;
  align-items: stretch;
  }
  
  .appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  }
  
  .doctor-fee {
  margin-bottom: 0;
  font-size: 1rem;
  }
  
  .available-count {
  margin-bottom: 0;
  }
  
  /* 调整浮动按钮位置 */
  .floating-schedule-button {
  bottom: 100px;
  right: 20px;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  }
  
  .floating-back-button {
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  }
}

/* 浮动按钮动画 */
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}

.floating-schedule-button:hover {
  animation: float 2s ease-in-out infinite;
}

.floating-back-button:hover {
  animation: float 2s ease-in-out infinite;
}
</style>