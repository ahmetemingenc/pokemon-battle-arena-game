<template>
  <!-- eğer hem player hem opponent seçiliyse savaş ekranını göster -->
  <div v-if="player && opponent" class="battle-wrapper">
    <div class="battle-container">
      <!-- player pokemon kartı, vurulduğunda animasyon için sınıf eklenir -->
      <div class="pokemon-card player" :class="{ hit: wasPlayerHit }">
        <img :src="player.image"/>
        <h3>{{ player.name }} (You)</h3>
        <!-- can barı -->
        <div class="hp-bar">
          <div class="hp-fill" :style="{ width: playerHP + '%' }"></div>
        </div>
        <!-- sayısal can göstergesi -->
        <div>{{ playerHP }} / {{ player.hp }}</div>
      </div>

      <!-- opponent pokemon kartı, vurulduğunda animasyon için sınıf eklenir -->
      <div class="pokemon-card opponent" :class="{ hit: wasOpponentHit }">
        <img :src="opponent.image"/>
        <h3>{{ opponent.name }} (Enemy)</h3>
        <div class="hp-bar">
          <div class="hp-fill" :style="{ width: opponentHP + '%' }"></div>
        </div>
        <div>{{ opponentHP }} / {{ opponent.hp }}</div>
      </div>
    </div>

    <!-- saldırı butonları, cooldown ve işlem durumu kontrolüyle aktif/pasif -->
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

    <!-- savaş logları -->
    <div class="battle-log">
      <p v-for="(log, i) in battleLogs" :key="i">{{ log }}</p>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {ref} from 'vue'
import {usePokemonStore} from '../store/pokemonStore'
import axios from 'axios'

const router = useRouter()
const store = usePokemonStore()

// tur sayacı ve turn sayacı (ref tipi)
let roundCount = 0
const turnCount = ref(0)

// seçilen oyuncu ve rakip pokemonları
const player = ref(store.player)
const opponent = ref(store.opponent)

// eğer herhangi biri seçili değilse anasayfaya yönlendir
if (!player.value || !opponent.value) {
  router.replace('/')
}

const moves = ref([player.value.basicAttack, ...player.value.abilities])
const playerHP = ref(player.value?.hp ?? 100)
const opponentHP = ref(opponent.value?.hp ?? 100)
const cooldowns = ref(moves.value.map(() => 0))
const moveTypesCooldown = {attack: 2, defense: 2, heal: 3}
const wasPlayerHit = ref(false)
const wasOpponentHit = ref(false)
const isBusy = ref(false)
const battleLogs = ref([])
const playerShielded = ref(false)
const opponentShielded = ref(false)

// pokemon tipine göre etki hesaplama tablosu
const typeEffectiveness = {
  fighting: {strongAgainst: ['normal', 'ice', 'rock'], weakAgainst: ['flying', 'psychic', 'fairy']},
  fire: {strongAgainst: ['grass', 'ice', 'bug'], weakAgainst: ['water', 'ground', 'rock']},
  water: {strongAgainst: ['fire', 'ground', 'rock'], weakAgainst: ['electric', 'grass']},
  grass: {strongAgainst: ['water', 'ground', 'rock'], weakAgainst: ['fire', 'ice', 'flying']},
  bug: {strongAgainst: ['grass', 'psychic'], weakAgainst: ['fire', 'ice', 'flying']},
  poison: {strongAgainst: ['grass', 'fairy'], weakAgainst: ['ground', 'psychic']},
  electric: {strongAgainst: ['water', 'flying'], weakAgainst: ['ground']},
}

// hasar hesaplama fonksiyonu
const calculateDamage = (attacker, defender, move) => {
  const basePower = move.power ?? 0
  const attackerType = attacker.type.toLowerCase()
  const defenderType = defender.type.toLowerCase()

  const typeInfo = typeEffectiveness[attackerType]
  if (!typeInfo) return basePower

  if (typeInfo.strongAgainst.includes(defenderType)) {
    return basePower * 2
  } else if (typeInfo.weakAgainst.includes(defenderType)) {
    return basePower * 0.5
  } else {
    return basePower
  }
}

