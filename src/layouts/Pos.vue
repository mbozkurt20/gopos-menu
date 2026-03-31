<script setup lang="ts">
import PHeaderSmall from "../components/Header/PHeaderSmall/PHeaderSmall.vue";
import PBasketItems from "../components/PBasketItems/PBasketItems.vue";
import {
  fetchMenu,
  fetchTable,
  fetchPackages,
  fetchFastSell,
  tableDetailStore,
  getCartTotal,
} from "../store/table-detail";
import { useRoute } from "vue-router";
import { onMounted, computed, ref } from "vue";
import formatPrice from "../utils/formatPrice";

type IPosLayoutProps = {
  isShowRightbar?: boolean;
  isShowMoveButton?: boolean;
  navItems: any;
  type: string;
};

const props = withDefaults(defineProps<IPosLayoutProps>(), {
  isShowRightbar: true,
  isShowMoveButton: false,
  navItems: [],
});

const route = useRoute();
const showMobileCart = ref(false);

const productItems = computed(() => tableDetailStore.cart);

const cartCount = computed(() =>
  tableDetailStore.cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
);
const cartTotal = computed(() => getCartTotal());

const handleCatClick = (index: number, item: any) => {
  tableDetailStore.selectedIndex = index;
  tableDetailStore.products = item.products;
  tableDetailStore.showParent = true;
  tableDetailStore.showSubCategory = false;
  tableDetailStore.selectedCategory = [];
  tableDetailStore.subProducts = null;
  tableDetailStore.subCategory = [];
  if (item.children_recursive?.length === 0) {
    tableDetailStore.showSubCategory = false;
    tableDetailStore.showParent = true;
  } else {
    tableDetailStore.subCategory = item.children_recursive;
  }
};

onMounted(() => {
  fetchMenu();
  switch (props.type) {
    case "order":
      if (route.params.id) {
        fetchTable(route.params.id);
        break;
      }
    case "fast-sell":
      fetchFastSell(route.params.id);
      break;
    case "packages":
      fetchPackages(route.params.id ?? null);
      break;
  }
});
</script>

<template>
  <PHeaderSmall />

  <!-- ── Main POS layout ── -->
  <div class="pos-root">

    <!-- ── Desktop: Category Sidebar (left, indigo) ── -->
    <div class="cat-sidebar">
      <h1 class="cat-sidebar-title">MENÜLER</h1>
      <button
        v-for="(item, index) in tableDetailStore.categories"
        :key="item.id"
        @click="handleCatClick(index, item)"
        class="cat-item"
        :class="tableDetailStore.selectedIndex === index ? 'cat-item--active' : ''"
      >
        {{ item.name }}
      </button>
    </div>

    <!-- ── Desktop: Cart panel (fixed width) ── -->
    <div class="cart-desktop">
      <!-- Action bar for selected cart items -->
      <div v-if="props.navItems.length" class="action-bar">
        <button
          v-for="item in props.navItems"
          :key="item.label"
          @click="item.onClick"
          class="action-btn"
          :class="item.label === 'Kaldır' ? 'action-btn--danger' : 'action-btn--default'"
        >
          <ion-icon :name="item.icon" style="font-size:14px;"></ion-icon>
          {{ item.label }}
        </button>
      </div>
      <PBasketItems
        :title="tableDetailStore.table.name"
        :product-items="productItems"
        :type="props.type"
      />
    </div>

    <!-- ── Product area ── -->
    <div class="product-area">
      <!-- Mobile: horizontal category tabs -->
      <div class="mobile-cat-tabs">
        <button
          v-for="(item, index) in tableDetailStore.categories"
          :key="item.id"
          @click="handleCatClick(index, item)"
          class="mobile-cat-tab"
          :class="tableDetailStore.selectedIndex === index ? 'mobile-cat-tab--active' : ''"
        >
          {{ item.name }}
        </button>
      </div>

      <!-- Slot: POrder -->
      <div class="product-slot">
        <slot />
      </div>
    </div>

  </div>

  <!-- ── Mobile: Floating cart FAB ── -->
  <div class="mobile-fab">
    <button @click="showMobileCart = true" class="mobile-fab-btn">
      <ion-icon name="cart-outline" style="font-size:20px;"></ion-icon>
      <span v-if="cartCount > 0">Sepet ({{ cartCount }}) · {{ formatPrice(cartTotal) }}</span>
      <span v-else>Sepet</span>
      <ion-icon name="chevron-up-outline" style="font-size:15px; opacity:0.8;"></ion-icon>
    </button>
  </div>

  <!-- ── Mobile: Drawer overlay ── -->
  <Transition name="fade-overlay">
    <div v-if="showMobileCart" class="drawer-overlay" @click="showMobileCart = false"></div>
  </Transition>

  <!-- ── Mobile: Cart drawer ── -->
  <Transition name="slide-up">
    <div v-if="showMobileCart" class="cart-drawer">
      <!-- Drag handle -->
      <div class="drawer-handle-bar"></div>

      <!-- Drawer header -->
      <div class="drawer-header">
        <div style="display:flex; align-items:center; gap:8px; min-width:0;">
          <span class="drawer-title">{{ tableDetailStore.table.name || 'Sepet' }}</span>
          <!-- Action buttons inline -->
          <div v-if="props.navItems.length" style="display:flex; gap:4px;">
            <button
              v-for="item in props.navItems"
              :key="item.label"
              @click="item.onClick"
              class="action-btn action-btn--sm"
              :class="item.label === 'Kaldır' ? 'action-btn--danger' : 'action-btn--default'"
            >
              <ion-icon :name="item.icon" style="font-size:12px;"></ion-icon>
              {{ item.label }}
            </button>
          </div>
        </div>
        <button @click="showMobileCart = false" class="drawer-close-btn">
          <ion-icon name="close-outline" style="font-size:22px;"></ion-icon>
        </button>
      </div>

      <!-- Cart content -->
      <div style="flex:1; overflow:hidden; display:flex; flex-direction:column;">
        <PBasketItems
          :title="tableDetailStore.table.name"
          :product-items="productItems"
          :type="props.type"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Root layout ── */
