<template>
  <div class="basket-sidebar">
    <!-- Top Title -->
    <div class="basket-top">
      <span class="basket-title">{{ title }}</span>
      <div
        v-if="type === 'packages'"
        @click="setCustomerListModal(true)"
        class="basket-customer"
      >
        <ion-icon name="person-add" style="font-size:16px;"></ion-icon>
        {{ getCustomer }}
      </div>
    </div>

    <!-- Product List -->
    <div class="basket-list">
      <div class="basket-list-inner">
        <PBasketItem
          v-for="item in productItems"
          :key="item.id"
          :item="item"
          :type="type"
          v-if="productItems.length"
          :isBillingPage="isBillingPage"
        />
        <p v-else class="basket-empty">Adisyon'da Sipariş Bulunmuyor...</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="basket-actions">
      <!-- Toplam -->
      <div class="basket-total-row">
        <span class="basket-total-label">Toplam</span>
        <span class="basket-total-price">{{ formatPrice(calculateTotalPrice) }}</span>
      </div>

      <!-- Yeni adisyon: KAYDET (status 0 veya 2) -->
      <button
        v-if="tableDetailStore.table.status === 0 || tableDetailStore.table.status === 2"
        @click="onSave()"
        :disabled="!productItems.length"
        class="basket-btn"
        :class="productItems.length ? 'basket-btn--save' : 'basket-btn--disabled'"
      >
        <ion-icon name="checkmark-circle-outline" style="font-size:17px;"></ion-icon>
        ADİSYONU KAYDET
      </button>

      <!-- Mevcut adisyon: GÜNCELLE (status 1 veya 3) -->
      <button
        v-if="tableDetailStore.table.status === 1 || tableDetailStore.table.status === 3"
        @click="updateProductTables()"
        :disabled="!productItems.length"
        class="basket-btn"
        :class="productItems.length ? 'basket-btn--update' : 'basket-btn--disabled'"
      >
        <ion-icon name="cloud-upload-outline" style="font-size:17px;"></ion-icon>
        ADİSYONU GÜNCELLE
      </button>

      <!-- Gel-al -->
      <button
        v-if="tableDetailStore.table.isFastSell !== undefined"
        :disabled="!getIsAvailableFastSellButton"
        @click="onFastSell()"
        class="basket-btn"
        :class="getIsAvailableFastSellButton ? 'basket-btn--save' : 'basket-btn--disabled'"
      >
        <ion-icon name="checkmark-circle-outline" style="font-size:17px;"></ion-icon>
        SİPARİŞLERİ KAYDET
      </button>

      <!-- Paket -->
      <button
        v-if="tableDetailStore.table.isPackages !== undefined"
        :disabled="!getIsAvailableFastSellButton"
        @click="onPackages()"
        class="basket-btn"
        :class="getIsAvailableFastSellButton ? 'basket-btn--save' : 'basket-btn--disabled'"
      >
        <ion-icon name="checkmark-circle-outline" style="font-size:17px;"></ion-icon>
        ADİSYONU KAYDET
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import formatPrice from "../../utils/formatPrice";
import {
  addProductToTable,
  tableDetailStore,
  calculatePayedTotal,
  getCartTotal,
  itemAbsolutePrice,
  updateProductTables,
} from "../../store/table-detail";
import { setPaymentMethodModal, setCustomerListModal } from "../../store/modal";
import PBasketItem from "./PBasketItem.vue";
import router from "../../router";
import { useRoute } from "vue-router";

const props = defineProps(["type", "productItems", "title"]);
const route = useRoute();

const getCustomer = computed(() => {
  return tableDetailStore.customer === null ? "Müşteri Seç" : tableDetailStore.customer.name;
});

const isBillingPage = computed(() => router.currentRoute.value.fullPath.includes("bill"));

const payedTotal = computed(() => calculatePayedTotal());

const calculateTotalPrice = computed(() => {
  if (isBillingPage.value) return getCartTotal() - payedTotal.value;
  return props.productItems.reduce((total, item) => {
    const tableRoute = route.fullPath.split("/")[1] == "tables";
    return tableRoute
      ? (route.params.id ? total + itemAbsolutePrice(item) : total + Number(item.amount))
      : total + itemAbsolutePrice(item);
  }, 0);
});

const getIsAvailableFastSellButton = computed(() => getCartTotal() > 0);

const onSave = () => addProductToTable();
const onFastSell = () => { if (getIsAvailableFastSellButton.value) setPaymentMethodModal(true); };
const onPackages = () => {
  if (getIsAvailableFastSellButton.value) {
    if (tableDetailStore.customer === null) setCustomerListModal(true);
    else setPaymentMethodModal(true);
  }
};
</script>

<style scoped>
.basket-sidebar {
  background: #fff;
  width: 30%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 16px;
  border-bottom-left-radius: 16px;
  overflow: hidden;
}

@media (max-width: 992px) {
  .basket-sidebar {
    width: 100%;
    border-radius: 12px;
  }
}

.basket-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.basket-title {
  font-size: 14px;
  font-weight: 700;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.basket-customer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #4f46e5;
  cursor: pointer;
  transition: color 0.12s;
}
.basket-customer:hover { color: #4338ca; }

.basket-list {
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  max-height: calc(100vh - 220px);
}
.basket-list::-webkit-scrollbar { display: none; }

.basket-list-inner {
  display: flex;
  flex-direction: column;
}

.basket-empty {
  color: #94a3b8;
  text-align: center;
  font-size: 13px;
  padding: 24px 16px;
  margin: 0;
}

.basket-actions {
  border-top: 1px solid #f1f5f9;
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.basket-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px 14px;
}

.basket-total-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.basket-total-price {
  font-size: 16px;
  font-weight: 800;
  color: #4f46e5;
}

.basket-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, transform 0.1s;
  letter-spacing: 0.3px;
}
.basket-btn:active { transform: scale(0.98); }

.basket-btn--save { background: #4f46e5; color: #fff; }
.basket-btn--save:hover { background: #4338ca; }

.basket-btn--update { background: #f59e0b; color: #fff; }
.basket-btn--update:hover { background: #d97706; }

.basket-btn--disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
</style>
