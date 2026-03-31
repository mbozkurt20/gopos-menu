<template>
  <div class="porder-wrap">
    <!-- Top: Breadcrumb + Search -->
    <div class="porder-top">
      <PBreadcrumb :items="getBreadcrumb" />
      <div class="porder-search-wrap">
        <ion-icon name="search-outline" class="porder-search-icon"></ion-icon>
        <input
          v-model="searchText"
          type="text"
          placeholder="Ürün ara..."
          class="porder-search"
        />
      </div>
    </div>

    <!-- Product grid -->
    <div class="porder-content">
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

<style scoped>
.porder-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.porder-top {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.porder-search-wrap {
  position: relative;
  margin-top: 8px;
}

.porder-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #94a3b8;
  pointer-events: none;
}

.porder-search {
  width: 100%;
  height: 40px;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 12px !important;
  padding: 0 16px 0 38px !important;
  font-size: 13px !important;
  color: #1e293b !important;
  font-family: inherit;
  transition: border-color 0.15s;
}
.porder-search:focus {
  border-color: #818cf8 !important;
  box-shadow: none !important;
  outline: none;
}
.porder-search::placeholder { color: #94a3b8; }

.porder-content {
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.porder-content::-webkit-scrollbar { display: none; }
</style>
