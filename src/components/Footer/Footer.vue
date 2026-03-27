<template>
  <footer class="footer text-center py-3">
    <div class="container d-flex justify-content-center align-items-center gap-2 flex-wrap">
      <span>© {{ new Date().getFullYear() }} GPS Teknoloji Yazılım Şirketi</span>
      <span>|</span>
      <a href="https://gpsteknoloji.com" target="_blank" class="text-decoration-none fw-semibold" style="color: #6366f1">
        www.gpsteknoloji.com
      </a>
      <span>|</span>
      <span>v2.24 Beta</span>
    </div>
  </footer>
</template>


<style src="./Footer.scss" lang="scss" />

<script>
import PCurrency from "../Currency/Currency.vue";

export default {
  components: {
    PCurrency,
  },
  data() {
    return {
      userData: null,
      license: null,
      kalangun: null,
      showModal: false, // Modal kontrolü
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
  mounted() {
    const userData = localStorage.getItem("userData");
    if (userData) {
      let user = JSON.parse(userData);
      this.license = user["license"];

      const currentDate = new Date();
      const endDate = new Date(user.end_date);
      const diffTime = Math.abs(endDate - currentDate);
      const kalanGun = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.kalangun = kalanGun;
      this.userData = user;
    }
  },
};
</script>

<style scoped>
/* Basit modal stilleri */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 50vw;
  width: 90%;
}
</style>
