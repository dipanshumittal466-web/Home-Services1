import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuth = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email, password) {
      const { data } = await api.post('/api/auth/login', { email, password })
      this.token = data.token
      localStorage.setItem('token', data.token)
      this.user = data.user
    },
    async register(payload) {
      const { data } = await api.post('/api/auth/register', payload)
      this.token = data.token
      localStorage.setItem('token', data.token)
      this.user = data.user
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
