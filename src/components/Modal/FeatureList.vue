<script setup lang="ts">
import Modal from "./index.vue";
import { modalStore } from "../../store/modal";
import { tableDetailStore, addToCartProduct, setAddedProductFeatures } from "../../store/table-detail";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const packageRoute = ref(route.fullPath.split("/")[1] === "packages");
const fastSell     = ref(route.fullPath.split("/")[1] === "fast-sell");
const portion      = ref("1");
const quantity     = ref(1);
const note         = ref("");
const showErrors   = ref(false);

// { featureId: optionId (single) | optionId[] (multiple) }
const selectedOptions = ref<Record<number, number | number[]>>({});

const portions = [
  { value: "0.5", label: "Yarım",        sub: "1/2"  },
  { value: "1",   label: "1 Porsiyon",   sub: "×1"   },
  { value: "1.5", label: "1.5 Porsiyon", sub: "×1.5" },
];

const handleClose = () => {
  tableDetailStore.selectedProductOnFeature = null;
  modalStore.featureList = false;
  portion.value = "1";
  quantity.value = 1;
  note.value = "";
  showErrors.value = false;
  selectedOptions.value = {};
  setAddedProductFeatures([]);
};

const toggleOption = (feature: any, option: any) => {
  const isSingle = feature.type === 1;
  if (isSingle) {
    selectedOptions.value[feature.id] =
      selectedOptions.value[feature.id] === option.id ? (null as any) : option.id;
  } else {
    if (!Array.isArray(selectedOptions.value[feature.id]))
      selectedOptions.value[feature.id] = [];
    const arr = selectedOptions.value[feature.id] as number[];
    const idx = arr.indexOf(option.id);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(option.id);
  }
};

const isSelected = (feature: any, option: any): boolean => {
  const sel = selectedOptions.value[feature.id];
  if (!sel && sel !== 0) return false;
  if (feature.type === 1) return sel === option.id;
  return Array.isArray(sel) && sel.includes(option.id);
};

const requiredMissing = computed<number[]>(() => {
  const missing: number[] = [];
  for (const f of (tableDetailStore.addedProductFeatures ?? [])) {
    if ((f.options ?? []).length === 0) continue;
    if (f.type === 1) {
      const sel = selectedOptions.value[f.id];
      if (!sel && sel !== 0) missing.push(f.id);
    }
  }
  return missing;
});

const extraPrice = computed(() => {
  let extra = 0;
  for (const feature of (tableDetailStore.addedProductFeatures ?? [])) {
    for (const option of (feature.options ?? [])) {
      if (isSelected(feature, option)) extra += parseFloat(option.price || 0);
    }
  }
  return extra;
});

const hasFeatures = computed(() =>
  (tableDetailStore.addedProductFeatures ?? []).some(f => (f.options ?? []).length > 0)
);

const onFeatureSelect = () => {
  if (requiredMissing.value.length > 0) {
    showErrors.value = true;
    return;
  }

  const product = tableDetailStore.selectedProductOnFeature;
  let basePrice = parseFloat(product.price || 0);
  if (packageRoute.value && product.package_price) basePrice = parseFloat(product.package_price);
  else if (fastSell.value  && product.fast_price)  basePrice = parseFloat(product.fast_price);

  let firstOptionId: number | null = null;
  for (const val of Object.values(selectedOptions.value)) {
    if (Array.isArray(val) && val.length) { firstOptionId = val[0]; break; }
    else if (val) { firstOptionId = val as number; break; }
  }

  const sendProduct = {
    ...product,
    price: basePrice + extraPrice.value,
    updated_at: new Date().toString(),
    portion: portion.value,
    selectedFeatureId: firstOptionId,
    selectedOptions: { ...selectedOptions.value },
    quantity: quantity.value ?? 1,
    exclude_note: note.value.trim() || product.exclude_note || '',
  };

  quantity.value = 1;
  const audio = new Audio("/dot.mp3");
  audio.play();
  addToCartProduct(sendProduct);
  handleClose();
};

const setQuantity = (type: string) => {
  if (type === "+") quantity.value++;
  else if (type === "-" && quantity.value > 1) quantity.value--;
};

