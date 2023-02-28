<script setup lang="ts">
import { useMemoryStore } from '@/store/memory-store';
import { onMounted, ref, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core'

const memory = useMemoryStore()
const numberOfCards = ref(12)
const numberOfCardsOptions = [
  { value: 3, label: 'test' },
  { value: 12, label: 'einfach' },
  { value: 24, label: 'mittel' },
  { value: 36, label: 'schwer' },
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
      <!-- <q-select v-model="numberOfCards">
        <q-option v-for="item in numberOfCardsOptions" :key="item.number" :label="item.label" :value="item.number" />
      </q-select> -->

      <q-slider
        v-model="numberOfCards"
        :data="numberOfCardsOptions"
      />

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
    <q-button @click="newGame">Neues Spiel</q-button>
  </div>

  <transition name="modal">
    <div  v-if="memory.isComplete" class="modal__mask">
      <div class="modal__container">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 modal__close"
          @click="newGame">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h1>Gratulation</h1>
        <p>Geschafft mit {{ memory.turns }} Versuchen</p>
        <q-button @click="newGame">Neues Spiel</q-button>
      </div>
    </div>
  </transition>
</template>

<style lang="sass" >
.modal
  &__mask
    position: fixed
    z-index: 999
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    display: flex
    justify-content: center
    align-items: center
    transition: opacity 0.3s ease
  &__close
    width: 2rem
    position: absolute
    right: 1rem
    top: 1rem
  &__container
    background-color: #343434
    padding: 2rem
    border-radius: 2rem
    width: 50%
    text-align: center
    position: relative
    h1
      margin: 0.5rem
    p
      margin-bottom: 1rem

.modal-enter-from, .modal-leave-to 
  opacity: 0

.modal-enter-active .modal-container,
.modal-leave-active .modal-container 
  -webkit-transform: scale(1.1)
  transform: scale(1.1)

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

.q-slider  
  max-width: 16rem

.q-slider-captions__caption
  color: var(--c-text)  
.q-slider-captions__caption_active  
  color: #fff

@media (min-width: 500px)
  .deck__header
    flex-direction: row
</style>