// pinia kütüphanesinden createPinia fonksiyonunu import ediyoruz
import { createPinia } from 'pinia'

// pinia store objesini oluşturuyoruz
const pinia = createPinia()

// oluşturulan store objesini export ediyoruz main.js veya app.vue'de kullanılacak
export default pinia
