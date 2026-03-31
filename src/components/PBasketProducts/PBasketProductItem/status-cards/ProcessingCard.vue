<script setup lang="ts">
import calculateTime from "../../../../utils/calculateTime";
import formatPrice from "../../../../utils/formatPrice";
import router from "../../../../router";

const props = defineProps(["table", "isClickable"]);

const go = () => {
  if (props.isClickable) {
    router.push(`/tables/${props.table.id}`);
  }
};
</script>

<template>
  <div @click="go" class="table-card table-card--processing">
    <div class="table-card__badge table-card__badge--processing">Açık</div>
    <div class="table-card__top">
      <div
        v-if="table.orders && table.orders.length > 0 && table.orders[0].customer_count > 0"
        class="table-card__person"
      >
        <ion-icon name="person-outline"></ion-icon>
        {{ table.orders[0].customer_count }}
      </div>
    </div>
    <div class="table-card__name">{{ table.name }}</div>
    <div class="table-card__amount">{{ formatPrice(table.amount) }}</div>
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

.table-card--processing {
  background: #059669;
  border: 2px solid transparent;
}
.table-card--processing:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.35);
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
.table-card__badge--processing {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.table-card__top {
  position: absolute;
  top: 10px;
  left: 10px;
}

.table-card__person {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}

.table-card__person ion-icon {
  font-size: 12px;
}

.table-card__name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  text-align: center;
}

.table-card__amount {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  text-align: center;
}

.table-card__time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
}
</style>
