<template>
    <div class="app-loading-overlay">
        <div class="app-loading-box">
            <div class="spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-icon">
                    <ion-icon name="restaurant-outline"></ion-icon>
                </div>
            </div>
            <p class="spinner-label">Yükleniyor...</p>
        </div>
    </div>
</template>

<style scoped>
.app-loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.app-loading-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
}

.spinner {
    position: relative;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid #e0e7ff;
    border-top-color: #4f46e5;
    animation: spin 0.75s linear infinite;
}

.spinner-icon {
    font-size: 24px;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner-label {
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
    margin: 0;
    letter-spacing: 0.3px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
