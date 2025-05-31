<template>
  <!-- pokemon objesi varsa kart ve tooltip göster -->
  <div
      v-if="pokemon"
      class="pokemon-card-wrapper"
      ref="wrapperRef"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
  >
    <!-- pokemon kartı, seçili ise 'selected' sınıfı eklenir, tıklayınca emit yapar -->
    <div class="pokemon-card" :class="{ selected }" @click="emitClick">
      <img :src="pokemon.image" />
      <h3>{{ pokemon.name }}</h3>
      <p>{{ pokemon.type }}</p>
    </div>
    <!-- tooltip: detaylı pokemon bilgileri, v-show ile görünürlük kontrolü -->
    <div
        class="pokemon-tooltip"
        ref="tooltipRef"
        v-show="showTooltip"
    >
      <p><strong>Type:</strong> {{ pokemon.type }}</p>
      <p><strong>Strong:</strong> {{ pokemon.strongAgainst.join(', ') }}</p>
      <p><strong>Weak:</strong> {{ pokemon.weakAgainst.join(', ') }}</p>
      <p><strong>HP:</strong> {{ pokemon.hp }}</p>
      <p><strong>Basic:</strong> {{ pokemon.basicAttack.name }} ({{ pokemon.basicAttack.power }})</p>
      <p><strong>Abilities:</strong></p>
      <ul>
        <!-- pokemonun yeteneklerinin listesi -->
        <li v-for="(a, i) in pokemon.abilities" :key="i">
          {{ a.name }} ({{ a.power }} power, Cooldown: {{ a.cooldown }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// props: parent bileşenden gelen pokemon objesi ve seçili olup olmadığı
const props = defineProps({
  pokemon: Object,
  selected: Boolean
})

// parent bileşene 'select' eventi göndermek için emit tanımı
const emit = defineEmits(['select'])

const showTooltip = ref(false)
const tooltipRef = ref(null)
const wrapperRef = ref(null)

// kart tıklandığında seçili pokemonu parenta bildir
const emitClick = () => emit('select', props.pokemon)

// tooltip pozisyonunu ayarlayan fonksiyon (üstte veya altta açılmasını sağlar)
const adjustTooltipPosition = () => {
  nextTick(() => {
    if (!tooltipRef.value || !wrapperRef.value) return

    const tooltipRect = tooltipRef.value.getBoundingClientRect()
    const wrapperRect = wrapperRef.value.getBoundingClientRect()
    const windowHeight = window.innerHeight

    // wrapper’ın alt kenarı pencereye çok yakın mı kontrol et
    const wrapperCloseToBottom = (windowHeight - wrapperRect.bottom) < tooltipRect.height

    if (wrapperCloseToBottom) {
      // pencereye yakınsa tooltip yukarı açılsın
      tooltipRef.value.style.top = 'auto'
      tooltipRef.value.style.bottom = '105%'
    } else {
      // değilse tooltip aşağı açılsın
      tooltipRef.value.style.top = '105%'
      tooltipRef.value.style.bottom = 'auto'
    }
  })
}

// fare wrappera girdiğinde tooltip açılır ve pozisyon ayarlanır
const onMouseEnter = () => {
  showTooltip.value = true
  adjustTooltipPosition()
}

// fare wrapperdan çıktığında tooltip kapanır
const onMouseLeave = () => {
  showTooltip.value = false
}
</script>


<style scoped>
.pokemon-card-wrapper {
  position: relative;
  display: inline-block;
  margin: 10px;
}

.pokemon-card {
  background: linear-gradient(145deg, #161625, #0c0c15);
  border: 2px solid var(--color-primary-pink);
  border-radius: 16px;
  padding: 16px;
  color: var(--color-text-primary);
  text-align: center;
  cursor: pointer;
  box-shadow: 0 0 8px var(--color-primary-pink);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 150px;
  user-select: none;
}

.pokemon-card:hover {
  transform: scale(1.07);
  box-shadow: 0 0 25px var(--color-primary-blue);
  border-color: var(--color-primary-blue);
}

.pokemon-card.selected {
  border-color: var(--color-primary-blue);
  box-shadow: 0 0 35px var(--color-primary-blue);
  transform: scale(1.1);
}

.pokemon-card img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 5px var(--color-primary-pink));
}

.pokemon-tooltip {
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: #111118;
  border: 1px solid var(--color-primary-pink);
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 13px;
  color: var(--color-text-primary);
  box-shadow: 0 0 15px var(--color-primary-pink);
  z-index: 10;
  white-space: normal;
  top: 105%;
  bottom: auto;
}

</style>
