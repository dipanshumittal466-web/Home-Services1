import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../pages/Home.vue')
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
const Poster = () => import('../pages/PosterDashboard.vue')
const Tradie = () => import('../pages/TradieDashboard.vue')
const Admin = () => import('../pages/AdminDashboard.vue')
const ManagerDashboard = () => import('../pages/ManagerDashboard.vue')
const AdminTestimonials = () => import('../pages/AdminTestimonials.vue')
const Categories = () => import('../pages/Categories.vue')

const Jobs = () => import('../pages/Jobs.vue')
const Tradies = () => import('../pages/Tradies.vue')
const routes = [
  { path: '/jobs', component: Jobs },
  { path: '/tradies', component: Tradies },
  { path: '/manager', component: ManagerDashboard },
  { path: '/admin/testimonials', component: AdminTestimonials },
  { path: '/categories', component: Categories },
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/poster/dashboard', component: Poster },
  { path: '/tradie/dashboard', component: Tradie },
  { path: '/admin', component: Admin },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
