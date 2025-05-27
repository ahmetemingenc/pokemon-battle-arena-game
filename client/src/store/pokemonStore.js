// piniadan defineStore fonksiyonunu import ediyoruz
import { defineStore } from 'pinia'

// pokemon isimli store tanımı
export const usePokemonStore = defineStore('pokemon', {

    state: () => ({
        player: null,   // oyuncunun seçtiği pokemon objesi
        opponent: null, // rakibin seçtiği pokemon objesi
        winner: null    // oyunu kazanan taraf
    }),

    // store üzerinde yapılacak işlemler
    actions: {

        setPlayer(pokemon) {
            this.player = pokemon
        },

        setOpponent(pokemon) {
            this.opponent = pokemon
        },

        setWinner(result) {
            this.winner = result
        }
    }
})
