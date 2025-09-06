<script setup>
import { ref } from 'vue'
import { useAuth } from '../store/auth'
const name = ref('')
const email = ref('')
const password = ref('')
const auth = useAuth()
const submit = () => auth.register({ name: name.value, email: email.value, password: password.value })
</script>

<template>
  <div class="card" style="max-width:420px; margin:40px auto">
    <h2>Create your account</h2>
    <input v-model="name" placeholder="Name" class="btn" style="width:100%; margin:6px 0"/>
    <input v-model="email" type="email" placeholder="Email" class="btn" style="width:100%; margin:6px 0"/>
    <input v-model="password" type="password" placeholder="Password" class="btn" style="width:100%; margin:6px 0"/>
    <button class="btn primary" style="width:100%" @click="submit">Sign up</button>
  </div>
</template>
