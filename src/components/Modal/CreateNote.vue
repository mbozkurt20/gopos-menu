<script setup lang="ts">
import Modal from "./index.vue";
import { modalStore } from "../../store/modal";
import { tableDetailStore } from "../../store/table-detail";
import axios from "axios";
import { toast } from "vue3-toastify";

const close = () => {
  modalStore.createNote = false;
};

const handleClose = (clear: boolean) => {
  axios({
    url: "/api/v2/area/note",
    method: "POST",
    data: {
      domain: localStorage.getItem("domain"),
      id: tableDetailStore.table.id,
      note: clear ? null : tableDetailStore.table.note,
    },
  })
    .then((res) => {
      if (res.data.success === true) {
        toast("Not Düzenlendi", { theme: "dark", type: "success", pauseOnFocusLoss: false });
      }
    })
    .catch((e) => { console.log("err", e); });

  modalStore.createNote = false;
};
</script>

<template>
  <Modal :is-opened="modalStore.createNote" :handle-close="close" title="Masa Notu">
    <div style="padding:0 8px; display:flex; flex-direction:column; gap:12px;">
      <textarea
        placeholder="Not girin..."
        v-model="tableDetailStore.table.note"
        rows="6"
        style="width:100%; border:1.5px solid #e2e8f0; border-radius:14px; padding:12px 14px; font-size:14px; resize:none; outline:none; font-family:inherit; color:#374151; background:#f8fafc; box-sizing:border-box;"
        onfocus="this.style.borderColor='#818cf8';" onblur="this.style.borderColor='#e2e8f0';"
      ></textarea>
      <div style="display:flex; gap:10px;">
        <button
          @click="handleClose(true)"
          style="flex:1; padding:11px; border:none; border-radius:12px; background:#fef3c7; color:#92400e; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; transition:background 0.12s;"
          onmouseover="this.style.background='#fde68a';" onmouseout="this.style.background='#fef3c7';"
        >Temizle</button>
        <button
          @click="handleClose(false)"
          style="flex:1; padding:11px; border:none; border-radius:12px; background:#4f46e5; color:#fff; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; transition:background 0.12s;"
          onmouseover="this.style.background='#4338ca';" onmouseout="this.style.background='#4f46e5';"
        >Kaydet</button>
      </div>
    </div>
  </Modal>
</template>
