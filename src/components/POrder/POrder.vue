<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
    <!-- Top: Breadcrumb + Search -->
    <div class="px-4 py-3 border-b border-slate-100">
      <PBreadcrumb :items="getBreadcrumb" />
      <div class="mt-2 relative">
        <ion-icon name="search-outline" style="font-size:16px; color:#94a3b8; position:absolute; left:12px; top:50%; transform:translateY(-50%);"></ion-icon>
        <input
          v-model="searchText"
          type="text"
          placeholder="Ürün ara..."
          class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Product grid -->
    <div class="flex-1 overflow-y-auto no-scrollbar">
      <ProductItem :product="filteredOrderItems" />
    </div>
  </div>

  <FeatureList />
</template>

<script setup lang="ts">
import PBreadcrumb from "../PBreadcrumb/PBreadcrumb.vue";
import ProductItem from "./ProductItem/ProductItem.vue";
import FeatureList from "../Modal/FeatureList.vue";
import { computed, ref } from "vue";
import { tableDetailStore, getSelectedCategory } from "../../store/table-detail";

const props = defineProps(["orderItems"]);
const searchText = ref("");

const filteredOrderItems = computed(() => {
  if (!props.orderItems) return [];
  return props.orderItems.filter((item: any) =>
    item.name?.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const getBreadcrumb = computed(() => {
  const selectedCategory = getSelectedCategory();
  var result = [];
  result.push({ label: "Menüler", url: "/" });
  if (selectedCategory) {
    result.push(
      { label: selectedCategory.name, url: "/" },
      ...tableDetailStore.selectedCategory
    );
  }
  return result;
});
</script>
