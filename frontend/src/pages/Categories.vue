<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../services/api'
const list = ref([])
const q = ref('')
onMounted(async ()=>{
  const { data } = await api.get('/api/categories')
  list.value = data.categories || []
})
const flat = computed(()=> list.value.flatMap(c => c.items.map(it => ({ group:c.group, groupTitle:c.title, name: it }))))
const filtered = computed(()=> !q.value ? flat.value : flat.value.filter(i => i.name.toLowerCase().includes(q.value.toLowerCase())))
</script>

<template>
  <div class="card">
    <h2 style="margin-top:0">Browse Categories</h2>
    <input class="btn" v-model="q" placeholder="Search categories..." style="width:100%; margin:8px 0 16px"/>
    <div class="grid cols-3">
      <div v-for="item in filtered" :key="item.group + item.name" class="card">
        <div style="font-size:12px; color:var(--muted)">{{ item.group }} • {{ item.groupTitle }}</div>
        <div style="font-weight:700; font-size:18px">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
