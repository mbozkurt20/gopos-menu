<script setup>
import { ref, computed } from "vue";
import { Menu } from "../../store/menu";
import router from "@/router/index.js";

const search = ref("");
const selectedCategory = ref("all");

const filteredProducts = computed(() => {
  return Menu.categories
    .map(category => ({
      ...category,
      products: category.products.filter(
        p =>
          (selectedCategory.value === "all" || p.category_id === selectedCategory.value) &&
          p.status == 1 &&
          p.name.toLowerCase().includes(search.value.toLowerCase())
      ),
    }))
    .filter(c => c.products.length > 0);
});

const hasResults = computed(() => filteredProducts.value.length > 0);

const table = localStorage.getItem("table") ?? null;
const rawUserData = localStorage.getItem("userData");
const userData = rawUserData ? JSON.parse(rawUserData) : null;

const goOrder = () => router.push({ path: `/tables/${table}` });
</script>

<template>
  <div class="qr-root">

    <!-- Header -->
    <div class="qr-header">
      <div class="qr-header-brand">
        <div class="qr-header-icon">
          <ion-icon name="restaurant-outline" style="font-size:20px; color:#4f46e5;"></ion-icon>
        </div>
        <div>
          <div class="qr-header-name">{{ userData?.name ?? 'Menü' }}</div>
          <div class="qr-header-slogan" v-if="userData?.slogan">{{ userData.slogan }}</div>
        </div>
      </div>
      <button v-if="table" class="qr-order-btn" @click="goOrder">
        <ion-icon name="cart-outline" style="font-size:15px;"></ion-icon>
        Sipariş Ver
      </button>
    </div>

    <!-- Search -->
    <div class="qr-search-wrap">
      <div class="qr-search-inner">
        <ion-icon name="search-outline" class="qr-search-icon"></ion-icon>
        <input
          v-model="search"
          type="text"
          placeholder="Ürün ara..."
          class="qr-search"
        />
      </div>
    </div>

    <!-- Category tabs -->
    <div class="qr-cats no-scrollbar">
      <button
        class="qr-cat"
        :class="{ 'qr-cat--active': selectedCategory === 'all' }"
        @click="selectedCategory = 'all'"
      >
        Tümü
      </button>
      <button
        v-for="cat in Menu.categories"
        :key="cat.id"
        class="qr-cat"
        :class="{ 'qr-cat--active': selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Products -->
    <div class="qr-content">
      <template v-if="hasResults">
        <div v-for="category in filteredProducts" :key="category.id" class="qr-section">
          <div class="qr-section-title">{{ category.name }}</div>
          <div class="qr-grid">
            <div
              v-for="product in category.products"
              :key="product.id"
              class="qr-card"
            >
              <div class="qr-card-icon">
                <ion-icon name="fast-food-outline" style="font-size:22px; color:#a5b4fc;"></ion-icon>
              </div>
              <div class="qr-card-body">
                <div class="qr-card-name">{{ product.name }}</div>
                <div class="qr-card-desc" v-if="product.details">{{ product.details }}</div>
              </div>
              <div class="qr-card-price">₺{{ product.price }}</div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="qr-empty">
        <ion-icon name="search-outline" style="font-size:40px; color:#c7d2fe; display:block; margin:0 auto 12px;"></ion-icon>
        <div class="qr-empty-title">Ürün bulunamadı</div>
        <div class="qr-empty-sub">Farklı bir kategori veya arama deneyin</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="qr-footer">
      <ion-icon name="shield-checkmark-outline" style="font-size:12px; margin-right:4px;"></ion-icon>
      GoAdisyon · Dijital Menü
    </div>

  </div>
</template>

<style scoped lang="scss">
.qr-root {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  max-width: 680px;
  margin: 0 auto;
}

/* Header */
.qr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 12px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 10;
}

.qr-header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qr-header-icon {
  width: 40px;
  height: 40px;
  background: #eef2ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qr-header-name {
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

.qr-header-slogan {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 1px;
}

.qr-order-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover { background: #4338ca; }
}

/* Search */
.qr-search-wrap {
  padding: 12px 16px 0;
}

.qr-search-inner {
  position: relative;
}

.qr-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #94a3b8;
  pointer-events: none;
}

.qr-search {
  width: 100%;
  height: 42px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  padding: 0 12px 0 38px;
  font-size: 14px;
  color: #1e293b;
  font-family: inherit;
  transition: border-color 0.15s;

  &::placeholder { color: #94a3b8; }
  &:focus { border-color: #6366f1; }
}

/* Category tabs */
.qr-cats {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
  flex-shrink: 0;
}

.qr-cat {
  flex-shrink: 0;
  padding: 7px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;

  &:hover { background: #f8fafc; }

  &--active {
    background: #4f46e5;
    color: #fff;
    border-color: #4f46e5;
  }
}

/* Content */
.qr-content {
  flex: 1;
  padding: 4px 16px 24px;
}

.qr-section {
  margin-bottom: 24px;
}

.qr-section-title {
  font-size: 13px;
  font-weight: 800;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid #eef2ff;
}

.qr-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Card */
.qr-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  padding: 12px 14px;
  transition: border-color 0.12s;

  &:hover { border-color: #c7d2fe; }
}

.qr-card-icon {
  width: 44px;
  height: 44px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qr-card-body {
  flex: 1;
  min-width: 0;
}

.qr-card-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
}

.qr-card-desc {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qr-card-price {
  font-size: 15px;
  font-weight: 800;
  color: #4f46e5;
  flex-shrink: 0;
}

/* Empty */
.qr-empty {
  padding: 60px 16px;
  text-align: center;
}

.qr-empty-title {
  font-size: 15px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 4px;
}

.qr-empty-sub {
  font-size: 12px;
  color: #94a3b8;
}

/* Footer */
.qr-footer {
  padding: 16px;
  text-align: center;
  font-size: 11px;
  color: #cbd5e1;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
