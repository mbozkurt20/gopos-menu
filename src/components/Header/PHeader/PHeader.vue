<template>
  <header class="header py-2">
    <div class="container header-row">
      <div class="header-left d-flex">
        <div class="header-brand">
          <span class="brand-logo">Go</span><span class="brand-name">Adisyon</span>
        </div>
        <div class="header-divider"></div>
        <h2 class="header-username">{{userData ? userData.name : ''}}</h2>
      </div>
      <div class="header-right d-flex">
        <PHeaderState profileState="false"/>
        <button class="header-exit" @click="logout" title="Çıkış Yap">
          <ion-icon name="log-out-outline"></ion-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import router from "../../../router/index.js";
import PHeaderNav from "../PHeaderNav/PHeaderNav.vue"
import PHeaderState from "../PHeaderState/PHeaderState.vue"

export default {
  components: {
    PHeaderState,
    PHeaderNav
  },
  data() {
    return {
      license: null,
      userData: JSON.parse(localStorage.getItem('userData'))
    };
  },

  mounted() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      let user = JSON.parse(userData);
      this.license = user['license'];
    }
  },

  methods: {
    async logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('domain');
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      location.reload();
      await router.push({name: 'Login'})
    }
  }
};
</script>

<style src="./PHeader.scss" lang="scss"/>
