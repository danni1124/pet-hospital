<template>
  <div class="app-container">
    <div class="header">
      <h1><i class="fas fa-hospital-alt"></i> 医院科室导航系统</h1>
    </div>
    
    <div class="pet-appointment">
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
          :class="{ 'selected-date': isDateSelected(date) }"
          @click="selectDate(date)"
        >
          <span class="date-day">{{ date.day }}</span>
          <span class="date-week">{{ date.week }}</span>
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
            @dayclick="handleDayClick"
            is-expanded
          />
        </div>
      </div>

      <!-- 右侧医生预约表格 -->
      <div class="doctor-table-container">
        <div class="doctor-table">
          <div v-for="doctor in doctors" :key="doctor.id" class="doctor-row">
            <img :src="doctor.avatar" alt="医生头像" class="doctor-avatar">
            <div class="doctor-info">
              <p class="doctor-name">{{ doctor.name }}</p>
              <p class="doctor-brief">{{ doctor.brief }}</p>
            </div>
            <div class="available-count">
              <span :class="{'available-low': doctor.available <= 2 && doctor.available > 0, 'available-none': doctor.available === 0}">
                剩余号源：{{ doctor.available }}
              </span>
            </div>
            <button 
              @click="makeAppointment(doctor)" 
              :disabled="doctor.available <= 0"
              class="appointment-btn"
            >
              {{ doctor.available <= 0 ? '已约满' : '预约' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 固定在底部的返回按钮 -->
    <div class="fixed-bottom-container">
      <button 
        @click="goBack" 
        class="fixed-back-button"
      >
        <i class="fas fa-arrow-left"></i>
 返回科室选择
      </button>
    </div>
  </div>
</template>

<script>
import { Calendar } from 'v-calendar';

export default {
  name: 'PetAppointment',
  components: {
    VCalendar: Calendar
  },
  data() {
    // 生成未来 7 天的日期数据
    const dateList = [];
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const now = new Date();
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
      dateList,
      selectedDate: new Date(),
      showCalendar: false,
      selectedDateItem: null,
      doctors: [
        { id: 1, name: '张医生', brief: '擅长宠物内科疾病', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', available: 5 },
        { id: 2, name: '李医生', brief: '擅长宠物外科手术', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', available: 3 },
        { id: 3, name: '王医生', brief: '擅长宠物皮肤病治疗', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', available: 0 },
        { id: 4, name: '赵医生', brief: '眼科专家', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', available: 2 },
        { id: 5, name: '孙医生', brief: '心肺科主任医师', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', available: 7 },
        { id: 6, name: '周医生', brief: '骨科专家', avatar: 'https://randomuser.me/api/portraits/women/23.jpg', available: 1 },
        { id: 7, name: '吴医生', brief: '神经外科主任', avatar: 'https://randomuser.me/api/portraits/men/19.jpg', available: 4 },
        { id: 8, name: '郑医生', brief: '口腔科专家', avatar: 'https://randomuser.me/api/portraits/women/56.jpg', available: 6 }
      ],
      attributes: [
      {
          key: 'today',
          highlight: {
            backgroundColor: '#ff9800', // 修改今天日期的背景色为橙色
            color: 'white',
            borderRadius: '50%' // 设置为圆形
          },
          dates: new Date()
        }
        
      ]
    };
  },
  methods: {
    isDateSelected(date) {
      return this.selectedDateItem === date;
    },
    selectDate(date) {
      this.selectedDateItem = date;
      console.log('选择的日期:', date);
    },
    handleDayClick(day) {
      this.selectedDate = day.date;
      this.selectedDateItem = this.dateList.find(d => 
        d.date.getDate() === day.date.getDate() && 
        d.date.getMonth() === day.date.getMonth() &&
        d.date.getFullYear() === day.date.getFullYear()
      );
      this.closeCalendar();
      console.log('从日历选择的日期:', day.date);
    },
    makeAppointment(doctor) {
      if (doctor.available > 0) {
        doctor.available -= 1;
        this.$notify({
          title: '预约成功',
          message: `已成功预约${doctor.name}医生`,
          type: 'success',
          duration: 3000
        });
      }
    },
    goBack() {
      if (this.$router) {
        this.$router.go(-1);
      } else {
        console.warn('Router 实例不可用，无法执行返回操作');
      }
    },
    closeCalendar() {
      this.showCalendar = false;
    }
  }
};
</script>

<style scoped>
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
  height: 90vh;
  background: #f8f9fa;
}

/* 头部样式 */
.header {
  text-align: center;
  padding: 15px;
  background: linear-gradient(90deg, #0072bc, #42b983);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
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
  position: relative; /* 为悬浮日历提供定位参考 */
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
}

.calendar-icon:hover {
  background: #f0f8ff;
}

.calendar-picker {
  border: 1px solid #42b983;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.doctor-table {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.doctor-row {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.doctor-row:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0f7fa;
  margin-right: 15px;
}

.doctor-info {
  flex: 1;
  min-width: 0;
}

.doctor-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.doctor-brief {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.available-count {
  width: 100px;
  text-align: center;
  font-size: 0.9rem;
  margin: 0 15px;
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
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #42b983, #0072bc);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
}

.appointment-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.appointment-btn:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
  color: #9e9e9e;
}

/* 固定在底部的返回按钮 */
.fixed-bottom-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  z-index: 100;
}

.fixed-back-button {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #42b983, #0072bc);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(191, 236, 108, 0.3);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fixed-back-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(170, 231, 184, 0.4);
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
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}


.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pet-appointment {
    flex-direction: column;
  }
  
  .date-column {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 10px;
    margin-bottom: 10px;
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
    min-width: 60px;
  }
  
  .doctor-table-container {
    width: 100%;
  }
  
  .doctor-row {
    flex-wrap: wrap;
  }
  
  .doctor-info {
    flex-basis: 100%;
    margin-bottom: 10px;
  }
  
  .available-count {
    text-align: left;
    margin-left: 75px; /* 与头像对齐 */
  }
  
  .appointment-btn {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.4rem;
  }
  
  .doctor-name {
    font-size: 1.1rem;
  }
  
  .doctor-brief {
    font-size: 0.85rem;
  }
  
  .fixed-back-button {
    width: 100%;
    justify-content: center;
  }
}
</style>