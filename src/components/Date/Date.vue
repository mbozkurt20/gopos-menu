<template>
  <div class="date-widget">
    <div class="date-time-display">{{ currentTime }}</div>
    <div class="date-formatted">{{ formattedDate }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const currentTime = ref('');
const formattedDate = ref('');

const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const update = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${h}:${m}`;
  formattedDate.value = `${now.getDate()} ${monthNames[now.getMonth()]} ${dayNames[now.getDay()]}`;
};

onMounted(() => {
  update();
  setInterval(update, 1000);
});
</script>

<style lang="scss" scoped>
.date-widget {
  text-align: right;

  .date-time-display {
    font-size: 2rem;
    font-weight: 700;
    color: #6366f1;
    line-height: 1;
    letter-spacing: 1px;
  }

  .date-formatted {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 500;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    text-align: left;
  }
}
</style>
