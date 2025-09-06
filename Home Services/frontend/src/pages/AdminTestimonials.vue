<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
const list = ref([])
const form = ref({ name:'', role:'', message:'', rating:5, active:true })
async function load(){
  const { data } = await api.get('/api/testimonials')
  list.value = data.testimonials || []
}
onMounted(load)
async function add(){
  await api.post('/api/testimonials', form.value)
  form.value = { name:'', role:'', message:'', rating:5, active:true }
  load()
}
async function toggle(t){
  await api.put(`/api/testimonials/${t._id}`, { active: !t.active })
  load()
}
</script>

<template>
  <section class="card">
    <h2 style="margin-top:0">Testimonials Manager</h2>
    <div class="grid cols-3">
      <div class="card">
        <h3>Add Testimonial</h3>
        <input class="btn" v-model="form.name" placeholder="Name"/>
        <input class="btn" v-model="form.role" placeholder="Role"/>
        <textarea class="btn" v-model="form.message" placeholder="Message" style="margin-top:6px"></textarea>
        <input class="btn" v-model.number="form.rating" placeholder="Rating (1-5)" style="margin-top:6px"/>
        <label style="margin-top:6px; display:block"><input type="checkbox" v-model="form.active"> Active</label>
        <button class="btn primary" style="margin-top:8px" @click="add">Add</button>
      </div>
      <div class="card" style="grid-column: span 2 / span 2">
        <h3>Current</h3>
        <div class="grid cols-2">
          <div v-for="t in list" :key="t._id" class="card">
            <div style="display:flex; justify-content:space-between; align-items:center">
              <div>
                <div style="font-weight:700">{{ t.name }}</div>
                <div style="color:var(--muted); font-size:12px">{{ t.role }}</div>
              </div>
              <button class="btn" @click="toggle(t)">{{ t.active ? 'Disable' : 'Enable' }}</button>
            </div>
            <p style="margin-top:6px">{{ t.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
