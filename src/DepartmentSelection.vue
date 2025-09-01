<template>
  <div class="hospital-app">
    <!-- 优化后的欢迎提示弹窗 -->
    <div v-if="showWelcomeModal" class="welcome-modal">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-paw"></i>
          <h2>温馨提示</h2>
        </div>
        
        <div class="modal-body">
          <div class="tip-item">
            <i class="fas fa-info-circle"></i>
            <div>
              <h3>预约须知</h3>
              <p>• 请提前一天预约就诊</p>
              <p>•  携带宠物疫苗记录</p>
              <p>• 特殊检查需提前禁食</p>
            </div>
          </div>
          
          <div class="tip-item">
            <i class="fas fa-clock"></i>
            <div>
              <h3>营业时间</h3>
              <p>工作日: 8:00-20:00</p>
              <p> 周末 : 9:00-18:00</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeWelcomeModal">开始预约</button>
        </div>
      </div>
    </div>
    
    <div class="header">
      <h1><i class="fas fa-hospital-alt"></i> 宠物医院科室导航</h1>
      <p>请选择科室，系统将为您导航至相应区域</p>
    </div>
    <button @click="tiaozhuan">跳转</button>
    <div class="department-container">
      <div 
        v-for="dept in departments" 
        :key="dept.id"
        class="department-item"
        :data-id="dept.id"
        @click="selectDepartment(dept)"
        :style="{'--color': colors[dept.id - 1]}"
      >
        <div class="department-id">{{ dept.id }}</div>
        <div class="department-icon">
          <i :class="icons[dept.id - 1]"></i>
        </div>
        <div class="department-name">{{ dept.name }}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2023 爱宠动物医院 | 医疗信息中心</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showWelcomeModal = ref(true);

// 科室数据
const departments = ref([
  // { id: 1, name: '内科' },
  // { id: 2, name: '外科' },
  // { id: 3, name: '口腔科' },
  // { id: 4, name: '皮肤科' },
  // { id: 5, name: '眼科' },
  // { id: 6, name: '心肺科' },
  // { id: 7, name: '骨科' },
  // { id: 8, name: '神经外科' }
  

  { id: 1, name: '眼科' },
  { id: 2, name: '骨科' },
  { id: 3, name: '外科' },
  { id: 4, name: '皮肤科' },
  { id: 5, name: '内科' },
  { id: 6, name: '心肺科' },
  { id: 7, name: '口腔科' },
  { id: 8, name: '神经外科' }
]);

// 科室图标
const icons = ref([
  'fas fa-microscope',
  'fas fa-syringe',
  'fas fa-tooth',
  'fas fa-allergies',
  'fas fa-eye',
  'fas fa-heartbeat',
  'fas fa-bone',
  'fas fa-brain'
]);

// 科室主题色
const colors = ref([
  '#0072bc', '#42b983', '#ff7043', '#ab47bc',
  '#26c6da', '#5c6bc0', '#ffa726', '#66bb6a'
]);

// 关闭欢迎提示
const closeWelcomeModal = () => {
  showWelcomeModal.value = false;
};

// 选择科室
const selectDepartment = (dept) => {
  router.push({
    name: 'AppointmentView',
    params: { departmentId: dept.id },
    query: { departmentId: dept.id }
  }); 
};
const tiaozhuan = () => {
  router.push({ path: '/shopment' });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html, body, #app, .hospital-app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.hospital-app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f5f5 100%);
  z-index: 10;
}

/* 优化后的欢迎提示弹窗 */
.welcome-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保在最顶层 */
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  width: 85%;
  max-width: 450px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  background: linear-gradient(90deg, #5ecaeb, #669ff5);
  color: white;
  padding: 18px 15px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-header .fa-paw {
  font-size: 1.8rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.modal-body {
  padding: 20px 15px;
}

.tip-item {
  display: flex;
  gap: 15px;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px dashed #e0e0e0;
  align-items: flex-start;
}

.tip-item:last-child {
  border-bottom: none;
  margin-bottom: 10px;
  padding-bottom: 0;
}

.tip-item i {
  font-size: 1.8rem;
  color: #84d19b;
  min-width: 40px;
  text-align: center;
  margin-top: 5px;
}

.tip-item h3 {
  color: #333;
  margin-bottom: 8px;
  font-size: 1.25rem;
}

.tip-item p {
  color: #555;
  line-height: 1.5;
  margin-bottom: 4px;
  font-size: 1rem;
}

.modal-footer {
  padding: 15px;
  text-align: center;
  background-color: #f8f9fa;
}

.modal-footer button {
  background: linear-gradient(90deg, #42b983, #66bb6a);
  color: white;
  border: none;
  padding: 12px 35px;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.4);
  font-weight: 600;
  width: 100%;
  max-width: 200px;
}

.modal-footer button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(66, 185, 131, 0.6);
}

.modal-footer button:active {
  transform: translateY(1px);
}

/* 页面原有样式 */
.header {
  text-align: center;
  padding: 18px;
  background: linear-gradient(90deg, #0072bc, #42b983);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 20;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.header p {
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

.department-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, minmax(0, 1fr));
  flex: 1 1 auto;
  gap: 10px;
  padding: 15px;
  overflow: hidden;
  min-height: 0;
}

.department-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 15px;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
}

.department-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--color), #0072bc);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.department-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.department-item:hover::before {
  transform: scaleX(1);
}

.department-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
  color: var(--color);
}

.department-item:hover .department-icon {
  transform: scale(1.12);
}

.department-name {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.department-id {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f0f8ff;
  color: #0072bc;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.department-item:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%);
}

.footer {
  text-align: center;
  padding: 8px;
  background: white;
  color: #666;
  font-size: 0.85rem;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .department-container {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .department-name {
    font-size: 1.7rem;
  }
}

@media (max-width: 768px) {
  .department-container {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr);
    gap: 12px;
    padding: 12px;
  }
  
  .header h1 {
    font-size: 1.7rem;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .department-name {
    font-size: 1.6rem;
  }
  
  .modal-header h2 {
    font-size: 1.3rem;
  }
  
  .tip-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
  }
  
  .tip-item i {
    margin-top: 0;
  }
}

/* 点击动画 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.department-item:active {
  animation: pulse 0.3s ease;
}
</style>