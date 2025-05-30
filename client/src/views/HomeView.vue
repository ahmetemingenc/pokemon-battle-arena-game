<template>
  <div class="home-wrapper">
    <h1>Pokémon Selection Screen</h1>

    <div class="selection-block">
      <h2>Your Pokémon</h2>
      <button @click="selectRandom('player')" class="random-button">Random</button>
      <div class="card-grid" ref="playerGrid">
        <PokemonCard
            v-for="(poke, idx) in pokemons"
            :key="poke.id"
            :pokemon="poke"
            :selected="playerPokemon?.id === poke.id"
            @select="() => selectPokemon(poke, 'player')"
            ref="playerPokemonRefs"
        />
      </div>
    </div>

    <div class="selection-block">
      <h2>Enemy Pokémon</h2>
      <button @click="selectRandom('opponent')" class="random-button">Random</button>
      <div class="card-grid" ref="opponentGrid">
        <PokemonCard
            v-for="(poke, idx) in pokemons"
            :key="poke.id"
            :pokemon="poke"
            :selected="opponentPokemon?.id === poke.id"
            @select="() => selectPokemon(poke, 'opponent')"
            ref="opponentPokemonRefs"
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
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import PokemonCard from '../components/PokemonCard.vue'
import { usePokemonStore } from '../store/pokemonStore'

const router = useRouter()
const pokemons = ref([])
const playerPokemon = ref(null)
const opponentPokemon = ref(null)
const store = usePokemonStore()

const playerPokemonRefs = ref([])
const opponentPokemonRefs = ref([])

const fetchPokemons = async () => {
  const res = await axios.get('http://localhost:3000/api/pokemons')
  pokemons.value = res.data
}

const scrollToSelected = (side) => {
  let selectedPokemon = null
  let refsArray = null

  if (side === 'player') {
    selectedPokemon = playerPokemon.value
    refsArray = playerPokemonRefs.value
  } else {
    selectedPokemon = opponentPokemon.value
    refsArray = opponentPokemonRefs.value
  }
  if (!selectedPokemon || !refsArray || refsArray.length === 0) return

  const idx = pokemons.value.findIndex(p => p.id === selectedPokemon.id)
  if (idx === -1) return

  const el = refsArray[idx]?.$el || refsArray[idx]
  if (el && el.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }
}

const selectPokemon = async (pokemon, side) => {
  if (side === 'player') {
    playerPokemon.value = pokemon
    await nextTick()
    scrollToSelected('player')
  } else if (side === 'opponent' && pokemon.id !== playerPokemon.value?.id) {
    opponentPokemon.value = pokemon
    await nextTick()
    scrollToSelected('opponent')
  }
}

const selectRandom = async (side) => {
  if (pokemons.value.length === 0) return
  const randomPokemon = pokemons.value[Math.floor(Math.random() * pokemons.value.length)]

  if (side === 'player') {
    playerPokemon.value = randomPokemon
    await nextTick()
    scrollToSelected('player')
  } else if (side === 'opponent') {
    if (randomPokemon.id === playerPokemon.value?.id) {
      const filteredPokemons = pokemons.value.filter(p => p.id !== playerPokemon.value?.id)
      if (filteredPokemons.length === 0) return
      opponentPokemon.value = filteredPokemons[Math.floor(Math.random() * filteredPokemons.length)]
      await nextTick()
      scrollToSelected('opponent')
    } else {
      opponentPokemon.value = randomPokemon
      await nextTick()
      scrollToSelected('opponent')
    }
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

.random-button {
  margin-bottom: 10px;
  padding: 8px 18px;
  background-color: var(--color-primary-pink);
  color: #111;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.random-button:hover {
  background-color: #e91e63;
}
</style>
