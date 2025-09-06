<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
const filters = ref({ skill:'', rating:'', verified:'', q:'' })
const tradies = ref([])
async function load(){
  const params = { ...filters.value }
  if(params.verified === '') delete params.verified
  const { data } = await api.get('/api/users/tradies', { params })
  tradies.value = data.tradies || []
}
onMounted(load)
watch(filters, load, { deep: true })
</script>
<template>
  <section class="grid cols-3" style="gap:16px">
    <aside class="card">
      <h3 style="margin-top:0">Filters</h3>
      <input class="btn" v-model="filters.q" placeholder="Search name/bio"/>
      <input class="btn" v-model="filters.skill" placeholder="Skill (e.g., Plumbing)" style="margin-top:6px"/>
      <input class="btn" v-model="filters.rating" placeholder="Min Rating (1-5)" style="margin-top:6px"/>
      <select class="btn" v-model="filters.verified" style="margin-top:6px">
        <option value="">Verified?</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </aside>
    <main class="card" style="grid-column: span 2 / span 2">
      <h2 style="margin-top:0">Tradies</h2>
      <div class="grid cols-2">
        <div v-for="t in tradies" :key="t._id" class="card">
          <div style="font-weight:700">{{ t.name || t.email }}</div>
          <div style="color:var(--muted)">{{ t.skills && t.skills.join(', ') }}</div>
          <div style="margin-top:6px">Rating: {{ t.rating || 'N/A' }} • Verified: {{ t.verified ? 'Yes' : 'No' }}</div>
        </div>
      </div>
    </main>
  </section>
</template>