const isRequiredMissing = (featureId: number) =>
  showErrors.value && requiredMissing.value.includes(featureId);
</script>

<template>
  <Modal
    :is-opened="modalStore.featureList"
    :handle-close="handleClose"
    :width="'900px'"
    :title="tableDetailStore.selectedProductOnFeature?.name"
  >
    <div style="display:flex; flex-direction:column; gap:14px; padding:0 12px 8px;">

      <!-- Main row -->
      <div style="display:flex; gap:14px; align-items:stretch;">

        <!-- Left: Quantity + Portion -->
        <div style="display:flex; flex-direction:column; gap:12px; min-width:120px;">

          <!-- Quantity -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:10px; padding:18px 14px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:18px;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Adet</span>
            <div style="font-size:36px; font-weight:900; color:#0f172a; line-height:1;">{{ quantity }}</div>
            <div style="display:flex; gap:8px; width:100%;">
              <button @click="setQuantity('-')"
                style="flex:1; height:38px; background:#fef2f2; border:1.5px solid #fecaca; color:#ef4444; border-radius:12px; font-size:20px; display:flex; align-items:center; justify-content:center; cursor:pointer;"
                onmouseover="this.style.background='#fee2e2';" onmouseout="this.style.background='#fef2f2';">
                <ion-icon name="remove-outline"></ion-icon>
              </button>
              <button @click="setQuantity('+')"
                style="flex:1; height:38px; background:#f0fdf4; border:1.5px solid #bbf7d0; color:#16a34a; border-radius:12px; font-size:20px; display:flex; align-items:center; justify-content:center; cursor:pointer;"
                onmouseover="this.style.background='#dcfce7';" onmouseout="this.style.background='#f0fdf4';">
                <ion-icon name="add-outline"></ion-icon>
              </button>
            </div>
          </div>

          <!-- Portions -->
          <div style="padding:14px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:18px; display:flex; flex-direction:column; gap:8px;">
            <span style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Porsiyon</span>
            <div v-for="p in portions" :key="p.value">
              <button @click="portion = p.value"
                :style="portion === p.value
                  ? 'background:#4f46e5; border-color:#4338ca; color:#fff; box-shadow:0 4px 12px rgba(79,70,229,0.25);'
                  : 'background:#fff; border-color:#e2e8f0; color:#374151;'"
                style="width:100%; padding:8px 6px; border-radius:12px; border:1.5px solid; cursor:pointer; transition:all 0.15s; font-weight:700; font-size:12px; display:flex; align-items:center; justify-content:space-between; font-family:inherit;">
                <span>{{ p.label }}</span>
                <span :style="portion === p.value ? 'color:#c7d2fe' : 'color:#6366f1'" style="font-size:10px; font-weight:800;">{{ p.sub }}</span>
              </button>
            </div>
          </div>

        </div>

        <!-- Right: Feature groups -->
        <div style="flex:1; display:flex; flex-direction:column; gap:0; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:18px; overflow-y:auto; max-height:480px;">

          <template v-if="hasFeatures">
            <div
              v-for="feature in tableDetailStore.addedProductFeatures"
              :key="feature.id"
              v-show="(feature.options ?? []).length > 0"
              :style="isRequiredMissing(feature.id)
                ? 'border:2px solid #fca5a5; border-radius:14px; margin:10px; background:#fff;'
                : 'border-bottom:1px solid #e2e8f0; padding:14px 16px;'"
            >
              <div :style="isRequiredMissing(feature.id) ? 'padding:14px;' : ''">
                <!-- Group header -->
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
                  <p style="font-size:12px; font-weight:700; color:#475569; margin:0;">{{ feature.name }}</p>
                  <span v-if="feature.type === 1"
                    style="font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; background:#fef3c7; color:#92400e;">
                    Zorunlu
                  </span>
                  <span v-else
                    style="font-size:10px; font-weight:700; padding:2px 8px; border-radius:20px; background:#f0fdf4; color:#166534;">
                    Opsiyonel
                  </span>
                  <span v-if="isRequiredMissing(feature.id)"
                    style="font-size:10px; font-weight:700; color:#dc2626; display:flex; align-items:center; gap:3px;">
                    <ion-icon name="alert-circle-outline" style="font-size:12px;"></ion-icon>
                    Seçim yapınız
                  </span>
                </div>

                <!-- Option buttons -->
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                  <button
                    v-for="option in feature.options"
                    :key="option.id"
                    @click="toggleOption(feature, option)"
                    :style="isSelected(feature, option)
                      ? 'background:#4f46e5; border-color:#4338ca; color:#fff; box-shadow:0 4px 12px rgba(79,70,229,0.28); transform:scale(1.03);'
                      : 'background:#fff; border-color:#e2e8f0; color:#374151;'"
                    style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-width:88px; height:58px; padding:0 12px; border-radius:14px; border:1.5px solid; cursor:pointer; transition:all 0.15s; font-weight:700; font-size:13px; gap:2px; font-family:inherit;"
                  >
                    <span>{{ option.name }}</span>
                    <span
                      v-if="parseFloat(option.price) > 0"
                      :style="isSelected(feature, option) ? 'color:#c7d2fe;' : 'color:#6366f1;'"
                      style="font-size:11px; font-weight:800;">
                      +₺{{ parseFloat(option.price).toFixed(2) }}
                    </span>
                    <span v-else
                      :style="isSelected(feature, option) ? 'color:#c7d2fe;' : 'color:#94a3b8;'"
                      style="font-size:10px; font-weight:600;">Ücretsiz</span>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <div v-else style="padding:32px 24px; text-align:center; color:#94a3b8; font-size:13px;">
            Bu ürün için ek seçenek bulunmuyor
          </div>

        </div>
      </div>

      <!-- Extra price banner -->
      <div v-if="extraPrice > 0"
        style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px; background:#eef2ff; border:1.5px solid #e0e7ff; border-radius:14px;">
        <span style="font-size:13px; font-weight:600; color:#4f46e5;">Seçenek Eklentisi</span>
        <span style="font-size:14px; font-weight:800; color:#4f46e5;">+₺{{ extraPrice.toFixed(2) }}</span>
      </div>

      <!-- Validation error banner -->
      <div v-if="showErrors && requiredMissing.length > 0"
        style="display:flex; align-items:center; gap:8px; padding:10px 16px; background:#fef2f2; border:1.5px solid #fecaca; border-radius:14px;">
        <ion-icon name="alert-circle" style="color:#ef4444; font-size:18px; flex-shrink:0;"></ion-icon>
        <span style="font-size:13px; font-weight:600; color:#dc2626;">Lütfen zorunlu seçenekleri tamamlayın</span>
      </div>

      <!-- Note field -->
      <div>
        <textarea
          v-model="note"
          placeholder="Sipariş notu: Örn. az acılı, ekstra sos, fıstıksız..."
          rows="2"
          style="width:100%; border:1.5px solid #e2e8f0; border-radius:14px; padding:10px 14px; font-size:13px; resize:none; outline:none; font-family:inherit; color:#374151; background:#fafafa; box-sizing:border-box;"
          onfocus="this.style.borderColor='#818cf8';" onblur="this.style.borderColor='#e2e8f0';"
        ></textarea>
      </div>

      <!-- Add to cart button -->
      <button @click="onFeatureSelect"
        :style="(showErrors && requiredMissing.length > 0)
          ? 'background:#94a3b8; cursor:not-allowed;'
          : 'background:#4f46e5; cursor:pointer;'"
        style="width:100%; padding:14px; color:#fff; font-size:15px; font-weight:800; border-radius:16px; border:0; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.15s; font-family:inherit;"
        :onmouseover="(showErrors && requiredMissing.length > 0) ? '' : 'this.style.background=\'#4338ca\''"
        :onmouseout="(showErrors && requiredMissing.length > 0) ? '' : 'this.style.background=\'#4f46e5\''">
        <ion-icon name="add-circle-outline" style="font-size:20px;"></ion-icon>
        Masaya Ekle
      </button>

    </div>
  </Modal>
</template>
