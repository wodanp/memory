<script setup lang="ts">
import { useMemoryStore } from '@/store/memory-store';
import { onMounted, ref, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core'

const memory = useMemoryStore()
const numberOfCards = ref(12)
const numberOfCardsOptions = [
  { number: 3, label: 'test' },
  { number: 12, label: 'einfach' },
  { number: 24, label: 'mittel' },
  { number: 36, label: 'schwer' },
]

const deck = ref(null)
const cardWidth = ref('6rem')
useResizeObserver(deck, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  //       let cw = width/16/Math.sqrt(numberOfCards.value)
  //       console.log(cw)
  if (width > 1024) {
    cardWidth.value = `12rem`
  } else if (width > 800) {
    cardWidth.value = `9rem`
  } else {
    cardWidth.value = `6rem`
  }
  //         cardWidth.value = `${Math.round(cw*100)/100}rem` 
  //       }else if(cw){

  //       }
})

const newGame = () => {
  memory.shuffle(numberOfCards.value)
}


onMounted(() => {
  memory.deck = [...Array(36).keys()]
    .map(i => i < 9 ? `memoryCards-0${i + 1}` : `memoryCards-${i + 1}`)
  memory.shuffle(12)
})

watch(
  numberOfCards,
  (value) => {
    console.log('value ', value)
    memory.shuffle(value)
  }
)

const changeGameMode = (mode: string) => {
  memory.gameMode = mode
  memory.shuffle(numberOfCards.value)
}

</script>

<template>
  <div class="header">
    <h1 style="text-align: center; margin-bottom: 2rem;">Ein Spieler Memory</h1>
    <div class="deck deck__header">
      <q-select v-model="numberOfCards">
        <q-option v-for="item in numberOfCardsOptions" :key="item.number" :label="item.label" :value="item.number" />
      </q-select>

      <q-radio-group v-model="memory.gameMode" @change="changeGameMode">
        <q-radio value="classic" label="Klassisch"></q-radio>
        <q-radio value="mutation" label="Mutation"></q-radio>
      </q-radio-group>

      <h3>Versuche: {{ memory.turns }}</h3>


    </div>

  </div>

  <div v-if="!memory.deckIsHidden">
    <div v-if="memory.gameMode == 'mutation'" class="suche">
      <div class="card" :class="{ 'flipped': memory.searchCard.isFlipped, 'hidden': memory.searchCard.isHidden }">      
        <img :src="`/img/cards/${memory.searchCard.img}.png`"  class="card--face"/>
        <img src="/img/cards/memoryCards-37.png" />
    </div>
    </div>
    <div class="card__container"  ref="deck">
      <div v-for="card, i in memory.cards" :key="`mode${i}`" @click="memory.process(card)" class="card"
        :class="{ 'flipped': card.isFlipped, 'hidden': card.isHidden }">
        <img :src="`/img/cards/${card.img}.png`" class="card--face" />
        <img src="/img/cards/memoryCards-37.png" />
      </div>
    </div>
  </div>

  <div class="deck deck__footer">
    <q-button @click="newGame">New Game</q-button>
  </div>
</template>

<style lang="sass" >
.header
  width: 80vw
  margin: 1rem auto
  padding: 1rem 
  border-radius: 2rem
  background-color: #4f4d4d4d

.suche
  display: flex
  justify-content: center
  margin-bottom: 2rem
  border-bottom: 1px solid var(--c-text)
  padding-bottom: 1rem
.deck
  display: flex
  justify-content: space-between
  margin: 1rem  
  &__header
    h3
      margin: 0
    .q-select
      width: 40%
      max-width: 10rem
    margin-bottom: 2rem
    flex-direction: column
    gap: 0.5rem
  &__footer
    margin-top: 2rem
    padding-bottom: 3rem
    justify-content: center
.card 
  background-color: #4f4d4d4d
  &__container
    display: flex
    flex-wrap: wrap
    gap: 1rem
    justify-content: center
    margin: 1rem
  position: relative
  width: v-bind('cardWidth')
  aspect-ratio: 1
  border-radius: 1rem
  cursor: pointer
  transition: 1s ease-in-out
  transform-style: preserve-3d
  &.flipped
    transform: rotateX(0.5turn)
  &.hidden img
    visibility: hidden  
  img
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    backface-visibility: hidden
    transition: 1s ease-in-out
    border-radius: 1rem
  &--face
    transform: rotateX(0.5turn)

.q-input__inner  
  box-shadow: none

.q-radio__label
  color: var(--c-text) 

@media (min-width: 500px)
  .deck__header
    flex-direction: row
</style>