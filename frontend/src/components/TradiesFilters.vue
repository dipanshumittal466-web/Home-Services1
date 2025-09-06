<script setup>
import { ref } from 'vue'
const emit = defineEmits(['apply'])
const model = ref({ q:'', skill:'', rating:'', verified:false })
function apply(){ emit('apply', { ...model.value }) }
</script>
<template>
  <div class="card">
    <h3 style="margin-top:0">Filters</h3>
    <input class="btn" v-model="model.q" placeholder="Search tradies"/>
    <input class="btn" v-model="model.skill" placeholder="Skill"/>
    <input class="btn" v-model="model.rating" placeholder="Min rating" style="margin-top:6px"/>
    <label style="margin-top:6px; display:block"><input type="checkbox" v-model="model.verified"> Verified</label>
    <button class="btn primary" style="margin-top:8px" @click="apply">Apply</button>
  </div>
</template>
