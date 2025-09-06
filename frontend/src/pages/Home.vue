<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import HowItWorks from '../components/HowItWorks.vue'
import Testimonials from '../components/Testimonials.vue'
import IndemnityBanner from '../components/IndemnityBanner.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
const testimonials = ref([])
onMounted(async ()=>{
  try{
    const { data } = await api.get('/api/testimonials')
    testimonials.value = data.testimonials || []
  }catch(e){}
})
</script>

<template>
  <IndemnityBanner />
  <LanguageSwitcher />
  <HowItWorks />
  <div class="card">
    <h2 style="margin-top:0">Success Stories</h2>
    <div class="grid cols-3">
      <div v-for="t in testimonials" :key="t._id" class="card">
        <div style="font-weight:700">{{ t.name }}</div>
        <div style="color:var(--muted); font-size:12px">{{ t.role }}</div>
        <p style="margin-top:6px">{{ t.message }}</p>
      </div>
    </div>
  </div>
</template>
