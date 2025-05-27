<template>
  <div class="home-wrapper">
    <h1>Pokémon Selection Screen</h1>

    <div class="selection-block">
      <h2>Your Pokémon</h2>
      <div class="card-grid">
        <PokemonCard
            v-for="poke in pokemons"
            :key="poke.id"
            :pokemon="poke"
            :selected="playerPokemon?.id === poke.id"
            @select="() => selectPokemon(poke, 'player')"
        />
      </div>
    </div>

    <div class="selection-block">
      <h2>Enemy Pokémon</h2>
      <div class="card-grid">
        <PokemonCard
            v-for="poke in pokemons"
            :key="poke.id"
            :pokemon="poke"
            :selected="opponentPokemon?.id === poke.id"
            @select="() => selectPokemon(poke, 'opponent')"
        />
      </div>
    </div>

    <button
        v-if="playerPokemon && opponentPokemon"
        @click="startBattle"
        class="start-button"
    >
      Start Battle
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import PokemonCard from '../components/PokemonCard.vue'
import { usePokemonStore } from '../store/pokemonStore'

const router = useRouter()
const pokemons = ref([])
const playerPokemon = ref(null)
const opponentPokemon = ref(null)
const store = usePokemonStore()

const fetchPokemons = async () => {
  const res = await axios.get('http://localhost:3000/api/pokemons')
  pokemons.value = res.data
}

const selectPokemon = (pokemon, side) => {
  if (side === 'player') {
    playerPokemon.value = pokemon
  } else if (side === 'opponent' && pokemon.id !== playerPokemon.value?.id) {
    opponentPokemon.value = pokemon
  }
}

const startBattle = () => {
  store.player = playerPokemon.value
  store.opponent = opponentPokemon.value
  router.push({ name: 'Battle' })
}

onMounted(fetchPokemons)
</script>

<style scoped>
.home-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.selection-block {
  width: 100%;
  margin-bottom: 40px;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}
.start-button {
  padding: 10px 30px;
  font-size: 18px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 10px;
  cursor: pointer;
}
.start-button:hover {
  background-color: #388e3c;
}
</style>