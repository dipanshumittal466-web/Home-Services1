<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
</script>
<template>
  <select class="btn" v-model="locale.value" style="min-width:120px">
    <option value="en">English</option>
    <option value="hi">हिंदी</option>
  </select>
</template>
