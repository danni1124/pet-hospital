<template>
  <div class="coupon-stack">
    <div
      v-for="(coupon, idx) in coupons"
      :key="coupon.id"
      class="coupon-bg"
      :class="{ active: activeIndex === idx }"
      :style="cardStyle(idx)"
      @click="bringToTop(idx)"
    >
      <div class="coupon-main">
        <div class="coupon-left">
          <div class="coupon-discount">{{ coupon.discount }}</div>
          <div class="coupon-date">{{ coupon.startDate }} ~ {{ coupon.endDate }}</div>
          <div class="coupon-limit">满{{ coupon.minAmount }}元可用</div>
          <div class="coupon-code">券码：{{ coupon.code }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const coupons = [
  { id: 1, discount: '¥80 优惠券', startDate: '2025-09-01', endDate: '2025-09-30', minAmount: 300, code: 'ABC123' },
  { id: 2, discount: '¥50 优惠券', startDate: '2025-09-10', endDate: '2025-09-25', minAmount: 200, code: 'DEF456' },
  { id: 3, discount: '¥20 优惠券', startDate: '2025-09-15', endDate: '2025-09-20', minAmount: 100, code: 'GHI789' }
]
const activeIndex = ref(0)

function bringToTop(idx) {
  activeIndex.value = idx
}

function cardStyle(idx) {
  const offset = idx * 32
  const isActive = activeIndex.value === idx
  return {
    top: isActive ? '0px' : `${offset}px`,
    left: '0px',
    zIndex: isActive ? 10 : idx,
    transition: 'top 0.4s cubic-bezier(.77,0,.18,1), z-index 0.2s'
  }
}
</script>

<style scoped>
.coupon-stack {
  position: relative;
  width: 680px;
  height: 260px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.coupon-bg {
  position: absolute;
  left: 0;
  top: 0;
  min-width: 680px;
  max-width: 680px;
  width: 100%;
  height: 260px;
  box-shadow: 0 8px 32px rgba(44, 106, 142, 0.18);
  border-radius: 24px;
  background: linear-gradient(90deg, #f7fafd 70%, #2b6a8e 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  overflow: hidden;
  border: 1.5px solid #e3eafc;
}
.coupon-bg.active {
  box-shadow: 0 16px 48px rgba(44, 106, 142, 0.22);
  border: 2.5px solid #1976d2;
}
.coupon-main {
  display: flex;
  width: 100%;
  height: 100%;
}
.coupon-left {
  flex: 1;
  padding: 36px 40px 36px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  background: rgba(255,255,255,0.18);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  box-shadow: 0 0 32px 0 rgba(41, 122, 184, 0.06) inset;
  position: relative;
}
.coupon-discount {
  font-size: 48px;
  font-weight: 900;
  color: #2b6a8e;
  letter-spacing: 2px;
  line-height: 1.1;
  margin-bottom: 2px;
  text-shadow: 0 2px 8px #e3eafc;
}
.coupon-date {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
  background: #e3eafc;
  border-radius: 8px;
  padding: 4px 14px;
  width: fit-content;
  box-shadow: 0 1px 8px rgba(41,122,184,0.06);
}
.coupon-limit {
  font-size: 18px;
  color: #1976d2;
  font-weight: 500;
  background: #f7fafd;
  border-radius: 8px;
  padding: 4px 14px;
  width: fit-content;
  box-shadow: 0 1px 8px rgba(41,122,184,0.06);
}
.coupon-code {
  font-size: 20px;
  color: #fff;
  background: #f4d97e;
  border-radius: 16px;
  padding: 6px 18px;
  font-weight: bold;
  letter-spacing: 3px;
  width: fit-content;
  align-self: flex-start;
  box-shadow: 0 2px 12px rgba(41,122,184,0.10);
  margin-top: 8px;
}
.coupon-left::after {
  content: '';
  position: absolute;
  right: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 80px;
  background: radial-gradient(circle, #e3eafc 60%, transparent 100%);
  opacity: 0.5;
  border-radius: 50%;
}
</style>