<template>
  <div class="about-wrapper">
    <h1>About Pokémon Battle Game</h1>

    <section>
      <h2>Game Mechanics</h2>
      <p>
        This game allows you to select your Pokémon and battle against an opponent.
        Each Pokémon has unique abilities, strengths, and weaknesses.
        Use your strategy to pick moves wisely and win battles!
      </p>
    </section>

    <section>
      <h2>Abilities</h2>
      <ul>
        <li><strong>Basic Attack:</strong> Always available, does standard damage.</li>
        <li><strong>Special Attack:</strong> More powerful but has cooldown.</li>
        <li><strong>Defense Moves:</strong> Can reduce incoming damage.</li>
        <li><strong>Healing Moves:</strong> Restore your Pokémon’s health.</li>
      </ul>
    </section>

    <section>
      <h2>Victory Conditions</h2>
      <p>
        Reduce your opponent’s HP to zero to win the battle.
        Keep an eye on your cooldowns and plan your moves carefully.
      </p>
    </section>

  </div>
</template>

<script setup>
</script>

<style scoped>
.about-wrapper {
  max-width: 900px;
  margin: 50px auto;
  background: #111118;
  padding: 30px 40px;
  border-radius: 14px;
  box-shadow: 0 0 40px var(--color-primary-pink);
  color: var(--color-text-primary);
  font-family: 'Orbitron', monospace;
}

h1 {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 0 10px var(--color-primary-pink);
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  text-shadow: 0 0 6px var(--color-primary-pink);
}

p, ul {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 25px;
}

ul {
  padding-left: 20px;
  list-style-type: disc;
}
</style>
