<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
const show = ref(false)
onMounted(async ()=>{
  try{
    const { data } = await api.get('/api/users/me')
    if(!data.user.indemnityAccepted) show.value = true
  }catch(e){ /* not logged in */ }
})
async function accept(){
  await api.post('/api/indemnity/accept')
  show.value = false
}
</script>

<template>
  <div v-if="show" class="card" style="border-left:4px solid #f59e0b">
    <strong>Indemnity Agreement Required</strong>
    <p>Please accept the indemnity to continue using job & application features.</p>
    <button class="btn primary" @click="accept">I Accept</button>
  </div>
</template>
