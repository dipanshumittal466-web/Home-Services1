<script setup>
import { onMounted, ref } from 'vue'
import { useAdmin } from '../store/admin'
import { Chart } from 'chart.js/auto'
import DisputesTable from '../components/DisputesTable.vue'

const admin = useAdmin()
const chartEl = ref(null)
let chart

onMounted(async () => {
  await admin.fetchAnalytics()
  await admin.fetchDisputes()
  // Build chart
  if (chartEl.value) {
    const d = admin.analytics
    const labels = ['Users', 'Jobs', 'Active Jobs', 'Disputes', 'Subscriptions']
    const data = [d.totalUsers, d.totalJobs, d.activeJobs, d.disputes, d.subs]
    chart = new Chart(chartEl.value.getContext('2d'), {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Platform Overview', data }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    })
  }
})

function resolveDispute(d) {
  admin.updateDispute(d._id, { status: 'resolved', resolutionNotes: 'Resolved by admin' })
}
function rejectDispute(d) {
  admin.updateDispute(d._id, { status: 'rejected', resolutionNotes: 'Rejected by admin' })
}
</script>

<template>
  <section class="grid" style="gap:16px">
    <div class="card">
      <h2 style="margin-top:0">Analytics</h2>
      <canvas ref="chartEl" height="120"></canvas>
      <div style="display:flex; gap:16px; margin-top:12px">
        <div class="card" style="flex:1">
          <div style="font-size:12px; color:var(--muted)">Users</div>
          <div style="font-weight:800; font-size:24px">{{ admin.analytics.totalUsers }}</div>
        </div>
        <div class="card" style="flex:1">
          <div style="font-size:12px; color:var(--muted)">Jobs</div>
          <div style="font-weight:800; font-size:24px">{{ admin.analytics.totalJobs }}</div>
        </div>
        <div class="card" style="flex:1">
          <div style="font-size:12px; color:var(--muted)">Active Jobs</div>
          <div style="font-weight:800; font-size:24px">{{ admin.analytics.activeJobs }}</div>
        </div>
        <div class="card" style="flex:1">
          <div style="font-size:12px; color:var(--muted)">Disputes</div>
          <div style="font-weight:800; font-size:24px">{{ admin.analytics.disputes }}</div>
        </div>
        <div class="card" style="flex:1">
          <div style="font-size:12px; color:var(--muted)">Subscriptions</div>
          <div style="font-weight:800; font-size:24px">{{ admin.analytics.subs }}</div>
        </div>
      </div>
    </div>

    <DisputesTable
      :items="admin.disputes"
      @resolve="resolveDispute"
      @reject="rejectDispute"
    />
  </section>
</template>


<template>
  <section class="card">
    <h2 style="margin-top:0">Download Reports</h2>
    <div class="grid cols-4">
      <a class="btn" :href="import.meta.env.VITE_API_BASE_URL + '/api/reports/admin/disputes.csv'">Disputes CSV</a>
      <a class="btn" :href="import.meta.env.VITE_API_BASE_URL + '/api/reports/admin/disputes.pdf'">Disputes PDF</a>
    </div>
  </section>
</template>

<template>
  <section class="card">
    <h2 style="margin-top:0">Reports Export</h2>
    <div style="display:flex; gap:8px; flex-wrap:wrap">
      <a class="btn" :href="`${import.meta.env.VITE_API_BASE_URL}/api/reports/admin/analytics.csv`" target="_blank">Download Analytics CSV</a>
      <a class="btn" :href="`${import.meta.env.VITE_API_BASE_URL}/api/reports/admin/disputes.csv`" target="_blank">Download Disputes CSV</a>
    </div>
  </section>
</template>
