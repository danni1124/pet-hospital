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
import BookingRecord from './BookingRecord.vue'

const tabs = [
  { key: 'cases',   label: '病例记录',   icon: '📋' },
  { key: 'booking', label: '预约记录',   icon: '📅' },
  { key: 'coupon',  label: '优惠券记录', icon: '🎟' },
  { key: 'order',   label: '订单记录',   icon: '📦' }
]

const activeTab = ref('cases')

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'cases':   return CasesRecord
    case 'booking': return BookingRecord
    case 'coupon':  return CouponRecord
    case 'order':   return OrderRecord
    default:        return BookingRecord
  }
})

const OrderRecord   = { template: `<div class="placeholder">📦 订单记录</div>` }
</script>

<style scoped>
.user-center-bg {
  background: linear-gradient(120deg, #f5f7fa 60%, #e3f0ff 100%);
  min-height: 100vh;
  width: 100vw;
  padding: 1px 0 0 0;
  box-sizing: border-box;
}

/* 顶部用户信息卡片美化 */
.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #f3cdf6 80%, #e3f0ff 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(200, 209, 223, 0.18);
  padding: 36px 80px;
  margin: 32px auto 0 auto;
  max-width: 935px;
  position: relative;
  transition: box-shadow 0.2s;
}
.user-card:hover {
  box-shadow: 0 8px 32px rgba(200, 209, 223, 0.22);
}
.avatar {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 40px;
  border: 5px solid #fff;
  box-shadow: 0 2px 12px rgba(200, 209, 223, 0.18);
  background: #e3f0ff;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 26px;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
}

.level {
  background: linear-gradient(90deg, #e3f0ff 60%, #f3cdf6 100%);
  color: #305aa2;
  border-radius: 10px;
  padding: 3px 16px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 1px 6px #e3f0ff;
}

.user-id {
  font-size: 15px;
  color: #888;
  margin-top: 2px;
  letter-spacing: 1px;
}

.user-username {
  font-size: 18px;
  color: #e57373;
  font-weight: bold;
  letter-spacing: 1px;
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
  border-radius: 10px;
  padding: 8px 28px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #e3f0ff;
}

.edit-btn:hover {
  background: #e3f0ff;
  box-shadow: 0 4px 16px #e3f0ff;
}

/* 主体区域布局 */
.main-area {
  display: flex;
  width: 1090px;             /* 与卡片同宽 */
  margin: 32px auto 0;      /* 增加上间距 */
  gap: 28px;
  box-sizing: border-box;
}

/* 左侧导航 */
.side-nav {
  width: 220px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(200, 209, 223, 0.10);
  padding: 28px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-item {
  padding: 14px 36px;
  font-size: 17px;
  color: #305aa2;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.2s, color 0.2s;
  margin: 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.nav-icon {
  font-size: 20px;
}

.nav-item.active {
  background: linear-gradient(90deg, #e3f0ff 70%, #f3cdf6 100%);
  color: #222;
  font-weight: bold;
  box-shadow: 0 2px 8px #e3f0ff;
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