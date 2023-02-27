<script setup lang="ts">
import { useMemoryStore } from '@/store/memory-store';
import { onMounted } from 'vue';

const memory = useMemoryStore()

onMounted(() => {
  memory.deck = [...Array(36).keys()]
    .map(i => i < 9 ? `memoryCards-0${i + 1}` : `memoryCards-${i + 1}`)
})

</script>

<template>
  <button @click="memory.shuffle(2)">shuffle 2</button>
  <button @click="memory.shuffle(4)">shuffle 4</button>
  <button @click="memory.shuffle()">shuffle</button>

{{ memory.deckIsHidden }}
  <div class="card__container" v-if="!memory.deckIsHidden">
    <div v-for="card, i in memory.cards" :key="i" @click="memory.process(card)" class="card"
      :class="{ 'flipped': card.isFlipped, 'hidden': card.isHidden }">
      <img :src="`/img/cards/${card.img}.png`" class="card--face" />
      <img src="/img/cards/memoryCards-37.png" />
    </div>
  </div>
  <h1>found {{ memory.parisFound }}</h1>
</template>

<style lang="sass" scoped>
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