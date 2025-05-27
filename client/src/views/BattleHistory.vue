<template>
  <div class="battle-history-wrapper">
    <h2>Battle History</h2>
    <ul>
      <li v-for="(log, index) in battleLogs" :key="index">
        {{ log.player }} vs {{ log.opponent }} — Winner: {{ log.winner }} — Turns: {{ log.turns }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const battleLogs = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/battle-history')
    battleLogs.value = res.data
  } catch (error) {
    console.error('Battle history yüklenemedi:', error)
  }
})
</script>

<style scoped>
.history-wrapper {
  max-width: 900px;
  margin: 40px auto;
  background: #111118;
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 0 40px var(--color-primary-pink);
  color: var(--color-text-primary);
  font-family: 'Orbitron', monospace;
}

h1 {
  font-size: 2.8rem;
  margin-bottom: 25px;
  text-align: center;
  text-shadow: 0 0 8px var(--color-primary-pink);
}

.loading, .empty-message {
  font-size: 1.4rem;
  text-align: center;
  padding: 40px 0;
  color: var(--color-text-secondary);
}

.battle-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.battle-item {
  background: linear-gradient(145deg, #161625, #0c0c15);
  border: 2px solid var(--color-primary-pink);
  border-radius: 12px;
  padding: 20px 25px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 0 20px var(--color-primary-pink);
  transition: box-shadow 0.3s ease;
}

.battle-item:hover {
  box-shadow: 0 0 40px var(--color-primary-blue);
}

.battle-summary span {
  font-size: 1.3rem;
}

.battle-winner {
  font-weight: 700;
  font-size: 1.4rem;
  padding: 6px 14px;
  border-radius: 10px;
  user-select: none;
}

.winner-player {
  background-color: var(--color-primary-pink);
  color: #111;
  text-shadow: none;
}

.winner-opponent {
  background-color: var(--color-primary-blue);
  color: #111;
  text-shadow: none;
}
</style>
