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
  <!-- Main item -->
  <div
    @click="handleClickItem"
    class="bitem"
    :class="[
      getIsSelectedCartItem(item.id) ? 'bitem--selected' : 'bitem--hover',
      itemAbsoluteQuantity(item) == 0 ? 'bitem--faded' : ''
    ]"
  >
    <div class="bitem-row">
      <div class="bitem-left">
        <span v-if="type !== 'tables'" class="bitem-qty">
          {{ itemAbsoluteQuantity(item) == 0 ? 1 : itemAbsoluteQuantity(item) }}x
        </span>
        <span v-if="item.divideQuantity" class="bitem-divide">({{ item.divideQuantity }})</span>
        <span class="bitem-name">{{ item.name }}</span>
      </div>
      <span class="bitem-price">
        {{
          type === "tables"
            ? formatPrice(item.amount)
            : itemAbsoluteQuantity(item) == 0
              ? formatPrice(itemAbsolutePrice(item, true))
              : formatPrice(itemAbsolutePrice(item))
        }}
      </span>
    </div>

    <!-- Feature / portion -->
    <div class="bitem-meta">
      <div v-if="item.portion == '0.5'" class="bitem-meta-text">Yarım Porsiyon</div>
      <div v-if="item.portion == '1'" class="bitem-meta-text">1 Porsiyon</div>
      <div v-if="item.portion == '1.5'" class="bitem-meta-text">1.5 Porsiyon</div>
      <div v-if="item.features?.find(f => f.id === item.selectedFeatureId)" class="bitem-feature">
        {{ item.features?.find(f => f.id === item.selectedFeatureId)?.name }}
        ({{ item.features?.find(f => f.id === item.selectedFeatureId)?.price }}₺)
      </div>
    </div>

    <!-- Paid partial -->
    <div
      v-if="getProductPaidTotalFromPayments(item.id) % itemAbsolutePrice(item, true) != 0 && type !== 'tables'"
      class="bitem-paid"
    >
      <span class="bitem-paid-minus">- {{ getProductPaidTotalFromPayments(item.id) }}</span>
      <span class="bitem-paid-plus">+ {{ itemAbsolutePrice(item) - (getProductPaidTotalFromPayments(item.id) % itemAbsolutePrice(item, true)) }}</span>
    </div>
  </div>

  <!-- Split billing item -->
  <div
    v-if="getProductPaidTotalFromPayments(item.id) / tableDetailStore.payments[0]?.products[0]?.singleTotal >= 1 &&
      tableDetailStore.cart.find((c) => c.id == item.id)?.quantity > 1"
    class="bitem bitem--faded"
  >
    <div class="bitem-row">
      <div class="bitem-left">
        <span v-if="type !== 'tables'" class="bitem-qty bitem-qty--slate">
          {{ tableDetailStore.cart.find((c) => c.id == item.id)?.quantity - itemAbsoluteQuantity(item) }}x
        </span>
        <span class="bitem-name bitem-name--muted">{{ item.name }}</span>
      </div>
      <span class="bitem-price bitem-price--muted">
        {{ formatPrice((tableDetailStore.cart.find((c) => c.id == item.id)?.quantity - itemAbsoluteQuantity(item)) * tableDetailStore.payments[0]?.products[0].singleTotal) }}
      </span>
    </div>
    <div class="bitem-meta">
      <div v-if="item.portion == '0.5'" class="bitem-meta-text">Yarım Porsiyon</div>
      <div v-if="item.portion == '1.5'" class="bitem-meta-text">1.5 Porsiyon</div>
    </div>
  </div>

  <!-- Excluded (treat) item -->
  <div
    v-if="type !== 'tables' && item.exclude > 0"
    class="bitem bitem--faded"
    @mouseenter="pressedItemId = item.id"
    @touchstart="pressedItemId = item"
    ref="longPress"
  >
    <div class="bitem-row">
      <div class="bitem-left">
        <span class="bitem-qty bitem-qty--rose">{{ item.exclude }}x</span>
        <span class="bitem-name bitem-name--muted">{{ item.name }}</span>
      </div>
      <span class="bitem-price bitem-price--muted">{{ itemAbsolutePrice(item) }}₺</span>
    </div>
    <div class="bitem-meta">
      <div v-if="item.portion == '0.5'" class="bitem-meta-text">Yarım Porsiyon</div>
      <div v-if="item.portion == '1.5'" class="bitem-meta-text">1.5 Porsiyon</div>
      <div class="bitem-ikram">İkram Nedeni: {{ item.exclude_note }}</div>
    </div>
  </div>
</template>

<style scoped>
.bitem {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.12s;
  border-bottom: 1px solid #f1f5f9;
}
.bitem--hover:hover { background: #f8fafc; }
.bitem--selected {
  background: #eef2ff;
  border-left: 2px solid #4f46e5;
}
.bitem--faded { opacity: 0.5; }

.bitem-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.bitem-left {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.bitem-qty {
  font-size: 11px;
  font-weight: 800;
  color: #4f46e5;
  background: #eef2ff;
  border-radius: 6px;
  padding: 1px 5px;
  flex-shrink: 0;
}
.bitem-qty--slate { color: #64748b; background: #f1f5f9; }
.bitem-qty--rose  { color: #f43f5e; background: #fff1f2; }

.bitem-divide {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
}

.bitem-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bitem-name--muted { color: #64748b; }

.bitem-price {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  flex-shrink: 0;
}
.bitem-price--muted { color: #64748b; }

.bitem-meta {
  padding-left: 24px;
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bitem-meta-text {
  font-size: 11px;
  color: #94a3b8;
}

.bitem-feature {
  font-size: 11px;
  font-weight: 600;
  color: #4f46e5;
}

.bitem-ikram {
  font-size: 11px;
  font-weight: 600;
  color: #f59e0b;
}

.bitem-paid {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-left: 24px;
  margin-top: 3px;
}
.bitem-paid-minus { font-size: 11px; color: #f43f5e; font-weight: 600; }
.bitem-paid-plus  { font-size: 11px; color: #10b981; font-weight: 600; }
</style>
