<script setup>
// vue-router'dan route bilgisini almak için useRoute import edilir
import { useRoute } from 'vue-router'

// aktif route bilgisini tutar
const route = useRoute()

// nav barın gösterileceği sayfa isimleri listesi
const showNavPages = ['Home', 'BattleHistory', 'About']
</script>

<template>
  <div>
    <!-- sadece belirtilen sayfalarda nav bar gösterilir -->
    <nav v-if="showNavPages.includes(route.name)" class="main-nav">
      <router-link to="/">Pokemon Selection</router-link>
      <router-link to="/battle-history">Battle History</router-link>
      <router-link to="/about">About</router-link>
    </nav>

    <!-- route'a göre uygun sayfa componenti render edilir -->
    <router-view />
  </div>
</template>


<style>
/* oyunun genel tasarımını bu kısımda hallediyoruz*/
@import url('https://fonts.googleapis.com/css2?family=Orbitron&display=swap');

:root {
  --color-background: #0f0f1a;
  --color-primary-pink: #ff2d95;
  --color-primary-blue: #08f7fe;
  --color-text-primary: #e0e0e0;
  --color-text-secondary: #8888aa;
  --color-danger: #ff416c;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: 'Orbitron', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}

.main-nav {
  display: flex;
  gap: 20px;
  padding: 15px 30px;
  background: linear-gradient(90deg, var(--color-primary-pink), var(--color-primary-blue));
  box-shadow: 0 0 15px var(--color-primary-pink);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1.5px;
}

.main-nav a {
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 8px transparent;
}

.main-nav a:hover {
  background-color: var(--color-primary-pink);
  box-shadow: 0 0 20px var(--color-primary-pink);
  color: white;
}
</style>
