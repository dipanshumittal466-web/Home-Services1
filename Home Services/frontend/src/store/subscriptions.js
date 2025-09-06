import { defineStore } from 'pinia'
import api from '../services/api'

export const useSubs = defineStore('subs', {
  state: () => ({ plans: [], current: null }),
  actions: {
    async loadPlans() {
      const { data } = await api.get('/api/subscriptions/plans')
      this.plans = data
    },
    async subscribe(planId) {
      const { data } = await api.post('/api/subscriptions/subscribe', { planId })
      this.current = data
    }
  }
})