// savaş kaydını backend'e kaydetme fonksiyonu
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

// oyun sonu kontrolü, kazanan belirlenip sonuç ekranına yönlendirme
const checkWinCondition = async () => {
  if (playerHP.value <= 0) {
    await saveBattleLog('opponent')
    store.setWinner('opponent')
    router.push({name: 'Result'})
    return true
  } else if (opponentHP.value <= 0) {
    await saveBattleLog('player')
    store.setWinner('player')
    router.push({name: 'Result'})
    return true
  }
  return false
}

// rakibin saldırısı
const enemyAttack = () => {
  if (opponentHP.value <= 0 || playerHP.value <= 0) return
  const allMoves = [opponent.value.basicAttack, ...opponent.value.abilities]

  // hazır hamleleri filtrele
  const available = allMoves.filter((m, i) => cooldowns.value[i] === 0)

  // rastgele bir hamle seç, yoksa basic attack
  const move = available[Math.floor(Math.random() * available.length)] || opponent.value.basicAttack

  if (move.type === 'defense') {
    opponentShielded.value = true
    battleLogs.value.unshift(`${opponent.value.name} used ${move.name} and raised a shield`)
  } else {
    // saldırı hasarını hesapla
    let damage = calculateDamage(opponent.value, player.value, move)
    // eğer oyuncunun kalkanı varsa hasar 0 ve kalkan kapanır
    if (playerShielded.value) {
      damage = 0
      playerShielded.value = false
      battleLogs.value.unshift(`${player.value.name}'s shield blocked the attack!`)
    }
    // can azalt
    playerHP.value = Math.max(0, playerHP.value - damage)
    // vurulma animasyonunu tetikle
    wasPlayerHit.value = true
    setTimeout(() => (wasPlayerHit.value = false), 300)
    battleLogs.value.unshift(`${opponent.value.name} used ${move.name} and dealt ${damage} damage`)
  }

  checkWinCondition()

  roundCount++
  turnCount.value++

  // her iki taraf da hamle yaptığında cooldownları azalt
  if (roundCount % 2 === 0) {
    cooldowns.value = cooldowns.value.map(c => Math.max(0, c - 1))
  }
}

// oyuncu saldırısı
const attack = (move, index) => {
  if (playerHP.value <= 0 || opponentHP.value <= 0 || isBusy.value) return
  isBusy.value = true

  if (move.type === 'defense') {
    playerShielded.value = true
    battleLogs.value.unshift(`${player.value.name} used ${move.name} and raised a shield`)
  } else if (move.type === 'heal') {
    const healed = Math.min(player.value.hp - playerHP.value, move.power)
    playerHP.value = Math.min(player.value.hp, playerHP.value + move.power)
    battleLogs.value.unshift(`${player.value.name} used ${move.name} and healed ${healed} HP`)
  } else {
    let damage = calculateDamage(player.value, opponent.value, move)
    if (opponentShielded.value) {
      damage = 0
      opponentShielded.value = false
      battleLogs.value.unshift(`${opponent.value.name}'s shield blocked the attack!`)
    }
    // rakibin canını azalt
    opponentHP.value = Math.max(0, opponentHP.value - damage)
    wasOpponentHit.value = true
    setTimeout(() => (wasOpponentHit.value = false), 300)
    battleLogs.value.unshift(`${player.value.name} used ${move.name} and dealt ${damage} damage`)
  }

  // saldırı sonrası cooldown ayarla (basic attack için cooldown yok)
  if (move.name !== player.value.basicAttack.name) {
    const cd = moveTypesCooldown[move.type] || 0
    cooldowns.value[index] = cd
  }

  // rakip hamlesini başlat ve işlem bittiğinde butonları aç
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