<template>
  <PHeaderSmall />
  <div style="display:flex; height:calc(100dvh - 54px); overflow:hidden; background:#f1f5f9;">

    <!-- ── SOL: Adisyon Paneli ── -->
    <div class="hidden lg:flex flex-col bg-white border-r border-slate-200 overflow-hidden" style="width:260px; flex-shrink:0;">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-slate-100 bg-indigo-600 flex-shrink-0">
        <div class="text-white text-xs font-bold uppercase tracking-wide opacity-70">Adisyon</div>
        <div class="text-white text-2xl font-extrabold leading-tight">
          {{ getActiveTables }} <span class="text-base font-medium opacity-60">Açık</span>
        </div>
      </div>

      <!-- Active table list -->
      <div class="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100">
        <div
          v-for="item in getFilteredProducts"
          :key="item.id"
          @click="$router.push(`/tables/${item.id}`)"
          class="flex items-center justify-between px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors"
        >
          <div class="min-w-0">
            <div class="text-xs text-slate-400 font-medium">{{ item.status === 3 ? 'AÇIK' : 'AKTİF' }}</div>
            <div class="text-sm font-bold text-slate-800 truncate">{{ item.name }}</div>
            <div class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <ion-icon name="time-outline" style="font-size:11px;"></ion-icon>
              {{ calculateTime(item.updated_at) }}
            </div>
          </div>
          <div class="text-sm font-extrabold text-indigo-600 flex-shrink-0 ml-2">{{ formatPrice(item.amount) }}</div>
        </div>
        <div v-if="!getFilteredProducts.length" class="flex flex-col items-center justify-center py-10 text-slate-300">
          <ion-icon name="restaurant-outline" style="font-size:32px;"></ion-icon>
          <p class="text-xs mt-2">Açık masa yok</p>
        </div>
      </div>

      <!-- Footer total -->
      <div class="px-4 py-3 border-t border-slate-100 bg-slate-50 flex-shrink-0">
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-500 font-medium">TOPLAM</span>
          <span class="text-base font-extrabold text-indigo-600">{{ formatPrice(getTotalRevenue) }}</span>
        </div>
      </div>
    </div>

    <!-- ── ORTA: Masa Grid ── -->
    <div class="flex-1 flex flex-col overflow-hidden bg-slate-50">

      <!-- Stats bar -->
      <div class="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-slate-100 flex-shrink-0 overflow-x-auto no-scrollbar">
        <div class="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 flex-shrink-0">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span class="text-xs font-bold text-emerald-700">{{ getOccupiedCount }} Dolu</span>
        </div>
        <div class="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-3 py-1 flex-shrink-0">
          <span class="w-2 h-2 rounded-full bg-slate-400"></span>
          <span class="text-xs font-bold text-slate-600">{{ getTotalTables - getOccupiedCount }} Boş</span>
        </div>
        <div class="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 flex-shrink-0">
          <ion-icon name="cash-outline" style="font-size:12px; color:#4f46e5;"></ion-icon>
          <span class="text-xs font-bold text-indigo-700">{{ formatPrice(getTotalRevenue) }}</span>
        </div>

        <div class="ml-auto flex items-center gap-3 flex-shrink-0">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-emerald-500"></span>
            <span class="text-[10px] text-slate-500">Açık</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-indigo-500"></span>
            <span class="text-[10px] text-slate-500">Aktif</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded bg-amber-400"></span>
            <span class="text-[10px] text-slate-500">Rezerve</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded border-2 border-dashed border-slate-300"></span>
            <span class="text-[10px] text-slate-500">Boş</span>
          </div>
        </div>

        <div class="text-xs font-semibold text-slate-400 ml-2 flex-shrink-0">{{ currentAreaName }}</div>
      </div>

      <!-- Table cards grid -->
      <div class="flex-1 overflow-y-auto no-scrollbar p-4">
        <div class="grid gap-3" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
          <PBasketProductItem
            v-for="item in products"
            :key="item.id"
            :table="item"
          />
        </div>
      </div>
    </div>

    <!-- ── SAĞ: Area Sidebar ── -->
    <div class="hidden lg:flex bg-indigo-600 flex-col py-3 gap-1 overflow-y-auto no-scrollbar" style="width:140px; flex-shrink:0; border-radius:0 0 0 0;">
      <h1 class="text-white/60 text-xs font-bold text-center uppercase tracking-widest mb-2 px-3">MASALAR</h1>
      <button
        v-for="(area, index) in areasWithCounts"
        :key="area.id"
        @click="handleClickSidebarItem({ index })"
        class="mx-2 text-sm font-semibold py-2.5 px-3 rounded-xl border-0 transition-all flex items-center justify-between gap-1"
        :class="tableDetailStore.tableSelectedIndex === index
          ? 'bg-white text-indigo-700 shadow-sm'
          : 'bg-transparent text-white hover:bg-white/10'"
      >
        <span class="truncate text-left text-xs">{{ area.name }}</span>
        <span
          v-if="area.occupiedCount > 0"
          class="flex-shrink-0 text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center"
          :class="tableDetailStore.tableSelectedIndex === index ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white'"
        >{{ area.occupiedCount }}</span>
      </button>
    </div>

  </div>

  <!-- Mobile: area tabs -->
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar z-30">
    <button
      v-for="(area, index) in areasWithCounts"
      :key="area.id"
      @click="handleClickSidebarItem({ index })"
      class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
      :class="tableDetailStore.tableSelectedIndex === index
        ? 'bg-indigo-600 text-white border-indigo-600'
        : 'bg-white text-slate-500 border-slate-200'"
    >
      {{ area.name }}
      <span v-if="area.occupiedCount > 0" class="ml-1 text-[10px]">({{ area.occupiedCount }})</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import PHeaderSmall from "../../components/Header/PHeaderSmall/PHeaderSmall.vue";
