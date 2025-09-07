<script setup>
import LangSwitcher from './components/LangSwitcher.vue'
</script>

<template>
  <header><img src="/logo.png" alt="logo" height="28" style="margin-right:8px"/> class="card" style="display:flex;align-items:center;gap:12px"><img src="/logo.jpeg" alt="logo" height="28"/> <strong>HomeServices</strong></header>
  <Navbar />
  <main class="container">
    <router-view />
  </main>
  <Footer />
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  components: { Navbar, Footer }
}
</script>

<style>
</style>
