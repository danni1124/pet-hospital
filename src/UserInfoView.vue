<template>
  <div class="user-info-wrapper">
    <!-- 左侧导航 -->
    <aside class="side-nav">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['nav-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </aside>

    <!-- 右侧内容 -->
    <main class="content-area">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

/* 1. 标签配置 */
const tabs = [
  { key: 'cases',   label: '病例' },
  { key: 'booking', label: '预约' },
  { key: 'coupon',  label: '优惠券' },
  { key: 'order',   label: '订单' }
]

/* 2. 当前高亮标签 */
const activeTab = ref('booking')

/* 3. 动态组件映射 */
const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'cases':   return CasesRecord
    case 'booking': return BookingRecord
    case 'coupon':  return CouponRecord
    case 'order':   return OrderRecord
    default:        return BookingRecord
  }
})

/* ---------- 四个占位组件 ---------- */
const CasesRecord   = { template: `<div class="placeholder">📋 病例记录模块建设中…</div>` }
const BookingRecord = { template: `<div class="placeholder">📅 预约记录模块建设中…</div>` }
const CouponRecord  = { template: `<div class="placeholder">🎟 优惠券记录模块建设中…</div>` }
const OrderRecord   = { template: `<div class="placeholder">📦 订单记录模块建设中…</div>` }
</script>

<style scoped>
/* 全局变量 */
:root {
  --primary: #6366f1;
  --primary-light: #a5b4fc;
  --bg-page: #f6f8fb;
  --bg-card: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --radius: 12px;
  --shadow: 0 2px 8px rgba(99, 102, 241, .08);
  --transition: .3s cubic-bezier(.4,0,.2,1);
}

.user-info-wrapper {
  display: flex;
  min-height: 100vh;
  background: var(--bg-page);
  padding-top: 100px; /* 留出固定导航 */
  font-family: "Inter", "PingFang SC", "Helvetica Neue", sans-serif;
}

/* ========= 左侧导航 ========= */
.side-nav {
  width: 200px;
  padding: 32px 0;
  background: var(--bg-card);
  border-right: 1px solid #e2e8f0;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  margin: 0 16px;
  padding: 14px 20px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--transition);
  color: var(--text-muted);
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(99, 102, 241, .08);
  color: var(--primary);
}

.nav-item.active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, .25);
}

/* ========= 右侧内容 ========= */
.content-area {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  font-size: 18px;
  color: var(--text-muted);
}
/* 让文字在任何背景上都清晰 */
.nav-item {
  color: #1e293b !important;   /* 深灰黑，100%可读 */
  font-weight: 600;            /* 稍粗更显眼 */
}
.nav-item.active {
  color: #fff !important;      /* 激活状态保持白字 */
}
</style>