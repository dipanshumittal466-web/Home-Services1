<template>
  <header class="nav">
    <div class="brand"><router-link to="/">HomeServicesEtc</router-link></div>
    <nav style="display:flex; gap:10px; align-items:center">
      <router-link class="btn" to="/categories">Categories</router-link>
      <router-link class="btn" to="/post-job">Post a Job</router-link>
      <router-link class="btn" to="/tradie/dashboard">Tradie</router-link>
      <router-link class="btn" to="/poster/dashboard">Poster</router-link>
      <router-link class="btn" to="/admin">Admin</router-link>
      <router-link class="btn" to="/login">Login</router-link>
      <router-link class="btn primary" to="/register">Sign up</router-link>
    </nav>
  </header>
</template>
