<template>
  <PHeader></PHeader>
  <div class="container home-container">
    <div class="home-welcome">
      <div class="welcome-text">
        <p class="welcome-sub">Hoş geldiniz</p>
        <h1 class="welcome-title">Ne yapmak istersiniz?</h1>
      </div>
      <PDate />
    </div>
    <PCard />
    <div class="home-notifications">
      <PNotifications />
    </div>
  </div>
  <PFooter></PFooter>
</template>

<script setup lang="ts">
import PDate from "../components/Date/Date.vue";
import PNotifications from "../components/PNotifications/PNotifications.vue";
import PCard from "../components/PCard/PCard.vue";
import PHeader from "../components/Header/PHeader/PHeader.vue";
import PFooter from "../components/Footer/Footer.vue";
import { tableDetailStore } from "../store/table-detail";

tableDetailStore.isDivide = false;
tableDetailStore.willMoveTableId = null;
tableDetailStore.selectedCartItems = [];
tableDetailStore.selectedIndex = 0;
</script>

<style scoped lang="scss">
.home-container {
  padding-top: 0.5rem;

  @media (max-width: 1024px) {
    padding: 0 24px;
  }
}

.home-welcome {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 2rem;

  .welcome-sub {
    font-size: 0.85rem;
    color: #94a3b8;
    font-weight: 500;
    margin: 0 0 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .welcome-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    .welcome-title {
      font-size: 1.3rem;
    }
  }
}

.home-notifications {
  margin-top: 2rem;
}
</style>
