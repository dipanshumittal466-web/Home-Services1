<script setup>
defineProps({ job: { type: Object, required: true } })
</script>

<template>
  <div class="card">
    <h3 style="margin:0 0 8px 0">{{ job.title }}</h3>
    <p style="margin:0 0 8px 0; color:var(--muted)">{{ job.description }}</p>
    <div style="display:flex; justify-content:space-between; align-items:center">
      <small>{{ job.location }} • {{ job.category }}</small>
      <button class="btn">View</button>
    </div>
  </div>
</template>
