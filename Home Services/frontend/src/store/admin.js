import { defineStore } from 'pinia'
import api from '../services/api'

export const useAdmin = defineStore('admin', {
  state: () => ({
    analytics: { totalUsers: 0, totalJobs: 0, activeJobs: 0, disputes: 0, subs: 0 },
    disputes: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAnalytics() {
      this.loading = true
      try {
        const { data } = await api.get('/api/admin/analytics')
        this.analytics = data
      } catch (e) {
        this.error = e?.response?.data?.error || e.message
      } finally {
        this.loading = false
      }
    },
    async fetchDisputes() {
      try {
        const { data } = await api.get('/api/admin/disputes')
        this.disputes = data
      } catch (e) {
        this.error = e?.response?.data?.error || e.message
      }
    },
    async updateDispute(id, payload) {
      try {
        await api.put(`/api/admin/disputes/${id}`, payload)
        await this.fetchDisputes()
      } catch (e) {
        this.error = e?.response?.data?.error || e.message
      }
    }
  }
})
