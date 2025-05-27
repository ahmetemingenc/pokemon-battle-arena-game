<template>
  <div class="result-wrapper">
    <h1>{{ winnerText }}</h1>

    <img :src="imageSrc" class="result-image" />

    <div class="result-buttons">
      <button @click="playAgain">Play Again</button>
      <button @click="chooseNew">Choose New Pokémon</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { usePokemonStore } from '../store/pokemonStore' // <-- BU ŞART

const store = usePokemonStore()
const router = useRouter()
const route = useRoute()

const winner = store.winner
const winnerText = winner === 'player' ? 'You Win!' : 'You Lose!'

const playAgain = () => {
  router.push({ name: 'Battle' })
}

const chooseNew = () => {
  router.push({ name: 'Home' })
}
</script>


<style scoped>
.result-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  text-align: center;
}

.result-image {
  width: 250px;
  margin: 20px 0;
}

.result-buttons {
  display: flex;
  gap: 20px;
}

.result-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.result-buttons button:hover {
  background: #0b7dda;
}
</style>
