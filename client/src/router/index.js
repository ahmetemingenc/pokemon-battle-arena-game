// vue router dan gerekli fonksiyonları alıyoruz
import { createRouter, createWebHistory } from 'vue-router'

// home, battle ve result sayfalarını doğrudan import ediyoruz
import HomeView from '../views/HomeView.vue'
import BattleView from '../views/BattleView.vue'
import ResultView from '../views/ResultView.vue'

// route tanımları
const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/battle',
        name: 'Battle',
        component: BattleView
    },
    {
        path: '/result',
        name: 'Result',
        component: () => import('../views/ResultView.vue')
    },
    {
        path: '/battle-history',
        name: 'BattleHistory',
        component: () => import('../views/BattleHistory.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutView.vue')
    }
]

// tarayıcı geçmişi modunda router oluşturuluyor
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
