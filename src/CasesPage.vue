<template>
  <div class="cases-page">
    <h2 class="page-title">病例记录管理</h2>
    <div class="cases-grid">
      <div class="case-card" v-for="caseItem in cases" :key="caseItem.id">
        <div class="case-header">
          <span class="case-id">病例编号：{{ caseItem.id }}</span>
          <span class="case-date">{{ caseItem.date }}</span>
        </div>
        <div class="case-content">
          <div class="case-row">
            <span class="label">宠物名称：</span>
            <span class="value">{{ caseItem.petName }}</span>
          </div>
          <div class="case-row">
            <span class="label">诊断结果：</span>
            <span class="value">{{ caseItem.diagnosis }}</span>
          </div>
          <div class="case-row">
            <span class="label">治疗方案：</span>
            <span class="value">{{ caseItem.treatment }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cases = ref([
  {
    id: 'C001',
    date: '2025-08-28',
    petName: '小白',
    diagnosis: '犬瘟热',
    treatment: '阿莫西林 0.5g 口服 2次/天'
  },
  {
    id: 'C002', 
    date: '2025-08-27',
    petName: '小花',
    diagnosis: '猫传染性腹膜炎',
    treatment: '头孢 0.2g 口服 1次/天'
  },
  {
    id: 'C003',
    date: '2025-08-26', 
    petName: '小黑',
    diagnosis: '肠胃炎',
    treatment: '庆大霉素 0.1g 口服 1次/天'
  }
])
</script>

<style scoped>
.cases-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #305aa2;
  margin-bottom: 24px;
  text-align: center;
}

.cases-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  overflow-y: auto;
  max-height: none;
}

.case-card {
  background: rgba(247, 250, 253, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(41,122,184,0.08);
  padding: 20px;
  border-left: 4px solid #1976d2;
  transition: all 0.2s;
}

.case-card:hover {
  box-shadow: 0 4px 20px rgba(41,122,184,0.15);
  transform: translateY(-2px);
}

.case-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(41,122,184,0.1);
}

.case-id {
  font-weight: bold;
  color: #305aa2;
  font-size: 16px;
}

.case-date {
  color: #888;
  font-size: 14px;
}

.case-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.case-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 600;
  color: #305aa2;
  min-width: 80px;
}

.value {
  color: #222;
  flex: 1;
}
</style>
