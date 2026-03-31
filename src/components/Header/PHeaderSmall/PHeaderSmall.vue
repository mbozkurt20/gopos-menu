<template>
  <header style="background:#4f46e5; box-shadow:0 1px 4px rgba(79,70,229,0.2);">
    <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; gap:16px;">

      <!-- Left: Back + Logo -->
      <div style="display:flex; align-items:center; gap:12px;">
        <button
          v-if="user && user.type != 3"
          @click="backButton"
          style="width:36px; height:36px; background:#ec4899; border:none; border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:background 0.15s;"
          onmouseover="this.style.background='#db2777'"
          onmouseout="this.style.background='#ec4899'"
        >
          <ion-icon name="arrow-back-outline" style="font-size:20px; color:#fff;"></ion-icon>
        </button>
        <router-link to="/tables" style="display:flex; align-items:center; gap:8px; text-decoration:none;">
          <div style="width:28px; height:28px; background:rgba(255,255,255,0.2); border-radius:8px; display:flex; align-items:center; justify-content:center;">
            <ion-icon name="restaurant-outline" style="font-size:14px; color:#fff;"></ion-icon>
          </div>
          <span style="color:#fff; font-weight:800; font-size:15px; letter-spacing:-0.3px;">
            {{ userData ? userData.name : '' }}
          </span>
        </router-link>
      </div>

      <!-- Right: State -->
      <div style="display:flex; align-items:center; gap:12px;">
        <PHeaderState profileState="false" />
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import PHeaderState from "../PHeaderState/PHeaderState.vue"
import { useRouter } from 'vue-router';

const router = useRouter();
const user = localStorage.user ? JSON.parse(localStorage.getItem('user')) : null;
const userData = JSON.parse(localStorage.getItem('userData'));
const backButton = () => { router.back(); };
</script>
