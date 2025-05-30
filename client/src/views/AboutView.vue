<template>
  <div class="about-wrapper">
    <h1>Welcome to Pokémon Battle Game</h1>

    <section class="intro">
      <p>
        This game allows players to choose their Pokémons and battle against opponents. Each Pokémon has unique abilities, and strategic gameplay is key to winning.
      </p>
    </section>

    <section class="mechanics">
      <h2>Abilities</h2>
      <ul>
        <li><strong>Normal Attack:</strong> Always available; basic attack.</li>
        <li><strong>Special Attack:</strong> Deals high damage but has cooldown restrictions.</li>
        <li><strong>Shield:</strong> Reduces incoming damage, providing strategic defense.</li>
        <li><strong>Heal:</strong> Restores your own health with a longer cooldown period.</li>
      </ul>
    </section>

    <section class="tips">
      <h2>Gameplay Tips</h2>
      <p>
        Pay attention to Pokémon types; some types are stronger against others. Winning requires smart strategy.
      </p>
    </section>
  </div>
</template>

<script setup>
// no dynamic data needed, static informational page
</script>

<style scoped>
.about-wrapper {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: #111118;
  border-radius: 14px;
  color: var(--color-text-primary);
  font-family: 'Orbitron', monospace;
}
h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  text-align: center;
  color: var(--color-primary-pink);
  text-transform: uppercase;
}
h2 {
  font-size: 2rem;
  margin-top: 30px;
  margin-bottom: 12px;
  color: var(--color-primary-blue);
  text-transform: uppercase;
}
ul {
  list-style: none;
  padding-left: 0;
}
li {
  margin-bottom: 10px;
  font-size: 1.1rem;
  line-height: 1.4;
}
p {
  font-size: 1.2rem;
  line-height: 1.5;
}
</style>
