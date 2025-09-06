import { defineStore } from 'pinia'
import api from '../services/api'

export const useJobs = defineStore('jobs', {
  state: () => ({ list: [] }),
  actions: {
    async fetch() {
      const { data } = await api.get('/api/jobs')
      this.list = data
    },
    async post(job) {
      const { data } = await api.post('/api/jobs', job)
      this.list.unshift(data)
    }
  }
})
