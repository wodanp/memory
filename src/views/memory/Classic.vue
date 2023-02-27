<script setup lang="ts">
import { useMemoryStore } from '@/store/memory-store';
import { onMounted, ref, watch } from 'vue';

const memory = useMemoryStore()
const numberOfCards = ref(12)
const numberOfCardsOptions = [
  { number: 3, label: 'test' },
  { number: 12, label: 'einfach' },
  { number: 24, label: 'mittel' },
  { number: 36, label: 'schwer' },
]

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

</script>

<template>
  <div>
    <div class="deck deck__header">
      <h3>turns: {{ memory.turns }}</h3>
      <q-select v-model="numberOfCards">
        <q-option v-for="item in numberOfCardsOptions" :key="item.number" :label="item.label" :value="item.number" />
      </q-select>
    </div>
    
  </div>

  <div class="card__container" v-if="!memory.deckIsHidden">
    <div v-for="card, i in memory.cards" :key="i" @click="memory.process(card)" class="card"
      :class="{ 'flipped': card.isFlipped, 'hidden': card.isHidden }">
      <img :src="`/img/cards/${card.img}.png`" class="card--face" />
      <img src="/img/cards/memoryCards-37.png" />
    </div>
  </div>

  <div class="deck deck__footer">
    <q-button @click="newGame">New Game</q-button>
  </div>
</template>

<style lang="sass" scoped>
.deck
  display: flex
  justify-content: space-between
  margin: 1rem  
  &__header
    h3
      margin: 0
    .q-select
      width: 40%
  &__footer
    margin-top: 2rem
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
  width: 5rem 
  height: 5rem
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
    // -webkit-box-reflect: below 0 linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.4))
    // img
    //   height: 100%
    //   width: 100%
    //   object-fit: cover
  &--face
    transform: rotateX(0.5turn)

</style>