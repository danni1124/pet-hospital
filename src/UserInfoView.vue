<template>
  <div class="user-center-bg">
    <!-- 顶部用户信息卡片 -->
    <div class="user-card">
      <img class="avatar" src=""/>
      <div class="user-info">
        <div class="user-row">
          <span class="user-username">@ jack</span>
          <span class="level">Lv.5</span>
        </div>
        <div class="user-id">通行证ID:291423473</div>
      </div>

    </div>

    <!-- 主体区域 -->
    <div class="main-area">
      <!-- 左侧导航 -->
      <aside class="side-nav">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['nav-item', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </div>
      </aside>

      <!-- 右侧内容 -->
      <main class="content-area">
        <component :is="currentComponent" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import CasesRecord from './CasesRecord.vue'
import CouponRecord from './CouponRecord.vue'

const tabs = [
  { key: 'cases',   label: '病例记录',   icon: '📋' },
  { key: 'booking', label: '预约记录',   icon: '📅' },
  { key: 'coupon',  label: '优惠券记录', icon: '🎟' },
  { key: 'order',   label: '订单记录',   icon: '📦' }
]

const activeTab = ref('cases')

const BookingRecord = { template: `<div class="placeholder">📅 预约记录</div>` }
const CouponRecord  = { template: `<div class="placeholder">🎟 优惠券记录</div>` }
const OrderRecord   = { template: `<div class="placeholder">📦 订单记录</div>` }

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'cases':   return CasesRecord
    case 'booking': return BookingRecord
    case 'coupon':  return CouponRecord
    case 'order':   return OrderRecord
    default:        return BookingRecord
  }
})


const BookingRecord = { template: `<div class="placeholder">📅 预约记录</div>` }
const OrderRecord   = { template: `<div class="placeholder">📦 订单记录</div>` }

</script>

<style scoped>
.user-center-bg {
  background: #f5f7fa;
  min-height: 100vh;
  width: 100vw;           /* 改为视口宽度，确保更宽 */
  padding: 1px 0 0 0;    /* 顶部增加64px内边距，不覆盖导航栏 */
  box-sizing: border-box; /* 防止溢出 */
}

.user-card {
  display: flex;
  align-items: center;
  background: #f3cdf6;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.15);
  padding: 32px 100px;
  margin: 24px auto 0 auto;
  max-width: 900px;
  position: relative;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 32px;
  border: 4px solid #e3eaf2;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: bold;
  color: #222;
}

.level {
  background: #e3f0ff;
  color: #305aa2;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 14px;
  font-weight: 600;
}

.user-id {
  font-size: 13px;
  color: #888;
}

.user-username {
  font-size: 15px;
  color: #e57373;
}

.user-stats {
  display: flex;
  gap: 32px;
  margin-top: 8px;
  font-size: 15px;
  color: #888;
}

.edit-btn {
  position: absolute;
  right: 32px;
  top: 32px;
  background: #fff;
  border: 1px solid #b6d0f7;
  color: #305aa2;
  border-radius: 8px;
  padding: 6px 24px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #e3f0ff;
}

/* 主体区域布局 */
.main-area {
  display: flex;
  width: 1090px;             /* 与卡片同宽 */
  margin: 32px auto 0;      /* 增加上间距 */
  gap: 24px;
  box-sizing: border-box;
}

/* 左侧导航 */
.side-nav {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.10);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nav-item {
  padding: 12px 32px;
  font-size: 16px;
  color: #305aa2;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  margin: 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-icon {
  font-size: 18px;
}

.nav-item.active {
  background: #e3f0ff;
  color: #222;
  font-weight: bold;
}

.nav-item:hover {
  background: #f5f7fa;
}

/* 右侧内容区 */
.content-area {
  flex: 1 1 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.10);
  padding: 32px 32px;
  min-height: 400px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
}

.placeholder {
  font-size: 20px;
  font-weight: 500;
  color: #305aa2;
}
.prescription-wrapper {
  background: #fff;
  border: 1px solid #bbb;
  border-radius: 6px;
  padding: 24px 32px 12px 32px;
  font-family: 'SimSun', 'serif';
  color: #222;
  min-width: 600px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}
.prescription-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 12px;
}
.prescription-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
  font-size: 16px;
}
.prescription-table td {
  padding: 4px 8px 4px 0;
  border: none;
  white-space: nowrap;
}
.line {
  display: inline-block;
  min-width: 60px;
  border-bottom: 1px solid #888;
  margin-left: 4px;
  margin-right: 12px;
  height: 22px;
  vertical-align: bottom;
}
.prescription-main {
  display: flex;
  border-top: 1px solid #888;
  border-bottom: 1px solid #888;
  margin: 12px 0;
  min-height: 120px;
}
.diagnosis, .rp {
  flex: 1;
  padding: 12px 8px;
  font-size: 16px;
}
.diag-content, .rp-content {
  min-height: 60px;
  padding-top: 8px;
}
.prescription-footer {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-top: 16px;
  border-top: 1px solid #888;
  padding-top: 8px;
}
.prescription-note {
  position: absolute;
  right: 8px;
  top: 50%;
  writing-mode: vertical-rl;
  font-size: 13px;
  color: #888;
  letter-spacing: 2px;
}
/* 响应式 */
@media (max-width: 900px) {
  .user-card,
  .main-area {
    width: 100%;
    padding: 0 24px;        /* 小屏时也保持左右 padding 一致 */
    margin: 16px;
    flex-direction: column;
    gap: 0;
  }
}
@media (max-width: 900px) {
  .user-card, .main-area {
    max-width: 100%;
    margin: 16px;
    flex-direction: column;
    gap: 0;
    padding: 0 8px;
  }
  .side-nav {
    width: 100%;
    flex-direction: row;
    padding: 12px 0;
    gap: 0;
    margin-bottom: 12px;
  }
  .nav-item {
    flex: 1;
    margin: 0;
    text-align: center;
  }
  .content-area {
    padding: 16px;
    min-height: 200px;
  }
}
</style>