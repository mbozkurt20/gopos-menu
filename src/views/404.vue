<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <div class="not-found-icon">
        <ion-icon name="alert-circle-outline"></ion-icon>
      </div>
      <h1 class="not-found-code">404</h1>
      <p class="not-found-title">Sayfa Bulunamadı</p>
      <p class="not-found-desc">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <router-link to="/" class="not-found-btn">
        <ion-icon name="home-outline"></ion-icon>
        Ana Sayfaya Dön
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
}

.not-found-card {
  text-align: center;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 3rem 4rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  max-width: 480px;
  width: 100%;
}

.not-found-icon {
  ion-icon {
    font-size: 64px;
    color: #6366f1;
  }
}

.not-found-code {
  font-size: 6rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin: 0.5rem 0;
  letter-spacing: -2px;
}

.not-found-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 0.5rem;
}

.not-found-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0 0 2rem;
}

.not-found-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #6366f1;
  color: #fff;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s;

  ion-icon {
    font-size: 18px;
  }

  &:hover {
    background: #4f46e5;
    color: #fff;
  }
}
</style>
