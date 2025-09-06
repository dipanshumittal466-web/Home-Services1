<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ items: { type: Array, default: () => [] } })
const emit = defineEmits(['resolve', 'reject'])
const q = ref('')
const filtered = ref(props.items)

watch([() => props.items, q], () => {
  const term = q.value.toLowerCase()
  filtered.value = (props.items || []).filter(d =>
    !term ||
    d?.reason?.toLowerCase()?.includes(term) ||
    d?.status?.toLowerCase()?.includes(term) ||
    d?.jobId?.title?.toLowerCase()?.includes(term)
  )
}, { immediate: true })
</script>

<template>
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
      <h3 style="margin:0">Disputes</h3>
      <input class="btn" v-model="q" placeholder="Search disputes..." />
    </div>
    <div style="overflow:auto">
      <table style="width:100%; border-collapse:collapse">
        <thead>
          <tr>
            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee">Job</th>
            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee">Reason</th>
            <th style="text-align:left; padding:8px; border-bottom:1px solid #eee">Status</th>
            <th style="padding:8px; border-bottom:1px solid #eee">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filtered" :key="d._id">
            <td style="padding:8px; border-bottom:1px solid #f2f2f2">
              {{ d?.jobId?.title || d?.jobId?._id }}
              <div style="color:var(--muted); font-size:12px">Raised By: {{ d?.raisedBy?.name || d?.raisedBy?._id }}</div>
            </td>
            <td style="padding:8px; border-bottom:1px solid #f2f2f2">{{ d.reason }}</td>
            <td style="padding:8px; border-bottom:1px solid #f2f2f2">{{ d.status }}</td>
            <td style="padding:8px; border-bottom:1px solid #f2f2f2">
              <button class="btn" @click="$emit('resolve', d)">Resolve</button>
              <button class="btn" style="margin-left:6px" @click="$emit('reject', d)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
