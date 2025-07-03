<template>
  <div class="hospital-app">
    <div class="header">
      <h1><i class="fas fa-hospital-alt"></i> 医院科室导航系统</h1>
      <p>请点击下方科室进行选择，系统将带您进入相应区域</p>
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
      <p>© 2023 智慧医院导航系统 | 设计：医疗信息中心</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 引入 useRouter
import '@fortawesome/fontawesome-free/css/all.css'

const router = useRouter(); // 获取路由实例

// 科室数据
const departments = ref([
  { id: 1, name: '内科' },
  { id: 2, name: '外科' },
  { id: 3, name: '口腔科' },
  { id: 4, name: '皮肤科' },
  { id: 5, name: '眼科' },
  { id: 6, name: '心肺科' },
  { id: 7, name: '骨科' },
  { id: 8, name: '神经外科' }
]);

// 每个科室对应的图标
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

// 每个科室对应的主题色
const colors = ref([
  '#0072bc', '#42b983', '#ff7043', '#ab47bc',
  '#26c6da', '#5c6bc0', '#ffa726', '#66bb6a'
]);

// 选择科室方法
const selectDepartment = (dept) => {
  console.log(`选择了科室：${dept.name} (ID: ${dept.id})`);
  //alert(`您已选择：${dept.name}\n系统即将为您导航至该科室区域`);
  router.push({
    name: 'AppointmentView',
    params: { departmentId: dept.id }
  }); 
};
const tiaozhuan = () => {
  router.push({ path: '/shopment' });
};
</script>

<style scoped>
/* 关键修复：确保无滚动条 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app, .hospital-app {
  height: 100%;
  width: 100%;
  overflow: hidden !important; /* 确保所有层级都无滚动 */
  
}

.hospital-app {
  display: flex;
  flex-direction: column;
  height: 97vh; /* 使用视口高度 */
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f5f5 100%);
}

.header {
  text-align: center;
  padding: 20px;
  background: linear-gradient(90deg, #0072bc, #42b983);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* 防止header被压缩 */
}

.header h1 {
  font-size: 2.8rem;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.header p {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

/* 核心修复：使用flex布局确保高度精确 */
.department-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  flex: 1; /* 占据剩余所有空间 */
  gap: 20px;
  padding: 20px;
  overflow: hidden; /* 双重保险 */
  min-height: 0; /* 修复CSS Grid在flex容器中的溢出问题 */
}

.department-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
}

/* 其他样式保持不变... */
.department-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, var(--color), #0072bc);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.department-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.department-item:hover::before {
  transform: scaleX(1);
}

.department-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
  color: var(--color);
}

.department-item:hover .department-icon {
  transform: scale(1.15);
}

.department-name {
  font-size: 2.2rem;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.department-id {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f0f8ff;
  color: #0072bc;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.department-item:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%);
}

.footer {
  text-align: center;
  padding: 7px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
  flex-shrink: 0; /* 防止footer被压缩 */
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .department-container {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }
  
  .header h1 {
    font-size: 2.4rem;
  }
  
  .department-name {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .department-container {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr);
    gap: 15px;
    padding: 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .department-name {
    font-size: 1.8rem;
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