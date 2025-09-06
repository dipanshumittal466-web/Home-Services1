import { createI18n } from 'vue-i18n'
import en from './en.json'
import hi from './hi.json'

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, hi }
})
