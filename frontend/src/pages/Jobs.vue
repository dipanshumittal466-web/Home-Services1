<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
const filters = ref({ category:'', status:'', location:'', minBudget:'', maxBudget:'', q:'' })
const jobs = ref([])
async function load(){
  const { data } = await api.get('/api/jobs', { params: filters.value })
  jobs.value = data.jobs || []
}
onMounted(load)
watch(filters, load, { deep: true })
</script>
<template>
  <section class="grid cols-3" style="gap:16px">
    <aside class="card">
      <h3 style="margin-top:0">Filters</h3>
      <input class="btn" v-model="filters.q" placeholder="Search title/description"/>
      <input class="btn" v-model="filters.category" placeholder="Category (A–G)" style="margin-top:6px"/>
      <input class="btn" v-model="filters.status" placeholder="Status (open/closed)" style="margin-top:6px"/>
      <input class="btn" v-model="filters.location" placeholder="Location" style="margin-top:6px"/>
      <div class="grid cols-2" style="margin-top:6px">
        <input class="btn" v-model="filters.minBudget" placeholder="Min Budget"/>
        <input class="btn" v-model="filters.maxBudget" placeholder="Max Budget"/>
      </div>
    </aside>
    <main class="card" style="grid-column: span 2 / span 2">
      <h2 style="margin-top:0">Jobs</h2>
      <div class="grid cols-2">
        <div v-for="j in jobs" :key="j._id" class="card">
          <div style="font-weight:700">{{ j.title }}</div>
          <div style="color:var(--muted)">{{ j.category }} • {{ j.location }} • {{ j.status }}</div>
          <div style="margin-top:6px">Budget: {{ j.budget }}</div>
          <p style="margin-top:6px">{{ j.description }}</p>
        </div>
      </div>
    </main>
  </section>
</template>
