<template>
  <!-- Splash screen -->
  <Transition name="splash-fade">
    <div v-if="showSplash" class="splash">
      <div class="splash-rings">
        <div class="splash-ring splash-ring--1"></div>
        <div class="splash-ring splash-ring--2"></div>
        <div class="splash-logo">
          <ion-icon name="restaurant-outline" style="font-size:48px; color:#fff;"></ion-icon>
        </div>
      </div>
      <h1 class="splash-name">{{ restaurantName || 'GoAdisyon' }}</h1>
      <p class="splash-sub">Dijital Menü</p>
      <div class="splash-bar">
        <div class="splash-bar-fill" :style="{ width: splashProgress + '%' }"></div>
      </div>
    </div>
  </Transition>

  <!-- Welcome screen -->
  <Transition name="fade">
    <div v-if="!showSplash && ready" class="welcome-root">
      <div class="welcome-card">
        <div class="welcome-icon">
          <ion-icon name="restaurant-outline" style="font-size:32px; color:#4f46e5;"></ion-icon>
        </div>
        <h2 class="welcome-title">{{ restaurantName }}</h2>
        <p class="welcome-sub">Nasıl devam etmek istersiniz?</p>

        <div class="welcome-actions">
          <button class="btn-menu" @click="goMenu">
            <ion-icon name="book-outline" style="font-size:20px;"></ion-icon>
            <span>Menüye Bak</span>
          </button>

          <button v-if="table" class="btn-order" @click="goOrder">
            <ion-icon name="cart-outline" style="font-size:20px;"></ion-icon>
            <span>Masa {{ table }} · Sipariş Ver</span>
          </button>
        </div>

        <p class="welcome-footer">
          <ion-icon name="shield-checkmark-outline" style="font-size:12px; margin-right:4px;"></ion-icon>
          GoAdisyon tarafından güvence altındadır
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { setLoading } from "../../../store/app";
import { toast } from "vue3-toastify";
import router from "@/router";

const showSplash = ref(true);
const ready = ref(false);
const restaurantName = ref("");
const table = ref<string | null>(null);
const splashProgress = ref(0);

const goMenu = () => router.push({ path: "/menu" });
const goOrder = () => router.push({ path: `/tables/${table.value}` });

onMounted(async () => {
  localStorage.clear();

  // Parse URL: /restaurant/:restaurantCode/table/:tableId
  const segments = window.location.pathname.split("/");
  const restaurantCode = segments[2];
  table.value = segments[4] ?? null;

  // Progress bar animation (1.5 seconds)
  const startTime = Date.now();
  const SPLASH_DURATION = 1500;
  const tick = () => {
    const elapsed = Date.now() - startTime;
    splashProgress.value = Math.min((elapsed / SPLASH_DURATION) * 100, 100);
    if (elapsed < SPLASH_DURATION) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Fetch restaurant data
  try {
    setLoading(false); // don't use global spinner since we have splash
    const res = await axios.post("v2/restaurant-menu", { code: restaurantCode });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("restaurantCode", restaurantCode);
      localStorage.setItem("table", table.value ?? "");
      localStorage.setItem("domain", res.data.user.tenant.domain);
      localStorage.setItem("userData", JSON.stringify(res.data.user));
      restaurantName.value = res.data.user?.name ?? "Restoran";
    }
  } catch (err: any) {
    toast(err.response?.data?.message ?? "Bağlantı hatası", { type: "error" });
  }

  // Wait for splash duration then show welcome
  const elapsed = Date.now() - startTime;
  const remaining = Math.max(SPLASH_DURATION - elapsed, 0);
  setTimeout(() => {
    showSplash.value = false;
    ready.value = true;
  }, remaining);
});
</script>

<style scoped>
/* ── Splash ─────────────────────────────────── */
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #4338ca 0%, #4f46e5 50%, #6366f1 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
}

.splash-rings {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.splash-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.2);
  animation: ring-pulse 2s ease-out infinite;
}
.splash-ring--1 {
  width: 88px;
  height: 88px;
  animation-delay: 0s;
}
.splash-ring--2 {
  width: 72px;
  height: 72px;
  animation-delay: 0.4s;
}

@keyframes ring-pulse {
  0% { transform: scale(0.85); opacity: 0.7; }
  50% { transform: scale(1.08); opacity: 0.2; }
  100% { transform: scale(0.85); opacity: 0.7; }
}

.splash-logo {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.18);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.splash-name {
  font-size: clamp(22px, 6vw, 30px);
  font-weight: 800;
  color: #fff;
  margin: 0;
  text-align: center;
  letter-spacing: -0.5px;
}

.splash-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.65);
  margin: 0 0 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.splash-bar {
  width: min(160px, 60vw);
  height: 3px;
  background: rgba(255,255,255,0.2);
  border-radius: 999px;
  overflow: hidden;
}

.splash-bar-fill {
  height: 100%;
  background: rgba(255,255,255,0.9);
  border-radius: 999px;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(255,255,255,0.6);
}

/* ── Welcome ─────────────────────────────────── */
.welcome-root {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  padding: 16px;
}

.welcome-card {
  background: #fff;
  border-radius: 24px;
  border: 1px solid #e0e7ff;
  box-shadow: 0 8px 32px rgba(79,70,229,0.08);
  padding: 32px 24px 24px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome-icon {
  width: 64px;
  height: 64px;
  background: #eef2ff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.welcome-title {
  font-size: clamp(18px, 5vw, 22px);
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
}

.welcome-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px;
}

.welcome-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
}

.btn-menu {
  width: 100%;
  height: 52px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.btn-menu:hover, .btn-menu:active { background: #4338ca; }

.btn-order {
  width: 100%;
  height: 52px;
  background: #fff;
  color: #4f46e5;
  border: 2px solid #e0e7ff;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.btn-order:hover, .btn-order:active { background: #eef2ff; border-color: #a5b4fc; }

.welcome-footer {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

/* ── Transitions ─────────────────────────────── */
.splash-fade-leave-active { transition: opacity 0.4s ease; }
.splash-fade-leave-to { opacity: 0; }

.fade-enter-active { transition: opacity 0.35s ease 0.1s; }
.fade-enter-from { opacity: 0; }
</style>