.pos-root {
  display: flex;
  height: calc(100dvh - 54px);
  overflow: hidden;
  background: #f1f5f9;
}

/* ── Desktop Category Sidebar ── */
.cat-sidebar {
  width: 140px;
  flex-shrink: 0;
  background: #4f46e5;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  gap: 2px;
  overflow-y: auto;
  scrollbar-width: none;
}
.cat-sidebar::-webkit-scrollbar { display: none; }

.cat-sidebar-title {
  color: rgba(255,255,255,0.55);
  font-size: 10px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0 0 8px;
  padding: 0 12px;
}

.cat-item {
  margin: 0 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.85);
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  font-family: inherit;
  line-height: 1.3;
}
.cat-item:hover { background: rgba(255,255,255,0.12); }
.cat-item--active { background: rgba(255,255,255,0.22); color: #fff; font-weight: 700; box-shadow: inset 0 0 0 1.5px rgba(255,255,255,0.35); }

/* ── Desktop Cart ── */
.cart-desktop {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  overflow: hidden;
}

/* ── Action bar ── */
.action-bar {
  display: flex;
  gap: 4px;
  padding: 8px 10px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 10px;
  border: none;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s;
}
.action-btn--sm { padding: 4px 8px; font-size: 10px; }
.action-btn--default { background: #eef2ff; color: #4f46e5; }
.action-btn--default:hover { background: #e0e7ff; }
.action-btn--danger { background: #fef2f2; color: #ef4444; }
.action-btn--danger:hover { background: #fee2e2; }

/* ── Product area ── */
.product-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
}

/* ── Mobile cat tabs ── */
.mobile-cat-tabs {
  display: none;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 8px;
  flex-shrink: 0;
}
.mobile-cat-tabs::-webkit-scrollbar { display: none; }

.mobile-cat-tab {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s;
  font-family: inherit;
}
.mobile-cat-tab:hover { border-color: #a5b4fc; color: #4f46e5; }
.mobile-cat-tab--active { background: #4f46e5 !important; color: #fff !important; border-color: #4f46e5 !important; }

/* ── Product slot ── */
.product-slot {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Mobile FAB ── */
.mobile-fab {
  display: none;
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  justify-content: center;
  z-index: 40;
  padding: 0 16px;
}
.mobile-fab-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #4f46e5;
  color: #fff;
  padding: 14px 24px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 8px 24px rgba(79,70,229,0.4);
  transition: all 0.15s;
}
.mobile-fab-btn:hover { background: #4338ca; }
.mobile-fab-btn:active { transform: scale(0.97); }

/* ── Drawer overlay ── */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 50;
}

/* ── Cart drawer ── */
.cart-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 51;
  background: #fff;
  border-radius: 24px 24px 0 0;
  max-height: 88dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 -8px 32px rgba(0,0,0,0.12);
}

.drawer-handle-bar {
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 999px;
  margin: 10px auto 0;
  flex-shrink: 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
  gap: 8px;
}

.drawer-title {
  font-size: 14px;
  font-weight: 700;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.drawer-close-btn {
  background: #f1f5f9;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
  transition: background 0.12s;
}
.drawer-close-btn:hover { background: #e2e8f0; }

/* ── Transitions ── */
.fade-overlay-enter-active { transition: opacity 0.2s; }
.fade-overlay-leave-active { transition: opacity 0.18s; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

.slide-up-enter-active { transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-up-leave-active { transition: transform 0.22s ease-in; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

/* ── Mobile responsive (< 1024px) ── */
@media (max-width: 1023px) {
  .cat-sidebar { display: none; }
  .cart-desktop { display: none; }
  .mobile-cat-tabs { display: flex; }
  .mobile-fab { display: flex; }
  .product-area { padding: 10px 10px 80px; }
}
</style>