import PBasketProductItem from "../../components/PBasketProducts/PBasketProductItem/PBasketProductItem.vue";
import { computed, onMounted, watch, ref, onUnmounted } from "vue";
import axios from "axios";
import Pusher from "pusher-js";
import { resetTableDetail, tableDetailStore } from "../../store/table-detail";
import { setLoading } from "../../store/app";
import formatPrice from "../../utils/formatPrice";
import calculateTime from "../../utils/calculateTime";

const changeTableData = ref([]);
const userData = localStorage.getItem("userData");
let user = JSON.parse(userData);

const areas = ref([]);
const products = ref([]);
const leftProducts = ref([]);

const getActiveTables = computed(() => {
  let active = 0;
  for (const area of areas.value)
    for (const table of area.tables)
      if (table.status === 3 || table.status === 1) active++;
  return active;
});

const getOccupiedCount = computed(() => {
  let count = 0;
  for (const area of areas.value)
    for (const table of area.tables)
      if (table.status === 3) count++;
  return count;
});

const getTotalTables = computed(() => {
  let count = 0;
  for (const area of areas.value) count += area.tables.length;
  return count;
});

const getTotalRevenue = computed(() => {
  let total = 0;
  for (const area of areas.value)
    for (const table of area.tables)
      if (table.status === 3 && table.amount) total += Number(table.amount);
  return total;
});

const currentAreaName = computed(() => areas.value[tableDetailStore.tableSelectedIndex]?.name ?? '');

const areasWithCounts = computed(() =>
  areas.value.map((area) => ({
    ...area,
    occupiedCount: area.tables.filter((t) => t.status === 3).length,
  }))
);

const getFilteredProducts = computed(() =>
  leftProducts.value.filter((e) => e.status === 1 || e.status === 3)
);

const fetchData = (loading = false) => {
  if (loading) setLoading(true);
  axios({
    method: "GET",
    url: "/api/v2/area/list",
    params: { domain: localStorage.getItem("domain") },
  })
    .then((response) => {
      if (response.data.success === true) {
        areas.value = response.data.areas;
        const data = [];
        for (const area of response.data.areas)
          for (const table of area.tables) data.push(table);
        products.value = response.data.areas[0].tables;
        leftProducts.value = data;
        resetTableDetail();
      }
      if (loading) setLoading(false);
    })
    .catch(() => setLoading(false));
};

const handleClickSidebarItem = ({ index }) => {
  tableDetailStore.tableSelectedIndex = index;
  products.value = areas.value[index].tables;
};

const pusher = new Pusher("e617d5f462a9a069d6f5", { cluster: "mt1" });

onUnmounted(() => {
  pusher.unsubscribe("sinerPosSocket_" + user["code"]);
  pusher.disconnect();
});

onMounted(() => {
  fetchData(true);
  const channel = pusher.subscribe("sinerPosSocket_" + user["code"]);
  channel.bind("table", (data) => { changeTableData.value.push(data); });
});

watch(() => changeTableData.value.length, () => { fetchData(); });
</script>
