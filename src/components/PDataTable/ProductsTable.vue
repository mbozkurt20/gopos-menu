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

const allProducts = computed(() =>
  Menu.categories.flatMap(c => c.products.filter(p => p.status == 1))
);

const hasResults = computed(() => filteredProducts.value.length > 0);

const table = localStorage.getItem("table") ?? null;
const rawUserData = localStorage.getItem("userData");
const userData = rawUserData ? JSON.parse(rawUserData) : null;

const goOrder = () => router.push({ path: `/tables/${table}` });

const selectCategory = (id) => {
  selectedCategory.value = id;
  // scroll to top of content
  const el = document.getElementById("qr-content");
  if (el) el.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">

    <!-- ── Sticky Header ───────────────────────── -->
    <header class="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
      <div class="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <ion-icon name="restaurant-outline" style="font-size:18px; color:#fff;"></ion-icon>
          </div>
          <div class="min-w-0">
            <div class="text-sm font-extrabold text-slate-900 truncate leading-tight">{{ userData?.name ?? 'Menü' }}</div>
            <div v-if="userData?.slogan" class="text-xs text-slate-400 truncate">{{ userData.slogan }}</div>
          </div>
        </div>
        <button v-if="table" @click="goOrder"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 border-0 cursor-pointer">
          <ion-icon name="cart-outline" style="font-size:16px;"></ion-icon>
          Sipariş Ver
        </button>
      </div>

      <!-- Search -->
      <div class="px-4 pb-3 max-w-3xl mx-auto">
        <div class="relative">
          <ion-icon name="search-outline" style="font-size:16px; color:#94a3b8; position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none;"></ion-icon>
          <input v-model="search" type="text" placeholder="Ürün ara..."
            class="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors" />
        </div>
      </div>
    </header>

    <!-- ── Category Tabs ───────────────────────── -->
    <div class="sticky top-[105px] z-20 bg-white border-b border-slate-100">
      <div class="flex gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar max-w-3xl mx-auto">
        <button
          @click="selectCategory('all')"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer"
          :class="selectedCategory === 'all'
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'">
          Tümü
        </button>
        <button
          v-for="cat in Menu.categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer"
          :class="selectedCategory === cat.id
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- ── Products ────────────────────────────── -->
    <div id="qr-content" class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto px-4 py-4 pb-24">
        <template v-if="hasResults">
          <div v-for="category in filteredProducts" :key="category.id" class="mb-6">
            <!-- Category Title -->
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-black text-indigo-600 uppercase tracking-widest">{{ category.name }}</span>
              <div class="flex-1 h-px bg-indigo-100"></div>
              <span class="text-xs text-slate-400 font-medium">{{ category.products.length }} ürün</span>
            </div>

            <!-- Product Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div v-for="product in category.products" :key="product.id"
                class="bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 p-3 hover:shadow-md hover:border-indigo-100 transition-all group">

                <!-- Icon / Image -->
                <div class="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img v-if="product.image" :src="product.image" :alt="product.name"
                    class="w-full h-full object-cover rounded-xl" />
                  <ion-icon v-else name="fast-food-outline" style="font-size:26px; color:#a5b4fc;"></ion-icon>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-slate-800 leading-tight mb-0.5">{{ product.name }}</div>
                  <div v-if="product.details" class="text-xs text-slate-400 line-clamp-2 leading-tight">{{ product.details }}</div>
                  <div class="mt-1.5 flex items-center justify-between">
                    <span class="text-sm font-extrabold text-indigo-600">₺{{ product.price }}</span>
                    <button v-if="table" @click="goOrder"
                      class="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-200 hover:border-indigo-600 transition-all cursor-pointer bg-transparent">
                      <ion-icon name="add-outline" style="font-size:13px;"></ion-icon>
                      Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Empty -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <ion-icon name="search-outline" style="font-size:28px; color:#cbd5e1;"></ion-icon>
          </div>
          <p class="text-sm font-bold text-slate-500">Ürün bulunamadı</p>
          <p class="text-xs text-slate-400 mt-1">Farklı bir kategori veya arama deneyin</p>
        </div>
      </div>
    </div>

    <!-- ── Floating Order Button ───────────────── -->
    <div v-if="table" class="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4">
      <button @click="goOrder"
        class="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-3.5 rounded-2xl shadow-xl shadow-indigo-200 font-bold text-sm transition-all border-0 cursor-pointer">
        <ion-icon name="cart-outline" style="font-size:20px;"></ion-icon>
        Sipariş Ver · Masa {{ table }}
        <ion-icon name="arrow-forward-outline" style="font-size:16px;"></ion-icon>
      </button>
    </div>

    <!-- Footer -->
    <div class="text-center py-4 text-xs text-slate-300 font-semibold pb-24">
      <ion-icon name="shield-checkmark-outline" style="font-size:11px; margin-right:3px;"></ion-icon>
      GoAdisyon · Dijital Menü
    </div>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
