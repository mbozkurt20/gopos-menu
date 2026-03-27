<template>
  <div class="modules-header">
    <span class="modules-title">Modüller</span>
    <button class="btn-refresh" @click="clearLocalStorage(1)">
      <ion-icon name="refresh-outline"></ion-icon>
      Menü Yenile
    </button>
  </div>

  <div class="card2">
    <div class="card-items">
      <div class="card-item" v-for="item in cards" :key="item.slug">
        <router-link :to="item.slug">
          <div class="card-icon-wrap">
            <ion-icon :name="getIcon(item.slug)"></ion-icon>
          </div>
          <div class="card-title">
            {{ item.name }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import axios from "axios";
import {onMounted, ref} from "vue";

import Pusher from "pusher-js";
import {toast} from "vue3-toastify";

const cards = ref([]);

const iconMap = {
  '/masa': 'restaurant-outline',
  '/table': 'restaurant-outline',
  '/online': 'globe-outline',
  '/siparis': 'bag-handle-outline',
  '/order': 'bag-handle-outline',
  '/rapor': 'bar-chart-outline',
  '/report': 'bar-chart-outline',
  '/menu': 'fast-food-outline',
  '/kasa': 'cash-outline',
  '/cashier': 'cash-outline',
  '/stok': 'cube-outline',
  '/stock': 'cube-outline',
  '/paket': 'bicycle-outline',
  '/delivery': 'bicycle-outline',
  '/musteri': 'people-outline',
  '/customer': 'people-outline',
  '/cari': 'wallet-outline',
  '/ayar': 'settings-outline',
  '/settings': 'settings-outline',
};

const getIcon = (slug) => {
  return iconMap[slug] || 'apps-outline';
};

const clearLocalStorage = (status) => {
  localStorage.removeItem('modules');

  if (status){
    toast('Masalar Yenilendi',{
      "theme": "dark",
      "type": "success",
      "pauseOnFocusLoss": false
    })
  }
}

onMounted(() => {
  let mod = localStorage.getItem('modules')
  mod = JSON.parse(mod)

  if (!mod){
    axios({
      url: "api/v2/modules",
      method: "GET",
      params: {
        domain: localStorage.getItem("domain"),
        tenantId: JSON.parse(localStorage.getItem('userData')).tenant.id
      }
    }).then((res) => {
      cards.value = res.data.modules.map(item => ({
        name: item.module.name,
        icon: item.module.icon,
        slug: "/" + item.module.slug
      }));

      localStorage.setItem('modules', JSON.stringify(res.data.modules))
    }).catch((err) => {
      console.log({ err });
    });
  }else {
    cards.value = mod.map(item => ({
      name: item.module.name,
      icon: item.module.icon,
      slug: "/" + item.module.slug
    }));
  }

  Pusher.logToConsole = true;

  const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER
  });

  const channel = pusher.subscribe("module-channel");

  channel.bind("module-event", function (data) {
    cards.value = data.map(item => ({
      name: item.module.name,
      icon: item.module.icon,
      slug: "/" + item.module.slug
    }));

    clearLocalStorage();
  });
});
</script>

<style src="./PCard.scss" lang="scss" scoped/>
