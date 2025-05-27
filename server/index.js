const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); // JSON body okuyabilmek için

// Pokémon verisini oku
const pokemons = JSON.parse(fs.readFileSync('./data/pokemons.json', 'utf-8'));

// Battle log dosyası yolu
const BATTLE_LOG_PATH = './data/battles.json';


// GET /api/pokemons → tüm Pokémon'ları getir
app.get('/api/pokemons', (req, res) => {
    res.json(pokemons);
});

// GET /api/pokemons/:id → belirli bir Pokémon
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemon = pokemons.find(p => p.id === id);
    if (pokemon) {
        res.json(pokemon);
    } else {
        res.status(404).json({ error: 'Pokemon not found' });
    }
});

// POST /api/battle-log → yeni savaş sonucu kaydet
app.post('/api/battle-log', (req, res) => {
    const newEntry = req.body;
    const logs = JSON.parse(fs.readFileSync(BATTLE_LOG_PATH, 'utf-8'));
    logs.push(newEntry);
    fs.writeFileSync(BATTLE_LOG_PATH, JSON.stringify(logs, null, 2));
    res.status(201).json({ message: 'Battle log saved!' });
});

// GET /api/battle-history → tüm savaş geçmişini getir
app.get('/api/battle-history', (req, res) => {
    const logs = JSON.parse(fs.readFileSync(BATTLE_LOG_PATH, 'utf-8'));
    res.json(logs);
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
