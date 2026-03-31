<script setup lang="ts">
import formatPrice from "../../../utils/formatPrice";
import {
  addToCartProduct,
  setAddedProductFeatures,
  tableDetailStore,
  setSelectedCategory,
} from "../../../store/table-detail";
import { setFeatureListModal } from "../../../store/modal";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const { product } = defineProps(["product"]);
const route = useRoute();
const packageRoute = ref(route.fullPath.split("/")[1] === "packages");
const fastSell = ref(route.fullPath.split("/")[1] === "fast-sell");

const selectedItem = ref(null);

const isSelected = (item) => selectedItem.value?.id === item.id;

const selectItem = (item) => {
  selectedItem.value = isSelected(item) ? null : item;
};

const addSelectedToCart = () => {
  if (!selectedItem.value) return;
  const item = { ...selectedItem.value };
  if (packageRoute.value) item.price = item.package_price;
  else if (fastSell.value) item.price = item.fast_price;

  const audio = new Audio("/dot.mp3");
  audio.play();

  addToCartProduct({
    ...item,
    quantity: 1,
    updated_at: new Date().toString(),
    portion: 1,
  });
  selectedItem.value = null;
};

const openCustomizeModal = (item) => {
  if (item.features?.length) setAddedProductFeatures(item.features);
  tableDetailStore.selectedProductOnFeature = item;
  setFeatureListModal(true);
};

const handleClickOutside = (event: MouseEvent) => {
  const cards = document.querySelectorAll(".product-card");
  let clickedInside = false;
  cards.forEach((card) => {
    if (card.contains(event.target as Node)) clickedInside = true;
  });
  if (!clickedInside) selectedItem.value = null;
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));

const submit = (item) => {
  setSelectedCategory({ id: item.id, label: item.name, url: "/" });
  if (item.children_recursive.length > 0) {
    tableDetailStore.showParent = false;
    tableDetailStore.showSubCategory = true;
    tableDetailStore.subCategory = item.children_recursive;
  } else {
    tableDetailStore.subCategory = [];
    tableDetailStore.showSubCategory = false;
    tableDetailStore.showParent = false;
    tableDetailStore.products = item.products;
  }
};
</script>

<template>
  <!-- Products grid -->
  <div v-if="product.length > 0" class="grid gap-3 p-4" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
    <div
      v-for="item in product"
      :key="item.id"
      class="product-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
      :class="isSelected(item) ? 'ring-2 ring-indigo-500 border-indigo-300' : ''"
      @click.stop="selectItem(item)"
    >
      <div class="relative">
        <img :src="item.image" alt="Ürün" class="w-full h-24 object-cover bg-slate-100" />
      </div>
      <div class="p-3 flex flex-col gap-1 flex-1">
        <div class="text-xs font-bold text-slate-800 leading-tight line-clamp-2">{{ item.name }}</div>
        <div class="text-xs font-extrabold text-indigo-600 mt-auto">
          <span v-if="packageRoute">{{ formatPrice(item.package_price) }}</span>
          <span v-else-if="fastSell">{{ formatPrice(item.fast_price) }}</span>
          <span v-else>{{ formatPrice(item.price) }}</span>
        </div>
      </div>
      <!-- Action buttons (shown when selected) -->
      <div v-if="isSelected(item)" class="flex gap-1 px-2 pb-2">
        <button
          class="flex-1 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-[10px] font-bold transition-colors"
          @click.stop="addSelectedToCart"
        >
          Ekle
        </button>
        <button
          class="flex-1 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-bold transition-colors"
          @click.stop="openCustomizeModal(item)"
        >
          Özelleştir
        </button>
      </div>
    </div>
  </div>

  <!-- Sub-categories -->
  <div v-if="tableDetailStore.showParent" class="grid gap-3 p-4" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));">
    <div
      v-for="item in tableDetailStore.categories[tableDetailStore.selectedIndex]?.children_recursive"
      :key="item.id"
      @click="submit(item)"
      class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
      style="height: 100px;"
    >
      <div class="text-sm font-bold text-slate-700">{{ item.name }}</div>
    </div>
  </div>

  <div v-if="tableDetailStore.showSubCategory" class="grid gap-3 p-4" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));">
    <div
      v-for="item in tableDetailStore.subCategory"
      :key="item.id"
      @click="submit(item)"
      class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
      style="height: 100px;"
    >
      <div class="text-sm font-bold text-slate-700">{{ item.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
