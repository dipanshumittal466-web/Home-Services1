<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
function setLang(l){ locale.value = l; localStorage.setItem('locale', l) }
</script>
<template>
  <div class="card" style="padding:8px; display:flex; gap:8px; align-items:center">
    <span>🌐</span>
    <button class="btn" @click="setLang('en')">English</button>
    <button class="btn" @click="setLang('hi')">हिंदी</button>
  </div>
</template>
