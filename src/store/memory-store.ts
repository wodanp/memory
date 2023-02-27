import { defineStore } from 'pinia';
import { fisherYatesShuffle } from '@/utils/helper';

interface MemoryState {
  deck: string[];
  cards: ICard[];
  openCards: ICard[];
  parisFound: number;
  deckIsHidden: Boolean;
}

interface ICard {
  img: string;
  isFlipped: boolean;
  isHidden: boolean;
}

export const useMemoryStore = defineStore('memory', {
  state: (): MemoryState => ({
    deck: [],
    cards: [],
    openCards: [],
    parisFound: 0,
    deckIsHidden: false
  }),
  actions: {
    shuffle(n: number = 0) {
      // this.deckIsHidden = true
      this.parisFound = 0
      if (n === 0 || n > this.deck.length) n = this.deck.length;
      
      // this.cards.map(c => c.isFlipped = false)

      let cardSelection = fisherYatesShuffle<string>(this.deck);
      cardSelection = cardSelection.slice(0, n);

      // cardSelection = fisherYatesShuffle([...cardSelection, ...cardSelection])
      // console.log(cardSelection)

      this.cards = [];
      // [...cardSelection, ...cardSelection].forEach((face, index) => {
      fisherYatesShuffle([...cardSelection, ...cardSelection]).forEach((face, index) => {
        this.cards[index] = {
          img: face,
          isFlipped: false,
          isHidden: false,
        };
      });
      // setTimeout(() => {
      //   this.deckIsHidden = false
      // }, 500);
    },
    process(card: ICard) {
      if (card.isHidden || card.isFlipped || this.openCards.length === 2) return;
      card.isFlipped = !card.isFlipped;

      this.openCards.push(card);
      if (this.openCards.length === 2) {
        if (this.openCards[0].img === this.openCards[1].img) {
          //eventuell sleep?
          this.openCards.forEach((i) => (i.isHidden = true));
          this.parisFound += 1;
          this.openCards.length = 0;
          setTimeout(() => {
            this.openCards.map(c => c.isHidden = true)
          }, 800);
        } else {
          setTimeout(() => {
            this.openCards.forEach((i) => (i.isFlipped = false));
            this.openCards.length = 0;
          }, 800);
        }
      }
    },
  },
});
