import { createI18n } from 'vue-i18n'

const messages = {
  en: { nav:{ home:'Home', jobs:'Jobs', tradies:'Tradies', manager:'Manager', admin:'Admin' }, actions:{ filter:'Filter' } },
  hi: { nav:{ home:'होम', jobs:'जॉब्स', tradies:'ट्रेडीज', manager:'मैनेजर', admin:'एडमिन' }, actions:{ filter:'फ़िल्टर' } }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages
})
export default i18n
