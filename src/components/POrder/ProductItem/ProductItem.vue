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
  <div v-if="product.length > 0" class="product-grid">
    <div
      v-for="item in product"
      :key="item.id"
      class="product-card"
      :class="{ 'product-card--selected': isSelected(item) }"
      @click.stop="selectItem(item)"
    >
      <div class="product-img-wrap">
        <img :src="item.image" alt="Ürün" class="product-img" />
      </div>
      <div class="product-info">
        <div class="product-name">{{ item.name }}</div>
        <div class="product-price">
          <span v-if="packageRoute">{{ formatPrice(item.package_price) }}</span>
          <span v-else-if="fastSell">{{ formatPrice(item.fast_price) }}</span>
          <span v-else>{{ formatPrice(item.price) }}</span>
        </div>
      </div>
      <div v-if="isSelected(item)" class="product-actions">
        <button class="btn-add" @click.stop="addSelectedToCart">Ekle</button>
        <button class="btn-customize" @click.stop="openCustomizeModal(item)">Özelleştir</button>
      </div>
    </div>
  </div>

  <!-- Sub-categories -->
  <div v-if="tableDetailStore.showParent" class="cat-grid">
    <div
      v-for="item in tableDetailStore.categories[tableDetailStore.selectedIndex]?.children_recursive"
      :key="item.id"
      @click="submit(item)"
      class="cat-card"
    >
      <div class="cat-name">{{ item.name }}</div>
    </div>
  </div>

  <div v-if="tableDetailStore.showSubCategory" class="cat-grid">
    <div
      v-for="item in tableDetailStore.subCategory"
      :key="item.id"
      @click="submit(item)"
      class="cat-card"
    >
      <div class="cat-name">{{ item.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  padding: 16px;
}

.product-card {
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
}
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}
.product-card--selected {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}

.product-img-wrap {
  width: 100%;
  height: 90px;
  overflow: hidden;
  background: #f1f5f9;
  flex-shrink: 0;
}
.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.product-card:hover .product-img { transform: scale(1.05); }

.product-info {
  padding: 10px 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.product-name {
  font-size: 12px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 13px;
  font-weight: 800;
  color: #4f46e5;
  margin-top: auto;
}

.product-actions {
  display: flex;
  gap: 6px;
  padding: 0 8px 10px;
}

.btn-add, .btn-customize {
  flex: 1;
  padding: 6px 0;
  border: none;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}
.btn-add { background: #10b981; color: #fff; }
.btn-add:hover { background: #059669; }
.btn-customize { background: #4f46e5; color: #fff; }
.btn-customize:hover { background: #4338ca; }

/* Category grid */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  padding: 16px;
}

.cat-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}
.cat-card:hover { background: #eef2ff; border-color: #c7d2fe; }

.cat-name {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  text-align: center;
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    padding: 12px;
  }
}
</style>
