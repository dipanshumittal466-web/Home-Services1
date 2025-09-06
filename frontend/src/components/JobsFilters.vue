<script setup>
import { ref } from 'vue'
const emit = defineEmits(['apply'])
const model = ref({ q:'', category:'', minBudget:'', maxBudget:'', location:'', status:'' })
function apply(){ emit('apply', { ...model.value }) }
</script>
<template>
  <div class="card">
    <h3 style="margin-top:0">Filters</h3>
    <input class="btn" v-model="model.q" placeholder="Search"/>
    <input class="btn" v-model="model.category" placeholder="Category" style="margin-top:6px"/>
    <div style="display:flex; gap:6px; margin-top:6px">
      <input class="btn" v-model="model.minBudget" placeholder="Min budget"/>
      <input class="btn" v-model="model.maxBudget" placeholder="Max budget"/>
    </div>
    <input class="btn" v-model="model.location" placeholder="Location" style="margin-top:6px"/>
    <input class="btn" v-model="model.status" placeholder="Status (open/closed)" style="margin-top:6px"/>
    <button class="btn primary" style="margin-top:8px" @click="apply">Apply</button>
  </div>
</template>
