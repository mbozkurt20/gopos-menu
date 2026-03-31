<script setup lang="ts">
import calculateTime from "../../../../utils/calculateTime";
import router from "../../../../router";

const props = defineProps(["table", "isClickable"]);

const go = () => {
  if (props.isClickable) {
    router.push(`/tables/${props.table.id}`);
  }
};
</script>

<template>
  <div @click="go" class="table-card table-card--revise">
    <div class="table-card__badge table-card__badge--revise">Rezerve</div>
    <div class="table-card__name">{{ table.name }}</div>
    <div v-if="table.reservation" class="table-card__reservation">{{ table.reservation }}</div>
    <div class="table-card__time">{{ calculateTime(table.updated_at) }}</div>
  </div>
</template>

<style scoped>
.table-card {
  border-radius: 18px;
  padding: 18px 14px 14px;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  user-select: none;
}

.table-card--revise {
  background: #d97706;
  border: 2px solid transparent;
}
.table-card--revise:hover {
  background: #b45309;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35);
}

.table-card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.table-card__badge--revise {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.table-card__name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.table-card__reservation {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-align: center;
}

.table-card__time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}
</style>
