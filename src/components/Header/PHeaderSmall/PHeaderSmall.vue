<template>
  <header style="background:#4f46e5; box-shadow:0 1px 4px rgba(79,70,229,0.2); flex-shrink:0;">
    <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; gap:12px;">

      <!-- Left: Back + Logo -->
      <div style="display:flex; align-items:center; gap:10px;">
        <button
          v-if="user && user.type != 3"
          @click="backButton"
          style="width:34px; height:34px; background:#ec4899; border:none; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:background 0.15s;"
          onmouseover="this.style.background='#db2777'"
          onmouseout="this.style.background='#ec4899'"
        >
          <ion-icon name="arrow-back-outline" style="font-size:18px; color:#fff;"></ion-icon>
        </button>
        <router-link to="/tables" style="display:flex; align-items:center; gap:8px; text-decoration:none;">
          <div style="width:26px; height:26px; background:rgba(255,255,255,0.2); border-radius:8px; display:flex; align-items:center; justify-content:center;">
            <ion-icon name="restaurant-outline" style="font-size:13px; color:#fff;"></ion-icon>
          </div>
          <span style="color:#fff; font-weight:800; font-size:14px; letter-spacing:-0.3px;">
            {{ userData ? userData.name : 'GoAdisyon' }}
          </span>
        </router-link>
      </div>

      <!-- Right: Context button + State -->
      <div style="display:flex; align-items:center; gap:10px;">

        <!-- On /tables/:id → show Menüye Git -->
        <button
          v-if="isOrderPage"
          @click="goMenu"
          style="display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.3); color:#fff; padding:6px 12px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.15s; letter-spacing:0.2px;"
          onmouseover="this.style.background='rgba(255,255,255,0.25)'"
          onmouseout="this.style.background='rgba(255,255,255,0.15)'"
        >
          <ion-icon name="book-outline" style="font-size:14px;"></ion-icon>
          Menüye Git
        </button>

        <!-- On /menu → show Sipariş Ver -->
        <button
          v-if="isMenuPage && table"
          @click="goOrder"
          style="display:flex; align-items:center; gap:6px; background:#fff; border:none; color:#4f46e5; padding:6px 12px; border-radius:10px; font-size:12px; font-weight:700; cursor:pointer; transition:all 0.15s;"
          onmouseover="this.style.background='#e0e7ff'"
          onmouseout="this.style.background='#fff'"
        >
          <ion-icon name="cart-outline" style="font-size:14px;"></ion-icon>
          Sipariş Ver
        </button>

        <PHeaderState profileState="false" />
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import PHeaderState from "../PHeaderState/PHeaderState.vue"
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const user = localStorage.user ? JSON.parse(localStorage.getItem('user')) : null;
const userData = JSON.parse(localStorage.getItem('userData'));
const table = localStorage.getItem('table') || null;

const isOrderPage = computed(() => route.path.startsWith('/tables/') && route.params.id);
const isMenuPage = computed(() => route.path === '/menu');

const backButton = () => { router.back(); };
const goMenu = () => { router.push('/menu'); };
const goOrder = () => { if (table) router.push(`/tables/${table}`); };
</script>
