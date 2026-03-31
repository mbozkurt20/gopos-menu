<script setup lang="ts">
import {
  tableDetailStore,
  calculateClassicProductTotal,
  parseProducts,
} from "../../../../store/table-detail";
import axios from "axios";
import router from "../../../../router";

const props = defineProps(["table", "isClickable"]);

const onMove = () => {
  if (!tableDetailStore.isDivide) {
    changeTable();
  } else {
    moveProductsToTable();
  }
};

const changeTable = () => {
  axios({
    method: "POST",
    url: "/api/v2/area/table_change",
    data: {
      table_id: tableDetailStore.willMoveTableId,
      change_id: props.table.id,
      domain: localStorage.getItem("domain"),
    },
  })
    .then(() => { tableDetailStore.tableSelectedIndex = 0; })
    .catch(() => { tableDetailStore.tableSelectedIndex = 0; });
};

const moveProductsToTable = () => {
  function getOldOrders() {
    var oldOrders = [];
    const cart = parseProducts(tableDetailStore.stateTable);
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const isTransported = cartItem.divideQuantity !== undefined || cartItem.divideQuantity > 0;
      if (isTransported) {
        if (Number(cartItem.quantity) - Number(cartItem.divideQuantity) > 0) {
          oldOrders.push({ ...cartItem, quantity: Number(cartItem.quantity) - Number(cartItem.divideQuantity) });
        }
      } else {
        oldOrders.push({ ...cartItem });
      }
    }
    return oldOrders;
  }

  function getTransports() {
    var transports = [];
    const cart = parseProducts(tableDetailStore.stateTable);
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const isTransported = cartItem.divideQuantity !== undefined || cartItem.divideQuantity > 0;
      if (isTransported) transports.push({ ...cartItem, quantity: cartItem.divideQuantity });
    }
    return transports;
  }

  const oldOrders = getOldOrders();
  const transports = getTransports();
  const totalOldOrder = calculateClassicProductTotal(oldOrders);
  const totalTransports = calculateClassicProductTotal(transports);

  axios({
    method: "POST",
    url: "api/v2/area/table_transport",
    data: {
      domain: localStorage.getItem("domain"),
      table_id: tableDetailStore.willMoveTableId,
      transport_id: props.table.id,
      transports, oldorders: oldOrders,
      total_transport: totalTransports,
      total_oldorder: totalOldOrder,
    },
  }).then(() => { window.location.reload(); }).catch((e) => { console.log(e); });
};

const go = () => {
  if (props.isClickable) {
    router.push(`/tables/${props.table.id}`);
  } else {
    onMove();
    tableDetailStore.willMoveTableId = null;
    tableDetailStore.isDivide = false;
  }
};
</script>

<template>
  <div @click="go" class="table-card table-card--empty">
    <div class="table-card__badge table-card__badge--empty">Boş</div>
    <div class="table-card__name">{{ table.name }}</div>
    <div class="table-card__sub">Sipariş yok</div>
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

.table-card--empty {
  background: #fff;
  border: 2px dashed #e2e8f0;
}
.table-card--empty:hover {
  border-color: #a5b4fc;
  background: #eef2ff;
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
.table-card__badge--empty {
  background: #f1f5f9;
  color: #94a3b8;
}

.table-card__name {
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  text-align: center;
}

.table-card__sub {
  font-size: 10px;
  color: #cbd5e1;
  font-weight: 500;
}
</style>
