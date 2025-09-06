<script setup>
const managerIdForReport = () => form.value.manager
import { ref, onMounted } from 'vue'
import api from '../services/api'

const managerId = null // optional: can be inferred from /users/me if needed
const properties = ref([])
const form = ref({ name:'', address:'', notes:'', manager: null })
const jobForm = ref({ title:'', description:'', budget:0 })

async function load(){
  const me = await api.get('/api/users/me').catch(()=>({data:{user:null}}))
  form.value.manager = me?.data?.user?._id || null
  const { data } = await api.get('/api/manager/properties', { params: { manager: form.value.manager } })
  properties.value = data.properties || []
}
onMounted(load)

async function createProperty(){
  const { data } = await api.post('/api/manager/properties', form.value)
  properties.value.unshift(data.property)
  form.value = { name:'', address:'', notes:'', manager: data.property.manager }
}

async function createJob(p){
  const payload = { ...jobForm.value, poster: form.value.manager }
  await api.post(`/api/manager/properties/${p._id}/jobs`, payload)
  jobForm.value = { title:'', description:'', budget:0 }
  alert('Job created for property')
}
</script>

<template>
  <section class="grid" style="gap:16px">
    <div class="card">
      <h2 style="margin-top:0">Manager: Properties</h2>
      <div class="grid cols-3">
        <div class="card">
          <h3>Add Property</h3>
          <input class="btn" v-model="form.name" placeholder="Name"/>
          <input class="btn" v-model="form.address" placeholder="Address" style="margin-top:6px"/>
          <textarea class="btn" v-model="form.notes" placeholder="Notes" style="margin-top:6px"></textarea>
          <button class="btn primary" style="margin-top:8px" @click="createProperty">Create</button>
        </div>

        <div class="card" style="grid-column: span 2 / span 2">
          <h3>My Properties</h3>
          <div class="grid cols-2">
            <div v-for="p in properties" :key="p._id" class="card">
              <div style="font-weight:700">{{ p.name }}</div>
              <div style="color:var(--muted)">{{ p.address }}</div>

              <div style="margin-top:8px">
                <h4 style="margin:6px 0">Post Job for this Property</h4>
                <input class="btn" v-model="jobForm.title" placeholder="Job title"/>
                <textarea class="btn" v-model="jobForm.description" placeholder="Description" style="margin-top:6px"></textarea>
                <input class="btn" v-model.number="jobForm.budget" placeholder="Budget" style="margin-top:6px"/>
                <button class="btn" style="margin-top:6px" @click="createJob(p)">Create Job</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="card" style="margin-top:12px">
    <h3 style="margin-top:0">Reports</h3>
    <div v-for="p in properties" :key="p._id" class="card">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div><strong>{{ p.name }}</strong> — {{ p.address }}</div>
        <a class="btn" :href="`${import.meta.env.VITE_API_BASE_URL || ''}/api/reports/property/${p._id}/jobs.csv`" target="_blank">Download Jobs CSV</a>
      </div>
    </div>
  </div>
</section>
  <section class="card" style="margin-top:16px">
    <h2 style="margin-top:0">Reports</h2>
    <a class="btn" :href="`${import.meta.env.VITE_API_BASE_URL}/api/reports/manager/${managerIdForReport()}/invoices.csv`" target="_blank">Download Invoices CSV</a>
  </section>
</template>



<div class="card" style="margin-top:12px">
  <h3>Download Reports</h3>
  <div class="grid cols-2">
    <a class="btn" :href="import.meta.env.VITE_API_BASE_URL + '/api/reports/manager/jobs.csv'">Jobs CSV</a>
    <a class="btn" :href="import.meta.env.VITE_API_BASE_URL + '/api/reports/manager/jobs.pdf'">Jobs PDF</a>
  </div>
</div>
