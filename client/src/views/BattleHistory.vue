<template>
  <div class="battle-history-wrapper">
    <h2>battle history</h2>
    <ul class="battle-list">
      <li v-for="(log, index) in battleLogs" :key="index" class="battle-item">
        <div class="pokemon-info">
          <img
              :src="findPokemonByName(log.player)?.image"
              alt="player pokemon"
              class="pokemon-image"
          />
          <span>{{ log.player }}</span>
        </div>

        <div class="vs-text">vs</div>

        <div class="pokemon-info">
          <img
              :src="findPokemonByName(log.opponent)?.image"
              alt="opponent pokemon"
              class="pokemon-image"
          />
          <span>{{ log.opponent }}</span>
        </div>

        <div class="battle-summary">
          <span class="battle-winner" :class="{
            'winner-player': log.winner === 'player',
            'winner-opponent': log.winner === 'opponent'
          }">
            {{ log.winner === 'player' ? 'player wins' : 'opponent wins' }}
          </span>
          <span>turns: {{ log.turns }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const battleLogs = ref([])
const pokemons = ref([])

const fetchBattles = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/battle-history')
    battleLogs.value = res.data
  } catch (error) {
    console.error('battle history yüklenemedi:', error)
  }
}

const fetchPokemons = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/pokemons')
    pokemons.value = res.data
  } catch (error) {
    console.error('pokemonlar yüklenemedi:', error)
  }
}

const findPokemonByName = (name) => {
  return pokemons.value.find(p => p.name === name)
}

onMounted(() => {
  fetchPokemons()
  fetchBattles()
})
</script>

<style scoped>
.battle-history-wrapper {
  max-width: 900px;
  margin: 40px auto;
  background: #111118;
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 0 40px var(--color-primary-pink);
  color: var(--color-text-primary);
  font-family: 'Orbitron', monospace;
}

h2 {
  font-size: 2.8rem;
  margin-bottom: 25px;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 0 0 8px var(--color-primary-pink);
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
  align-items: center;
  gap: 15px;
  box-shadow: 0 0 20px var(--color-primary-pink);
  transition: box-shadow 0.3s ease;
}

.battle-item:hover {
  box-shadow: 0 0 40px var(--color-primary-blue);
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.pokemon-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 5px;
}

.vs-text {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary-pink);
  user-select: none;
  min-width: 30px;
  text-align: center;
}

.battle-summary {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: right;
  min-width: 150px;
}

.battle-winner {
  padding: 6px 14px;
  border-radius: 10px;
  user-select: none;
}

.winner-player {
  background-color: var(--color-primary-blue);
  color: #111;
}

.winner-opponent {
  background-color: var(--color-primary-pink);
  color: #111;
}
</style>
