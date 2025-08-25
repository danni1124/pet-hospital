<!-- filepath: d:\PetHospital\pet-hospital\src\CasesRecord.vue -->
<template>
  <div class="carousel-area">
    <div class="prescription-carousel-root">
      <div class="carousel-wrapper">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(record, idx) in records"
            :key="record.caseId"
            class="prescription-root"
          >
            <div class="prescription-title">宠物医院 <span class="bold">处方笺</span></div>
            <div class="prescription-table">
              <div class="row">
                <div class="cell wide">
                  <span class="label bold">动物主人/饲养单位</span>
                  <span class="underline">{{ record.owner }}</span>
                </div>
                <div class="cell">
                  <span class="label bold">档案号</span>
                  <span class="underline">{{ record.caseId }}</span>
                </div>
              </div>
              <div class="row">
                <div class="cell">
                  <span class="label bold">动物种类</span>
                  <span class="underline">{{ record.type }}</span>
                </div>
                <div class="cell">
                  <span class="label bold">动物性别</span>
                  <span class="underline">{{ record.gender }}</span>
                </div>
                <div class="cell">
                  <span class="label bold">体重/数量</span>
                  <span class="underline">{{ record.weight }}</span>
                </div>
              </div>
              <div class="row">
                <div class="cell">
                  <span class="label bold">年（日）龄</span>
                  <span class="underline">{{ record.age }}</span>
                </div>
                <div class="cell wide">
                  <span class="label bold">开具日期</span>
                  <span class="underline">{{ record.date }}</span>
                </div>
              </div>
            </div>
            <div class="prescription-main">
              <div class="main-left">
                <div class="main-label bold">诊断：</div>
                <div class="main-content">{{ record.diagnosis }}</div>
              </div>
              <div class="main-divider"></div>
              <div class="main-right">
                <div class="main-label bold">Rp：</div>
                <div class="main-content">{{ record.rp }}</div>
              </div>
            </div>
            <div class="prescription-footer">
              <div class="footer-cell">
                <span class="bold">执业兽医师</span>
                <span class="footer-underline">{{ record.doctor }}</span>
              </div>
              <div class="footer-cell">
                <span class="bold">注册号</span>
                <span class="footer-underline">{{ record.regNo }}</span>
              </div>
              <div class="footer-cell">
                <span class="bold">发药人</span>
                <span class="footer-underline">{{ record.pharmacist }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧卡通箭头，放在病历单右侧，不覆盖 -->
    <button class="slide-arrow" @click="nextRecord" aria-label="下一条">
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M16 10 L32 24 L16 38"
          fill="none"
          stroke="#1976d2"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#thick-shadow)"
        />
        <filter id="thick-shadow">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#1976d2" flood-opacity="0.2"/>
        </filter>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const records = [
  {
    owner: '张三', caseId: 'A20240728', type: '犬', gender: '公', weight: '8kg', age: '3岁', date: '2025-07-28',
    diagnosis: '犬瘟热', rp: '阿莫西林 0.5g 口服 2次/天', doctor: '李医生', regNo: '123456', pharmacist: '王药师'
  },
  {
    owner: '李四', caseId: 'B20240729', type: '猫', gender: '母', weight: '4kg', age: '2岁', date: '2025-07-29',
    diagnosis: '猫传染性腹膜炎', rp: '头孢 0.2g 口服 1次/天', doctor: '赵医生', regNo: '654321', pharmacist: '刘药师'
  },
  {
    owner: '王五', caseId: 'C20240730', type: '兔', gender: '公', weight: '1.5kg', age: '1岁', date: '2025-07-30',
    diagnosis: '肠胃炎', rp: '庆大霉素 0.1g 口服 1次/天', doctor: '钱医生', regNo: '112233', pharmacist: '孙药师'
  }
]

const currentIndex = ref(0)
function nextRecord() {
  currentIndex.value = (currentIndex.value + 1) % records.length
}
</script>

<style scoped>
.carousel-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.prescription-carousel-root {
  flex: none;
  display: flex;
  justify-content: center;
}
.carousel-wrapper {
  position: relative;
  width: 720px;
  overflow: hidden;
  min-height: 360px;
}
.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(.77,0,.18,1);
  width: 100%;
}
.prescription-root {
  min-width: 720px;
  max-width: 720px;
  min-height: 340px;
  margin: 0;
  background: #fff;
  border: 2px solid #222;
  border-radius: 4px;
  padding: 24px 32px 12px 32px;
  font-family: 'SimSun', 'serif';
  color: #222;
  position: relative;
  box-sizing: border-box;
}
.bold {
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 2px;
}
.prescription-title {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 6px;
  margin-bottom: 12px;
}
.prescription-table {
  border-top: 2px solid #222;
  border-bottom: none;
  margin-bottom: 12px;
  padding-bottom: 0;
}
.row {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}
.cell {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin: 0 0 0 0;
  padding: 6px 0 0 0;
}
.cell.wide {
  flex: 2;
}
.label {
  margin-right: 4px;
}
.underline {
  display: inline-block;
  min-width: 60px;
  border-bottom: 2px solid #222;
  margin-left: 2px;
  margin-right: 12px;
  height: 22px;
  vertical-align: bottom;
  font-weight: normal;
  font-size: 16px;
  letter-spacing: 1px;
}
.prescription-main {
  display: flex;
  border-bottom: 2px solid #222;
  border-top: 2px solid #222;
  margin-top: 12px;
  margin-bottom: 0;
  min-height: 160px;
  position: relative;
  transition: transform 0.3s;
}
.main-left, .main-right {
  flex: 1;
  padding: 16px 12px 16px 12px;
  display: flex;
  flex-direction: column;
}
.main-label {
  font-size: 18px;
  margin-bottom: 8px;
}
.main-content {
  min-height: 80px;
  font-size: 16px;
  margin-left: 8px;
  margin-top: 4px;
}
.main-divider {
  width: 2px;
  background: #222;
  margin: 0 0;
  height: auto;
}
.prescription-footer {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 12px;
  border-top: none;
  padding-top: 8px;
}
.footer-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-underline {
  display: inline-block;
  min-width: 60px;
  border-bottom: 2px solid #222;
  margin-left: 4px;
  height: 22px;
  vertical-align: bottom;
  font-weight: normal;
  font-size: 16px;
}

/* 右侧箭头按钮样式 */
.slide-arrow {
  position: relative;
  right: 0;
  top: 0;
  transform: none;
  margin-left: 24px;
  background: #fff;
  border: 3px solid #1976d2;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 48px;
  color: #1976d2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  padding: 0;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.slide-arrow:hover {
  border-color: #1565c0;
  background: #e3f0ff;
}
</style>
