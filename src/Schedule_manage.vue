<template>
  <div class="doctor-schedule-panel">
    <!-- 头部 -->
    <div class="header">
      <div class="header-content">
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1>医生与排班管理</h1>

        <!-- 功能切换 -->
        <div class="mode-switch">
          <button 
            @click="mode = 'doctor'" 
            :class="['mode-btn', { active: mode === 'doctor' }]"
          >
            <i class="fas fa-user-md"></i> 医生管理
          </button>
          <button 
            @click="mode = 'schedule'" 
            :class="['mode-btn', { active: mode === 'schedule' }]"
          >
            <i class="fas fa-calendar-alt"></i> 排班管理
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 医生管理区域 -->
     
      <transition name="fade" mode="out-in">
        <div v-if="mode === 'doctor'" class="section doctor-section">
          <div class="section-header">
            <h2><i class="fas fa-user-md"></i> 医生信息管理</h2>
            <!-- <p>添加和管理医生基本信息</p> -->
          </div>

          <div class="form-card">
            <div class="form-grid">
              <div class="form-group_qian">
                <label>姓名</label>
                <input v-model="docForm.name" placeholder="例：张医生" class="form-input" />
              </div>

              <div class="form-group_qian">
                <label>职称</label>
                <select v-model="docForm.title" class="form-select">
                  <option disabled value="">请选择职称</option>
                  <option>主任医师</option>
                  <option>副主任医师</option>
                  <option>主治医师</option>
                  <option>住院医师</option>
                </select>
              </div>

              <div class="form-group_qian">
                <label>挂号费（元）</label>
                <input v-model.number="docForm.fee" type="number" placeholder="例：50" class="form-input" />
              </div>

              <div class="form-group_qian">
                <label>所属科室</label>
                <select v-model.number="docForm.departmentId" class="form-select">
                  <option disabled value="">请选择科室</option>
                  <option v-for="d in departments" :key="d.department_id" :value="d.department_id">
                    {{ d.department_name }}
                  </option>
                </select>
              </div>

              <div class="form-group_qian full-width">
                <label>专长（用中文逗号分隔）</label>
                <input v-model="docForm.expertise" placeholder="例：心血管疾病,老年病" class="form-input" />
              </div>

              <div class="form-group_qian full-width">
                <label>诊室位置</label>
                <input v-model="docForm.location" placeholder="例：门诊楼3楼305" class="form-input" />
              </div>

              <div class="form-group_qian full-width">
                <label>医生简介</label>
                <textarea v-model="docForm.brief" placeholder="例：拥有20年临床经验，擅长疑难病症诊治" rows="3" class="form-textarea"></textarea>
              </div>

              <div class="form-group_qian full-width">
                <label>头像上传</label>
                <div class="upload-area_qian" @click="triggerUpload" :class="{ 'has-image': docForm.avatar }">
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref="fileInput" 
                    @change="uploadAvatar"
                    class="file-input"
                  >
                  <div v-if="!docForm.avatar" class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>点击上传医生头像</p>
                  </div>
                  <div v-else class="image-preview_qian">
                    <img :src="getFullImageUrl(docForm.avatar)" alt="预览">
                    <button @click.stop="removeImage" class="remove-image-btn_qian">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions_qian">
              <button v-if="editingDoctor" @click="cancelEdit" class="cancel-btn">
                <i class="fas fa-times"></i> 取消编辑
              </button>
              <button @click="saveDoctor" class="submit-btn">
                <i class="fas" :class="editingDoctor ? 'fa-save' : 'fa-plus'"></i> 
                {{ editingDoctor ? '更新医生信息' : '添加医生' }}
              </button>
            </div>
          </div>

          <!-- 医生列表 -->
          <div class="doctor-list" v-if="doctors.length">
            <h3>现有医生</h3>
            <div class="list-container">
              <div v-for="d in doctors" :key="d.doctorId" class="doctor-item">
                <div class="doctor-info">
                  <div class="doctor-avatar">
                    <img :src="getFullImageUrl(d.avatar)" :alt="d.name">
                  </div>
                  <div class="doctor-details">
                    <div class="doctor-name">{{ d.name }}</div>
                    <div class="doctor-title">{{ d.title }}</div>
                    <div class="doctor-department">{{ getDepartmentName(d.departmentId) }}</div>
                  </div>
                </div>
                <div class="doctor-actions">
                  <button @click="editDoctor(d)" class="action-btn_qian edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteDoctor(d.doctorId)" class="action-btn_qian delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- 排班管理区域 -->
        <div v-else class="section schedule-section">
          <div class="section-header">
            <h2><i class="fas fa-calendar-alt"></i> 排班信息管理</h2>
            <!-- <p>为医生安排门诊时间</p> -->
          </div>

          <!-- 筛选表单 -->
          <div class="filter-card">
            <h3>排班筛选</h3>
            <div class="filter-form-grid">
              <div class="filter-group">
                <label>日期筛选</label>
                <input type="date" v-model="filterDate" class="form-input" />
              </div>
              
              <div class="filter-group">
                <label>科室筛选</label>
                <select v-model="filterDepartment" class="form-select">
                  <option value="">全部科室</option>
                  <option v-for="d in departments" :key="d.department_id" :value="d.department_name">
                    {{ d.department_name }}
                  </option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>医生筛选</label>
                <select v-model="filterDoctor" class="form-select">
                  <option value="">全部医生</option>
                  <option v-for="d in filteredDoctors" :key="d.doctorId" :value="d.name">
                    {{ d.name }} - {{ getDepartmentName(d.departmentId) }}
                  </option>
                </select>
              </div>
              
              <div class="filter-buttons">
                <button @click="applyFilters" class="submit-btn_qian filter-btn">
                  <i class="fas fa-filter"></i> 应用筛选
                </button>
                
                <button @click="resetFilters" class="filter-reset-btn">
                  <i class="fas fa-redo"></i> 重置筛选
                </button>
              </div>
            </div>
          </div>

         <!-- 添加/编辑排班表单 -->
        <div class="form-card">
          <h3>{{ editingSchedule ? '编辑排班' : '添加新排班' }}</h3>
          <div v-if="editingSchedule" class="edit-notice">
            <i class="fas fa-info-circle"></i>
            正在编辑排班：{{ getDoctorName(editingSchedule.doctorId) }} - {{ formatDate(editingSchedule.scheduleDate) }} - {{ editingSchedule.timeSlot }}
          </div>
          <div class="form-grid compact">
            <div class="form-group_qian">
              <label>选择医生</label>
              <select v-model.number="scheduleForm.doctorId" class="form-select" :disabled="editingSchedule">
                <option disabled value="">请选择医生</option>
                <option v-for="d in doctors" :key="d.doctorId" :value="d.doctorId">
                  {{ d.name }} - {{ getDepartmentName(d.departmentId) }}
                </option>
              </select>
            </div>

            <div class="form-group_qian">
              <label>排班日期</label>
              <input type="date" v-model="scheduleForm.scheduleDate" class="form-input" />
            </div>

            <div class="form-group_qian">
              <label>时间段</label>
              <select v-model="scheduleForm.timeSlot" class="form-select">
                <option disabled value="">请选择时间段</option>
                <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>

            <div class="form-group_qian">
              <label>号源上限（人）</label>
              <input v-model.number="scheduleForm.maxCapacity" type="number" min="1" placeholder="例：10" class="form-input" />
            </div>
          </div>

          <div class="form-actions_qian">
            <button v-if="editingSchedule" @click="cancelEditSchedule" class="cancel-btn">
              <i class="fas fa-times"></i> 取消编辑
            </button>
            <button @click="editingSchedule ? updateSchedule() : addSchedule()" class="submit-btn_qian">
              <i class="fas" :class="editingSchedule ? 'fa-save' : 'fa-plus'"></i> 
              {{ editingSchedule ? '更新排班' : '添加排班' }}
            </button>
          </div>
        </div>


          <!-- 排班列表 -->
          <div class="schedule-list" v-if="groupedSchedules.length">
            <h3>现有排班 ({{ groupedSchedules.length }}个医生排班)</h3>
            <div class="list-container">
              <div v-for="group in groupedSchedules" :key="group.key" class="schedule-group">
                <div class="group-header">
                  <div class="doctor-info">
                    <div class="doctor-avatar">
                      <img :src="getFullImageUrl(group.doctorAvatar)" :alt="group.doctorName">
                    </div>
                    <div class="doctor-details">
                      <div class="doctor-name">
                        <span class="name-label">姓名:</span>
                        {{ group.doctorName }}
                      </div>
                      <div class="doctor-title-department">
                        {{ group.departmentName }}
                      </div>
                    </div>
                  </div>
                  <div class="group-date">{{ formatDate(group.scheduleDate) }}</div>
                </div>
                
                <div class="time-slots-grid">
                  <div 
                    v-for="s in group.schedules" 
                    :key="s.scheduleId" 
                    class="time-slot-card"
                    :class="getCapacityStatusClass(s.booked, s.maxCapacity)"
                  >
                    <div class="time-range">{{ s.timeSlot }}</div>
                    <div class="slot-info">
                      <div class="slot-capacity">
                        <span class="capacity-label">号源：</span>
                        <span class="booked">{{ s.maxCapacity-s.booked }}</span> / 
                        <span class="max">{{ s.maxCapacity }}</span>
                      </div>
                      <div class="slot-actions">
                        <button @click="editSchedule(s)" class="action-btn_qian edit">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button @click="deleteSchedule(s.scheduleId)" class="action-btn_qian delete">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="group-footer">
                  <div class="schedule-location" v-if="group.doctorLocation">
                    <i class="fas fa-map-marker-alt"></i> {{ group.doctorLocation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="no-data">
            <i class="fas fa-calendar-times"></i>
            <p>暂无排班数据</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config/index';

export default {
  name: 'DoctorAndSchedule',
  data() {
    // 设置默认日期为今天
    const today = new Date();
    const todayFormatted = today.toISOString().slice(0, 10);
    
    // 生成时间段选项
    const timeSlots = [];
    for (let hour = 8; hour <= 17; hour++) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1).toString().padStart(2, '0');
      timeSlots.push(`${startHour}:00-${endHour}:00`);
    }
    
    return {
      mode: 'doctor',
      departments: [],
      doctors: [],
      docForm: {
        name: '',
        title: '',
        fee: 0,
        expertise: '',
        brief: '',
        location: '',
        departmentId: null,
        avatar: null
      },
      scheduleForm: {
        doctorId: null,
        scheduleDate: todayFormatted,
        timeSlot: '',
        maxCapacity: 10
      },
      schedules: [],
      editingDoctor: null,
      editingSchedule: null,
      // 筛选相关数据
      filterDate: todayFormatted,
      filterDepartment: '',
      filterDoctor: '',
      // 存储从API获取的原始排班数据
      rawSchedules: [],
      // 时间段选项
      timeSlots: timeSlots
    };
  },
  computed: {
    // 增强排班数据，加入医生信息
    enhancedSchedules() {
      return this.rawSchedules.map(schedule => {
        const doctor = this.doctors.find(d => d.doctorId === schedule.doctorId);
        return {
          ...schedule,
          doctorName: doctor ? doctor.name : '未知医生',
          doctorTitle: doctor ? doctor.title : '',
          doctorAvatar: doctor ? doctor.avatar : '',
          doctorLocation: doctor ? doctor.location : '',
          departmentName: doctor ? this.getDepartmentName(doctor.departmentId) : '',
          departmentId: doctor ? doctor.departmentId : null
        };
      });
    },
    // 筛选后的医生列表（根据科室筛选）
    filteredDoctors() {
      if (!this.filterDepartment) {
        return this.doctors;
      }
      // 根据科室名称筛选医生
      const department = this.departments.find(d => d.department_name === this.filterDepartment);
      if (!department) return this.doctors;
      
      return this.doctors.filter(doctor => 
        doctor.departmentId == department.department_id
      );
    },
    
    // 筛选后的排班列表
    filteredSchedules() {
      return this.enhancedSchedules.filter(schedule => {
        // 日期筛选
        if (this.filterDate && schedule.scheduleDate !== this.filterDate) {
          return false;
        }
        
        // 科室筛选
        if (this.filterDepartment) {
          const department = this.departments.find(d => d.department_name === this.filterDepartment);
          if (department && schedule.departmentId != department.department_id) {
            return false;
          }
        }
        
        // 医生筛选
        if (this.filterDoctor && schedule.doctorName !== this.filterDoctor) {
          return false;
        }
        
        return true;
      });
    },
    
    // 分组后的排班数据（按医生和日期分组）
    groupedSchedules() {
      const groups = {};
      
      this.filteredSchedules.forEach(schedule => {
        const key = `${schedule.doctorId}-${schedule.scheduleDate}`;
        
        if (!groups[key]) {
          groups[key] = {
            key: key,
            doctorId: schedule.doctorId,
            doctorName: schedule.doctorName,
            doctorTitle: schedule.doctorTitle,
            doctorAvatar: schedule.doctorAvatar,
            doctorLocation: schedule.doctorLocation,
            departmentName: schedule.departmentName,
            scheduleDate: schedule.scheduleDate,
            schedules: []
          };
        }
        
        groups[key].schedules.push(schedule);
      });
      
      // 对每个分组内的时间段进行排序
      Object.values(groups).forEach(group => {
        group.schedules.sort((a, b) => {
          const aStart = a.timeSlot.split('-')[0];
          const bStart = b.timeSlot.split('-')[0];
          return aStart.localeCompare(bStart);
        });
      });
      
      return Object.values(groups);
    }
  },
  
  created() {
    this.fetchDepartments();
    this.fetchDoctors();
    // 默认获取今天的排班
    this.fetchSchedulesByDate(this.filterDate);
  },
  
  watch: {
    mode(val) {
      if (val === 'schedule') {
        // 切换到排班模式时获取今天的排班
        this.fetchSchedulesByDate(this.filterDate);
      }
    }
  },
  
  methods: {
     // 添加获取医生姓名的方法
    getDoctorName(doctorId) {
      const doctor = this.doctors.find(d => d.doctorId === doctorId);
      return doctor ? doctor.name : '未知医生';
    },
    
    // 编辑排班
    editSchedule(schedule) {
      this.editingSchedule = schedule;
      this.scheduleForm = { ...schedule };
    },
    
    // 取消编辑排班
    cancelEditSchedule() {
      this.editingSchedule = null;
      this.resetScheduleForm();
    },
    
    // 重置排班表单
    resetScheduleForm() {
      const today = new Date().toISOString().slice(0, 10);
      this.scheduleForm = {
        doctorId: null,
        scheduleDate: today,
        timeSlot: '',
        maxCapacity: 10
      };
    },
    
    // 更新排班（通过先删除再添加的方式）
    async updateSchedule() {
      if (!this.validateScheduleForm()) return;
      
      // 检查冲突（排除自身）
      if (this.checkScheduleConflict(
        this.scheduleForm.doctorId,
        this.scheduleForm.scheduleDate,
        this.scheduleForm.timeSlot,
        this.editingSchedule.scheduleId // 排除当前正在编辑的排班
      )) {
        alert('该医生在此时间段已有其他排班，请选择其他时间');
        return;
      }
      
      try {
        // 先删除旧排班
        await axios.post(`${API_BASE_URL}/deleteScheduleById?scheduleId=${this.editingSchedule.scheduleId}`);
        
        // 再添加新排班
        const payload = { 
          doctorId: Number(this.scheduleForm.doctorId),
          scheduleDate: this.scheduleForm.scheduleDate,
          timeSlot: this.scheduleForm.timeSlot,
          maxCapacity: Number(this.scheduleForm.maxCapacity),
          booked: 0 
        };
        
        const response = await axios.post(`${API_BASE_URL}/addSchedule`, payload);
        
        if (response.data.code === 200) {
          // 更新成功后重新获取当前筛选条件下的排班
          this.applyFilters();
          this.editingSchedule = null;
          this.resetScheduleForm();
          alert('排班更新成功');
        } else {
          alert('排班更新失败: ' + response.data.msg);
          // 如果添加失败，尝试恢复旧排班
          await this.restoreOldSchedule();
        }
      } catch (error) {
        console.error('更新排班失败:', error);
        alert('更新排班失败，请检查网络连接');
        // 如果出现异常，尝试恢复旧排班
        await this.restoreOldSchedule();
      }
    },
    
    // 恢复旧排班（用于错误处理）
    async restoreOldSchedule() {
      try {
        const payload = { 
          doctorId: Number(this.editingSchedule.doctorId),
          scheduleDate: this.editingSchedule.scheduleDate,
          timeSlot: this.editingSchedule.timeSlot,
          maxCapacity: Number(this.editingSchedule.maxCapacity),
          booked: Number(this.editingSchedule.booked)
        };
        
        await axios.post(`${API_BASE_URL}/addSchedule`, payload);
        console.log('旧排班已恢复');
      } catch (error) {
        console.error('恢复旧排班失败:', error);
        alert('更新排班失败且恢复旧排班也失败，请手动检查排班数据');
      }
    },
    
   // 修改冲突检测方法，支持排除特定排班
    checkScheduleConflict(doctorId, date, timeSlot, excludeScheduleId = null) {
      return this.rawSchedules.some(schedule => 
        schedule.doctorId === doctorId && 
        schedule.scheduleDate === date && 
        schedule.timeSlot === timeSlot &&
        (!excludeScheduleId || schedule.scheduleId !== excludeScheduleId)
      );
    },
    // 应用筛选条件
    applyFilters() {
      if (this.filterDate) {
        this.fetchSchedulesByDate(this.filterDate);
      } else if (this.filterDepartment) {
        this.fetchSchedulesByDepartment(this.filterDepartment);
      } else if (this.filterDoctor) {
        this.fetchSchedulesByDoctor(this.filterDoctor);
      } else {
        // 如果没有筛选条件，获取今天的排班
        const today = new Date().toISOString().slice(0, 10);
        this.filterDate = today;
        this.fetchSchedulesByDate(today);
      }
    },
    
    // 重置筛选
    resetFilters() {
      const today = new Date().toISOString().slice(0, 10);
      this.filterDate = today;
      this.filterDepartment = '';
      this.filterDoctor = '';
      this.fetchSchedulesByDate(today);
    },
    
    goBack() { this.$router.go(-1); },
    
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    
    removeImage() {
      this.docForm.avatar = null;
    },
    
    getDepartmentName(id) {
      const dept = this.departments.find(d => d.department_id === id);
      return dept ? dept.department_name : '';
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
    },
    
    // 获取完整的图片URL
    getFullImageUrl(path) {
      if (!path) return this.getAvatarPlaceholder();
      if (path.startsWith('http')) return path;
      return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    },
    
    // 获取SVG占位图
    getAvatarPlaceholder() {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Cpath d='M30,85 Q50,65 70,85' stroke='%23ccc' stroke-width='5' fill='none'/%3E%3C/svg%3E";
    },
    
    // 获取号源状态类名
    getCapacityStatusClass(booked, max) {
      const ratio = booked / max;
      if (ratio === 1) return 'status-full';
      if (ratio >= 0.8) return 'status-warning';
      return 'status-available';
    },

    /* ===== 科室相关 ===== */
    fetchDepartments() {
      // 这里应该调用获取科室的接口，暂时使用硬编码数据
      this.departments = [
        { department_id: 1, department_name: '眼科' },
        { department_id: 2, department_name: '骨科' },
        { department_id: 3, department_name: '外科' },
        { department_id: 4, department_name: '皮肤科' },
        { department_id: 5, department_name: '内科' },
        { department_id: 6, department_name: '心肺科' },
        { department_id: 7, department_name: '口腔科' },
        { department_id: 8, department_name: '神经外科' }
      ];
    },

    /* ===== 医生相关 ===== */
    fetchDoctors() {
      return axios.get(`${API_BASE_URL}/getAllDoctors`)
        .then((res) => {
          if (res.data.code === 200) {
            this.doctors = res.data.data;
          } else {
            console.error('获取医生列表失败:', res.data.msg);
            this.doctors = [];
          }
        })
        .catch((error) => {
          console.error('获取医生列表失败:', error);
          this.doctors = [];
        });
    },
    
    async uploadAvatar(e) {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/uploadImage`,
          formData,
          { 
            headers: { 
              'Content-Type': 'multipart/form-data'
            } 
          }
        );

        if (data.code === 200) {
          this.docForm.avatar = data.data;
          console.log("头像上传成功", data.data);
        } else {
          console.error('上传失败:', data.msg);
          alert('头像上传失败: ' + data.msg);
        }
      } catch (err) {
        console.error('上传头像失败:', err);
        alert('头像上传失败，请检查网络连接');
      }
    },
     // 保存医生信息（新增或更新）
    saveDoctor() {
      if (!this.validateDoctorForm()) return;
      
      if (this.editingDoctor) {
        this.updateDoctor();
      } else {
        this.addDoctor();
      }
    },
   addDoctor() {
      if (!this.validateDoctorForm()) return;
      
      const payload = { 
        ...this.docForm
      };
      // 移除doctorId字段（如果是新增）
      delete payload.doctorId;
      axios.post(`${API_BASE_URL}/addDoctor`, payload)
        .then((res) => {
          if (res.data.code === 200) {
            this.fetchDoctors();
            this.resetDoctorForm();
            alert('医生添加成功');
          } else {
            alert('添加医生失败: ' + res.data.msg);
          }
        })
        .catch((error) => {
          console.error('添加医生失败:', error);
          alert('添加医生失败，请检查网络连接');
        });
    },
     // 更新医生信息
    updateDoctor() {
      const payload = { 
        ...this.docForm
      };
      
      axios.post(`${API_BASE_URL}/updateDoctor`, payload)
        .then((res) => {
          if (res.data.code === 200) {
            this.fetchDoctors();
            this.resetDoctorForm();
            alert('医生信息更新成功');
          } else {
            alert('更新医生信息失败: ' + res.data.msg);
          }
        })
        .catch((error) => {
          console.error('更新医生信息失败:', error);
          alert('更新医生信息失败，请检查网络连接');
        });
    },
    editDoctor(doctor) {
      this.editingDoctor = doctor;
      this.docForm = { ...doctor };
       // 滚动到表单顶部
      this.$nextTick(() => {
        const formCard = document.querySelector('.form-card');
        if (formCard) {
          formCard.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
     // 取消编辑
    cancelEdit() {
      this.resetDoctorForm();
    },
    deleteDoctor(doctorId) {
      if (!confirm('确定要删除这位医生吗？')) return;
      
      axios.post(`${API_BASE_URL}/deleteDoctorById?doctorId=${doctorId}`)
        .then((res) => {
          if (res.data.code === 200) {
            this.fetchDoctors();
            alert('医生删除成功');
          } else {
            alert('删除医生失败: ' + res.data.msg);
          }
        })
        .catch((error) => {
          console.error('删除医生失败:', error);
          alert('删除医生失败，请检查网络连接');
        });
    },
    
    validateDoctorForm() {
      if (!this.docForm.name) {
        alert('请输入医生姓名');
        return false;
      }
      if (!this.docForm.departmentId) {
        alert('请选择科室');
        return false;
      }
      return true;
    },
    
    resetDoctorForm() {
      this.docForm = {
        name: '',
        title: '',
        fee: 0,
        expertise: '',
        brief: '',
        location: '',
        departmentId: null,
        avatar: null
      };
      this.editingDoctor = null;
    },

    /* ===== 排班相关 ===== */
    // 根据日期获取排班
    fetchSchedulesByDate(date) {
      console.log('date',date);
      axios.get(`${API_BASE_URL}/getScheduleByDate`, {
        params: { date: date }
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.rawSchedules = res.data.data;
            console.log('获取排班信息成功');
          } else {
            console.error('获取排班信息失败:', res.data.msg);
            this.rawSchedules = [];
          }
        })
        .catch((error) => {
          console.error('获取排班信息失败:', error);
          this.rawSchedules = [];
        });
    },
    
    // 根据科室获取排班
    fetchSchedulesByDepartment(departmentName) {
      axios.get(`${API_BASE_URL}/getScheduledByDepart`, {
        params: { departmentName: departmentName }
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.rawSchedules = res.data.data;
          } else {
            console.error('获取排班信息失败:', res.data.msg);
            this.rawSchedules = [];
          }
        })
        .catch((error) => {
          console.error('获取排班信息失败:', error);
          this.rawSchedules = [];
        });
    },
    
    // 根据医生获取排班
    fetchSchedulesByDoctor(doctorName) {
      axios.get(`${API_BASE_URL}/getScheduledByDoctorName`, {
        params: { doctorName: doctorName }
      })
        .then((res) => {
          if (res.data.code === 200) {
            this.rawSchedules = res.data.data;
          } else {
            console.error('获取排班信息失败:', res.data.msg);
            this.rawSchedules = [];
          }
        })
        .catch((error) => {
          console.error('获取排班信息失败:', error);
          this.rawSchedules = [];
        });
    },
    
    addSchedule() {
      if (!this.validateScheduleForm()) return;
       // 添加冲突检测
        if (this.checkScheduleConflict(
          this.scheduleForm.doctorId,
          this.scheduleForm.scheduleDate,
          this.scheduleForm.timeSlot
        )) {
          alert('该医生在此时间段已有排班，请选择其他时间');
          return; // 阻止提交
        }
   
      const payload = { 
        doctorId: Number(this.scheduleForm.doctorId),
        scheduleDate: this.scheduleForm.scheduleDate,
        timeSlot: this.scheduleForm.timeSlot,
        maxCapacity: Number(this.scheduleForm.maxCapacity),
        booked: 0 
      };
  
      axios.post(`${API_BASE_URL}/addSchedule`, payload)
        .then((res) => {
          if (res.data.code === 200) {
            // 添加成功后重新获取当前筛选条件下的排班
            this.applyFilters();
            this.scheduleForm.timeSlot = '';
            this.scheduleForm.maxCapacity = 10;
            alert('排班添加成功');
            this.fetchSchedulesByDate(this.filterDate);
          } else {
            alert('排班添加失败: ' + res.data.msg);
          }
        })
        .catch((error) => {
          console.error('添加排班失败:', error);
          alert('添加排班失败，请检查网络连接');
        });
    },

    editSchedule(schedule) {
      this.editingSchedule = schedule;
      this.scheduleForm = { ...schedule };
    },

    deleteSchedule(scheduleId) {
      if (!confirm('确定要删除这个排班吗？')) return;
      
      axios.post(`${API_BASE_URL}/deleteScheduleById?scheduleId=${scheduleId}`)
        .then((res) => {
          if (res.data.code === 200) {
            // 删除成功后重新获取当前筛选条件下的排班
            this.applyFilters();
            alert('排班删除成功');
          } else {
            alert('排班删除失败: ' + res.data.msg);
          }
        })
        .catch((error) => {
          console.error('删除排班失败:', error);
          alert('删除排班失败，请检查网络连接');
        });
    },
    
    validateScheduleForm() {
      if (!this.scheduleForm.doctorId) {
        alert('请选择医生');
        return false;
      }
      if (!this.scheduleForm.scheduleDate) {
        alert('请选择日期');
        return false;
      }
      if (!this.scheduleForm.timeSlot) {
        alert('请选择时间段');
        return false;
      }
      if (!this.scheduleForm.maxCapacity || this.scheduleForm.maxCapacity < 1) {
        alert('请输入有效的号源上限');
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
* {
  box-sizing: border-box;
}
/* 添加编辑状态提示样式 */
.edit-notice {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.edit-notice i {
  color: #2196f3;
  margin-right: 8px;
}
.doctor-schedule-panel {
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #42b983 0%, #33a06f 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  align-items: center;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  margin-right: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.mode-switch {
  display: flex;
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.mode-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.mode-btn i {
  margin-right: 5px;
}

.mode-btn.active {
  background: rgba(255, 255, 255, 0.3);
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 主要内容区域 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 区域标题 */
.section-header {
  margin-bottom: 25px;
}

.section-header h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.section-header h2 i {
  margin-right: 10px;
  color: #42b983;
}

.section-header p {
  color: #7a8a9a;
  margin: 0;
}

/* 表单卡片 */
.form-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.form-card h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.form-grid.compact {
  grid-template-columns: repeat(2, 1fr);
}

.form-group_qian {
  display: flex;
  flex-direction: column;
}

.form-group_qian.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-input, .form-select, .form-textarea {
  padding: 12px 15px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}
/* 上传区域 */
.upload-area_qian {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area_qian:hover {
  border-color: #42b983;
}

.upload-area_qian.has-image {
  border-style: solid;
  padding: 5px;
}

.file-input {
  display: none;
}
.upload-placeholder {
  color: #97a8be;
}

.upload-placeholder i {
  font-size: 2rem;
  margin-bottom: 10px;
  display: block;
}

.upload-placeholder p {
  margin: 0;
}

.image-preview_qian {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview_qian img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-image-btn_qian {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ff5252;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

/* 提交按钮 */
.submit-btn_qian {
  background: linear-gradient(135deg, #42b983 0%, #33a06f 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.submit-btn_qian i {
  margin-right: 8px;
}

.submit-btn_qian:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}
/* 医生列表 */
.doctor-list, .schedule-list {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.doctor-list h3, .schedule-list h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

/* 医生头像样式 */
.doctor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 医生项样式 */
.doctor-item {
  border: 1px solid #e6ebf5;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.doctor-item:hover {
  border-color: #42b983;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.1);
}

.doctor-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.doctor-details {
  flex: 1;
}

.doctor-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.doctor-title, .doctor-department {
  color: #5a6d82;
  margin-bottom: 5px;
  font-size: 0.9rem;
}
/* 筛选卡片样式 */
.filter-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.filter-card h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.filter-card h3 i {
  margin-right: 8px;
  color: #42b983;
}

.filter-form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.filter-reset-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 10px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
}

.filter-reset-btn i {
  margin-right: 5px;
}

.filter-reset-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.submit-btn_qian.filter-btn {
  padding: 10px 15px;
  font-size: 0.9rem;
  margin-left: 0;
}

/* 排班组样式 */
.schedule-list {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.schedule-list h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.schedule-group {
  border: 1px solid #e6ebf5;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background: white;
  display: flex;
  flex-direction: column;
}

.schedule-group:hover {
  border-color: #42b983;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.15);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.doctor-info {
  display: flex;
  align-items: center;
}

.doctor-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-details {
  flex: 1;
}

.doctor-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 1.1rem;
}

.name-label {
  font-weight: 500;
  color: #7a8a9a;
}

.doctor-title-department {
  color: #5a6d82;
  font-size: 0.9rem;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.group-date {
  color: #5a6d82;
  font-weight: 500;
  background: #f8f9fa;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

.time-slot-card {
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
  border: 1px solid #eee;
}

.time-slot-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 号源状态背景色 */
.status-available {
  background: #e8f5e9;
  border-color: #c8e6c9;
}

.status-warning {
  background: #fff8e1;
  border-color: #ffecb3;
}

.status-full {
  background: #ffebee;
  border-color: #ffcdd2;
}

.time-range {
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
  font-size: 0.95rem;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.slot-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slot-capacity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.capacity-label {
  color: #666;
  font-weight: 500;
}

.booked {
  color: #ff5252;
  font-weight: 600;
}

.max {
  color: #42b983;
  font-weight: 600;
}

.slot-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn_qian {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn_qian.edit {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;
}

.action-btn_qian.edit:hover {
  background: rgba(33, 150, 243, 0.2);
}

.action-btn_qian.delete {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.action-btn_qian.delete:hover {
  background: rgba(244, 67, 54, 0.2);
}

.group-footer {
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  margin-top: auto;
}

.schedule-location {
  color: #7f8c8d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.schedule-location i {
  margin-right: 5px;
  color: #42b983;
}
.doctor-actions, .schedule-actions {
  display: flex;
  gap: 8px;
}

.action-btn_qian {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn_qian.edit {
  background: #e3f2fd;
  color: #2196f3;
}

.action-btn_qian.edit:hover {
  background: #bbdefb;
}

.action-btn_qian.delete {
  background: #ffebee;
  color: #ff5252;
}

.action-btn_qian.delete:hover {
  background: #ffcdd2;
}
/* 无数据提示样式 */
.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #97a8be;
}

.no-data i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
}

.no-data p {
  margin: 0;
  font-size: 1.1rem;
}

/* 过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .filter-form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .list-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .mode-switch {
    margin-left: 0;
    margin-top: 15px;
    width: 100%;
  }
  
  .mode-btn {
    flex: 1;
    justify-content: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid.compact {
    grid-template-columns: 1fr;
  }
  
  .filter-form-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-buttons {
    justify-content: stretch;
  }
  
  .group-header {
    flex-direction: column;
  }
  
  .group-date {
    margin-top: 10px;
    align-self: flex-start;
  }
  
  .time-slots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .time-slots-grid {
    grid-template-columns: 1fr;
  }
  
  .slot-capacity {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .slot-actions {
    flex-direction: column;
  }
  
  .action-btn_qian {
    width: 100%;
  }
}
</style>