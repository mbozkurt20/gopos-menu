<template>
  <div class="bg-white flex flex-col w-full h-full overflow-hidden">
    <!-- Top Title -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
      <span class="text-indigo-600 text-base font-bold uppercase tracking-wide">{{ title }}</span>
      <div
        v-if="type === 'packages'"
        @click="setCustomerListModal(true)"
        class="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold cursor-pointer hover:text-indigo-700 transition-colors"
      >
        <ion-icon name="person-add" style="font-size:16px;"></ion-icon>
        {{ getCustomer }}
      </div>
    </div>

    <!-- Product List -->
    <div class="flex-1 overflow-y-auto no-scrollbar px-3 py-2" style="max-height:calc(100vh - 220px)">
      <div class="flex flex-col gap-2">
        <PBasketItem
          v-for="item in productItems"
          :key="item.id"
          :item="item"
          :type="type"
          v-if="productItems.length"
          :isBillingPage="isBillingPage"
        />
        <p v-else class="text-slate-400 text-center text-sm mt-6">Adisyon'da Sipariş Bulunmuyor...</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="border-t border-slate-100 px-3 py-3 bg-white flex flex-col gap-2">

      <!-- Toplam -->
      <div class="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl">
        <span class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Toplam</span>
        <span class="text-indigo-600 text-base font-extrabold">{{ formatPrice(calculateTotalPrice) }}</span>
      </div>

      <!-- Yeni adisyon: KAYDET (status 0 veya 2) -->
      <button
        v-if="tableDetailStore.table.status === 0 || tableDetailStore.table.status === 2"
        @click="onSave()"
        :disabled="!productItems.length"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-0 font-bold text-sm transition-all"
        :class="productItems.length
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95'
          : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
      >
        <ion-icon name="checkmark-circle-outline" style="font-size:18px;"></ion-icon>
        ADİSYONU KAYDET
      </button>

      <!-- Mevcut adisyon: GÜNCELLE (status 1 veya 3) -->
      <button
        v-if="tableDetailStore.table.status === 1 || tableDetailStore.table.status === 3"
        @click="updateProductTables()"
        :disabled="!productItems.length"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-0 font-bold text-sm transition-all"
        :class="productItems.length
          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-200 active:scale-95'
          : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
      >
        <ion-icon name="cloud-upload-outline" style="font-size:18px;"></ion-icon>
        ADİSYONU GÜNCELLE
      </button>

      <!-- Gel-al -->
      <button
        v-if="tableDetailStore.table.isFastSell !== undefined"
        :disabled="!getIsAvailableFastSellButton"
        @click="onFastSell()"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-0 font-bold text-sm transition-all"
        :class="getIsAvailableFastSellButton
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95'
          : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
      >
        <ion-icon name="checkmark-circle-outline" style="font-size:18px;"></ion-icon>
        SİPARİŞLERİ KAYDET
      </button>

      <!-- Paket -->
      <button
        v-if="tableDetailStore.table.isPackages !== undefined"
        :disabled="!getIsAvailableFastSellButton"
        @click="onPackages()"
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-0 font-bold text-sm transition-all"
        :class="getIsAvailableFastSellButton
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 active:scale-95'
          : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
      >
        <ion-icon name="checkmark-circle-outline" style="font-size:18px;"></ion-icon>
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
