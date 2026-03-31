<script setup lang="ts">
import formatPrice from "../../utils/formatPrice";
import {
  selectCartItem,
  getIsSelectedCartItem,
  tableDetailStore,
  itemAbsolutePrice,
  itemAbsoluteQuantity,
  getProductPaidTotalFromPayments,
} from "../../store/table-detail";
import { ref } from "vue";
import router from "../../router";
import { onLongPress } from "@vueuse/core";

const longPress = ref(null);
const pressedItemId = ref(null);
const { type, item } = defineProps(["item", "type", "isBillingPage"]);

const handleClickItem = () => {
  if (type === "tables") {
    router.push("/tables/" + item.id);
  } else {
    let selectedCartItem = tableDetailStore.selectedCartItems[0];
    if (selectedCartItem && selectedCartItem.divideQuantity) {
      tableDetailStore.cart.find((c) => selectedCartItem.id == c.id).divideQuantity = 0;
    }
    if (itemAbsoluteQuantity(item) != 0) selectCartItem(item);
  }
};

onLongPress(longPress, () => {
  tableDetailStore.cart.find((c) => pressedItemId.value == c.id).exclude = 0;
}, { modifiers: { prevent: true }, delay: 500 });
</script>

<template>
  <!-- Main cart item -->
  <div
    @click="handleClickItem"
    class="flex flex-col px-3 py-2.5 cursor-pointer transition-colors border-b border-slate-100"
    :class="[
      getIsSelectedCartItem(item.id) ? 'bg-indigo-50 border-l-2 border-indigo-500' : 'hover:bg-slate-50',
      itemAbsoluteQuantity(item) == 0 ? 'opacity-50' : ''
    ]"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2 min-w-0">
        <span v-if="type !== 'tables'" class="text-xs font-extrabold text-indigo-600 bg-indigo-50 rounded-lg px-1.5 py-0.5 flex-shrink-0">
          {{ itemAbsoluteQuantity(item) == 0 ? 1 : itemAbsoluteQuantity(item) }}x
        </span>
        <span v-if="item.divideQuantity" class="text-xs text-slate-400">({{ item.divideQuantity }})</span>
        <span class="text-sm font-semibold text-slate-800 truncate">{{ item.name }}</span>
      </div>
      <span class="text-sm font-bold text-slate-800 flex-shrink-0 ml-2">
        {{
          type === "tables"
            ? formatPrice(item.amount)
            : itemAbsoluteQuantity(item) == 0
              ? formatPrice(itemAbsolutePrice(item, true))
              : formatPrice(itemAbsolutePrice(item))
        }}
      </span>
    </div>

    <!-- Features / portion info -->
    <div class="mt-1 pl-7 space-y-0.5">
      <div v-if="item.portion == '0.5'" class="text-xs text-slate-400">Yarım Porsiyon</div>
      <div v-if="item.portion == '1'" class="text-xs text-slate-400">1 Porsiyon</div>
      <div v-if="item.portion == '1.5'" class="text-xs text-slate-400">1.5 Porsiyon</div>
      <div v-if="item.features?.find(f => f.id === item.selectedFeatureId)" class="text-xs text-indigo-600 font-semibold">
        {{ item.features?.find(f => f.id === item.selectedFeatureId)?.name }}
        ({{ item.features?.find(f => f.id === item.selectedFeatureId)?.price }}₺)
      </div>
    </div>

    <!-- Paid partial info -->
    <div
      v-if="getProductPaidTotalFromPayments(item.id) % itemAbsolutePrice(item, true) != 0 && type !== 'tables'"
      class="flex justify-end gap-4 mt-1 pl-7"
    >
      <div class="text-xs text-rose-500 font-medium">- {{ getProductPaidTotalFromPayments(item.id) }}</div>
      <div class="text-xs text-emerald-600 font-medium">
        + {{ itemAbsolutePrice(item) - (getProductPaidTotalFromPayments(item.id) % itemAbsolutePrice(item, true)) }}
      </div>
    </div>
  </div>

  <!-- Split billing item -->
  <div
    v-if="getProductPaidTotalFromPayments(item.id) / tableDetailStore.payments[0]?.products[0]?.singleTotal >= 1 &&
      tableDetailStore.cart.find((c) => c.id == item.id)?.quantity > 1"
    class="flex flex-col px-3 py-2.5 cursor-pointer bg-slate-50 opacity-50 border-b border-slate-100"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2 min-w-0">
        <span v-if="type !== 'tables'" class="text-xs font-extrabold text-slate-500 bg-slate-200 rounded-lg px-1.5 py-0.5 flex-shrink-0">
          {{ tableDetailStore.cart.find((c) => c.id == item.id)?.quantity - itemAbsoluteQuantity(item) }}x
        </span>
        <span class="text-sm font-semibold text-slate-600 truncate">{{ item.name }}</span>
      </div>
      <span class="text-sm font-bold text-slate-600 flex-shrink-0 ml-2">
        {{ formatPrice((tableDetailStore.cart.find((c) => c.id == item.id)?.quantity - itemAbsoluteQuantity(item)) * tableDetailStore.payments[0]?.products[0].singleTotal) }}
      </span>
    </div>
    <div class="mt-1 pl-7 space-y-0.5">
      <div v-if="item.portion == '0.5'" class="text-xs text-slate-400">Yarım Porsiyon</div>
      <div v-if="item.portion == '1.5'" class="text-xs text-slate-400">1.5 Porsiyon</div>
    </div>
  </div>

  <!-- Excluded (treat) item -->
  <div
    v-if="type !== 'tables' && item.exclude > 0"
    class="flex flex-col px-3 py-2.5 cursor-pointer opacity-50 border-b border-slate-100"
    @mouseenter="pressedItemId = item.id"
    @touchstart="pressedItemId = item"
    ref="longPress"
  >
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-2 min-w-0">
        <span class="text-xs font-extrabold text-rose-500 bg-rose-50 rounded-lg px-1.5 py-0.5 flex-shrink-0">{{ item.exclude }}x</span>
        <span class="text-sm font-semibold text-slate-600 truncate">{{ item.name }}</span>
      </div>
      <span class="text-sm font-bold text-slate-600 flex-shrink-0 ml-2">{{ itemAbsolutePrice(item) }}₺</span>
    </div>
    <div class="mt-1 pl-7">
      <div v-if="item.portion == '0.5'" class="text-xs text-slate-400">Yarım Porsiyon</div>
      <div v-if="item.portion == '1.5'" class="text-xs text-slate-400">1.5 Porsiyon</div>
      <div class="text-xs text-amber-600 font-medium">İkram Nedeni: {{ item.exclude_note }}</div>
    </div>
  </div>
</template>
