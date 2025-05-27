<template>
  <div v-if="player && opponent" class="battle-wrapper">
    <div class="battle-container">
      <div class="pokemon-card player" :class="{ hit: wasPlayerHit }">
        <img :src="player.image" />
        <h3>{{ player.name }} (You)</h3>
        <div class="hp-bar">
          <div class="hp-fill" :style="{ width: playerHP + '%' }"></div>
        </div>
        <div>{{ playerHP }} / {{ player.hp }}</div>
      </div>

      <div class="pokemon-card opponent" :class="{ hit: wasOpponentHit }">
        <img :src="opponent.image" />
        <h3>{{ opponent.name }} (Enemy)</h3>
        <div class="hp-bar">
          <div class="hp-fill" :style="{ width: opponentHP + '%' }"></div>
        </div>
        <div>{{ opponentHP }} / {{ opponent.hp }}</div>
      </div>
    </div>

    <div class="attack-buttons">
      <button
          v-for="(move, index) in moves"
          :key="index"
          @click="attack(move, index)"
          :disabled="cooldowns[index] > 0 || isBusy"
      >
        {{ move.name }} ({{ cooldowns[index] > 0 ? 'Wait: ' + cooldowns[index] : 'Ready' }})
      </button>
    </div>

    <div class="battle-log">
      <p v-for="(log, i) in battleLogs" :key="i">{{ log }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { usePokemonStore } from '../store/pokemonStore'
import axios from 'axios'

const router = useRouter()
const store = usePokemonStore()

let roundCount = 0
const turnCount = ref(0)

const player = ref(store.player)
const opponent = ref(store.opponent)

if (!player.value || !opponent.value) {
  router.replace('/')
}

const moves = ref([player.value.basicAttack, ...player.value.abilities])
const playerHP = ref(player.value?.hp ?? 100)
const opponentHP = ref(opponent.value?.hp ?? 100)
const cooldowns = ref(moves.value.map(() => 0))
const moveTypesCooldown = { attack: 2, defense: 2, heal: 3 }
const wasPlayerHit = ref(false)
const wasOpponentHit = ref(false)
const isBusy = ref(false)
const battleLogs = ref([])

const calculateDamage = (attacker, defender, move) => {
  let multiplier = 1
  if (attacker.strongAgainst?.includes(defender.type)) multiplier = 2
  else if (attacker.weakAgainst?.includes(defender.type)) multiplier = 0.5
  return (move.power ?? 0) * multiplier
}

const saveBattleLog = async (winner) => {
  const logEntry = {
    player: store.player.name,
    opponent: store.opponent.name,
    winner,
    turns: turnCount.value
  }
  try {
    await axios.post('http://localhost:3000/api/battle-log', logEntry)
  } catch (error) {
    console.error('Battle log kaydedilemedi:', error)
  }
}

const checkWinCondition = async () => {
  if (playerHP.value <= 0) {
    await saveBattleLog('opponent')
    store.setWinner('opponent')
    router.push({ name: 'Result' })
    return true
  } else if (opponentHP.value <= 0) {
    await saveBattleLog('player')
    store.setWinner('player')
    router.push({ name: 'Result' })
    return true
  }
  return false
}

const enemyAttack = () => {
  if (opponentHP.value <= 0 || playerHP.value <= 0) return
  const allMoves = [opponent.value.basicAttack, ...opponent.value.abilities]
  const available = allMoves.filter((m, i) => cooldowns.value[i] === 0)
  const move = available[Math.floor(Math.random() * available.length)] || opponent.value.basicAttack
  const damage = calculateDamage(opponent.value, player.value, move)
  playerHP.value = Math.max(0, playerHP.value - damage)
  wasPlayerHit.value = true
  setTimeout(() => (wasPlayerHit.value = false), 300)
  battleLogs.value.unshift(`${opponent.value.name} used ${move.name} and dealt ${damage} damage`)
  checkWinCondition()

  roundCount++
  turnCount.value++

  if (roundCount % 2 === 0) {
    cooldowns.value = cooldowns.value.map(c => Math.max(0, c - 1))
  }
}

const attack = (move, index) => {
  if (playerHP.value <= 0 || opponentHP.value <= 0 || isBusy.value) return
  isBusy.value = true

  if (move.type === 'heal') {
    const healed = Math.min(player.value.hp - playerHP.value, move.power)
    playerHP.value = Math.min(player.value.hp, playerHP.value + move.power)
    battleLogs.value.unshift(`${player.value.name} used ${move.name} and healed ${healed} HP`)
  } else {
    const damage = calculateDamage(player.value, opponent.value, move)
    opponentHP.value = Math.max(0, opponentHP.value - damage)
    wasOpponentHit.value = true
    setTimeout(() => (wasOpponentHit.value = false), 300)
    battleLogs.value.unshift(`${player.value.name} used ${move.name} and dealt ${damage} damage`)
  }

  if (move.name !== player.value.basicAttack.name) {
    const cd = moveTypesCooldown[move.type] || 0
    cooldowns.value[index] = cd
  }

  setTimeout(async () => {
    if (await checkWinCondition()) {
      isBusy.value = false
      return
    }
    enemyAttack()
    isBusy.value = false
  }, 1000)
}
</script>


<style scoped>
.battle-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-top: 30px;
}
.battle-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 900px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.pokemon-card {
  text-align: center;
  width: 200px;
  transition: transform 0.3s ease;
}
.pokemon-card img {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
.hp-bar {
  width: 100%;
  height: 20px;
  background-color: #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}
.hp-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.attack-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}
.battle-log {
  width: 100%;
  max-width: 600px;
  background: rgba(240, 240, 240, 0);
  border-radius: 8px;
  padding: 15px;
  font-family: monospace;
  font-size: 14px;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0 0 5px rgb(183, 0, 255);
}
.hit {
  transform: scale(1.05);
  box-shadow: 0 0 15px red;
}

.pokemon-card > div:last-of-type {
  margin-top: 5px;
  font-weight: bold;
}

</style>