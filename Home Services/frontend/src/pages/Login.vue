<script setup>
import { ref } from 'vue'
import { useAuth } from '../store/auth'
const email = ref('')
const password = ref('')
const auth = useAuth()
const submit = () => auth.login(email.value, password.value)
</script>

<template>
  <div class="card" style="max-width:420px; margin:40px auto">
    <h2>Login</h2>
    <input v-model="email" type="email" placeholder="Email" class="btn" style="width:100%; margin:6px 0"/>
    <input v-model="password" type="password" placeholder="Password" class="btn" style="width:100%; margin:6px 0"/>
    <button class="btn primary" style="width:100%" @click="submit">Login</button>
  </div>
</template>
