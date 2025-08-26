<!-- filepath: d:\PetHospital\pet-hospital\src\BookingRecord.vue -->
<template>
  <div class="booking-list">
    <div
      v-for="item in bookings"
      :key="item.id"
      class="booking-card"
    >
      <div class="booking-row">
        <span class="booking-label">预约日期</span>
        <span class="booking-value">{{ item.date }}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">预约号码</span>
        <span class="booking-value">{{ item.number }}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">状态</span>
        <span
          class="booking-status"
          :class="{
            pending: item.status === '待处理',
            success: item.status === '成功',
            fail: item.status === '失败'
          }"
        >
          {{ item.status }}
        </span>
      </div>
      <div class="booking-row">
        <span class="booking-label">创建时间</span>
        <span class="booking-value">{{ item.createdAt }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const bookings = [
  {
    id: 1,
    date: '2025-08-01',
    number: 'A20250801001',
    status: '待处理',
    createdAt: '2025-07-28 09:12'
  },
  {
    id: 2,
    date: '2025-07-15',
    number: 'A20250715002',
    status: '成功',
    createdAt: '2025-07-10 14:23'
  },
  {
    id: 3,
    date: '2025-07-05',
    number: 'A20250705003',
    status: '失败',
    createdAt: '2025-07-01 10:05'
  },
  {
    id: 4,
    date: '2025-06-20',
    number: 'A20250620004',
    status: '成功',
    createdAt: '2025-06-15 11:30'
  },
  {
    id: 5,
    date: '2025-06-10',
    number: 'A20250610005',
    status: '失败',
    createdAt: '2025-06-05 08:45'
  }
]
</script>

<style scoped>
.booking-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 600px;         /* 缩短整体宽度 */
  max-height: 340px;
  overflow-y: auto;
  padding-right: 8px;
  box-sizing: border-box;
  margin: 0 auto;
}
.booking-card {
  background: #f7fafd;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(41,122,184,0.08);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 6px solid #1976d2;
  transition: box-shadow 0.2s;
}
.booking-card:hover {
  box-shadow: 0 4px 24px rgba(41,122,184,0.16);
}
.booking-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
}
.booking-label {
  color: #305aa2;
  font-weight: 600;
  min-width: 100px;     /* 保持左侧部分宽度不变，与病例记录一致 */
  display: inline-block;
}
.booking-value {
  color: #222;
  font-weight: 500;
}
.booking-status {
  font-weight: bold;
  padding: 2px 16px;
  border-radius: 8px;
  font-size: 16px;
  background: #e3f0ff;
  color: #1976d2;
  border: 1.5px solid #b6d0f7;
  transition: background 0.2s, color 0.2s;
}
.booking-status.pending {
  background: #fffbe6;
  color: #fbc02d;
  border-color: #ffe082;
}
.booking-status.success {
  background: #e8f5e9;
  color: #43a047;
  border-color: #a5d6a7;
}
.booking-status.fail {
  background: #ffebee;
  color: #d32f2f;
  border-color: #ffcdd2;
}
</style>