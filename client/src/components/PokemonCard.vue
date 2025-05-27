<template>
  <!-- eğer pokemon objesi varsa kartı göstermek için v-if -->
  <div v-if="pokemon" class="pokemon-card-wrapper">
    <!-- pokemon kartı seçili ise selected sınıfı eklenir tıklama eventi emit edilir -->
    <div class="pokemon-card" :class="{ selected }" @click="emitClick">
      <!-- Pokémon görseli -->
      <img :src="pokemon.image" />
      <!-- Pokémon ismi -->
      <h3>{{ pokemon.name }}</h3>
      <!-- Pokémon tipi -->
      <p>{{ pokemon.type }}</p>
    </div>

    <!-- kart üzerine hover yapıldığında gösterilecek detaylı bilgi kutusu -->
    <div class="pokemon-tooltip">
      <p><strong>Type:</strong> {{ pokemon.type }}</p>
      <p><strong>Strong:</strong> {{ pokemon.strongAgainst.join(', ') }}</p>
      <p><strong>Weak:</strong> {{ pokemon.weakAgainst.join(', ') }}</p>
      <p><strong>HP:</strong> {{ pokemon.hp }}</p>
      <p><strong>Basic:</strong> {{ pokemon.basicAttack.name }} ({{ pokemon.basicAttack.power }})</p>
      <p><strong>Abilities:</strong></p>
      <!-- pokemonun sahip olduğu özel yeteneklerin listesi -->
      <ul>
        <li v-for="(a, i) in pokemon.abilities" :key="i">
          {{ a.name }} ({{ a.power }} power, Cooldown: {{ a.cooldown }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>

// props olarak parent bileşenden gelen pokemon objesi ve seçili olup olmadığını alıyoruz, kontrol için
const props = defineProps({
  pokemon: Object,
  selected: Boolean
})

// select eventini parenta göndermek için emit tanımı
const emit = defineEmits(['select'])

// kart tıklandığında select eventini pokemon objesiyle emit eder
const emitClick = () => emit('select', props.pokemon)
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
  display: none;
  position: absolute;
  top: 105%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background: #111118;
  border: 1px solid var(--color-primary-pink);
  border-radius: 12px;
  padding: 12px 15px;
  font-size: 13px;
  color: var(--color-text-primary);
  box-shadow: 0 0 15px var(--color-primary-pink);
  z-index: 10;
  white-space: normal;
}

.pokemon-card-wrapper:hover .pokemon-tooltip {
  display: block;
}

.pokemon-tooltip ul {
  padding-left: 16px;
  margin: 4px 0 0;
}

.pokemon-tooltip li {
  margin-bottom: 4px;
  font-size: 12px;
}
</style>
