import { defineStore } from "pinia";
import { fisherYatesShuffle } from "@/utils/helper";

interface MemoryState {
    deck: string[];
    cards: ICard[];
    openCards: ICard[];
    parisFound: number;
    deckIsHidden: Boolean;
    turns: number;
    gameMode: string;
    searchN: number;
    searchCard: ICard; 
}

interface ICard {
    img: string;
    isFlipped: boolean;
    isHidden: boolean;
}

export const useMemoryStore = defineStore("memory", {
    state: (): MemoryState => ({
        deck: [],
        cards: [],
        openCards: [],
        parisFound: 0,
        deckIsHidden: false,
        turns: 0,
        gameMode: "classic",
        searchN: 0,
        searchCard: {
            img: "memoryCards-37",
            isFlipped: false,
            isHidden: false,
        },
    }),
    getters: {
      isComplete(state){
        return state.cards.filter(c=>!c.isHidden).length === 0
      }
    },
    actions: {
        async shuffle(n: number = 0) {
            console.log("shuffle");
            this.turns = 0;
            this.deckIsHidden = true;
            this.parisFound = 0;
            if (n === 0 || n > this.deck.length) n = this.deck.length;

            let cardSelection = fisherYatesShuffle<string>(this.deck);
            cardSelection = cardSelection.slice(0, n);

            this.cards = [];
            if (this.gameMode == "mutation") {
                cardSelection.forEach((face, index) => {
                    this.cards[index] = {
                        img: face,
                        isFlipped: true,
                        isHidden: false,
                    };
                });
                this.searchN = Math.floor(Math.random() * n);
                Object.assign(this.searchCard, this.cards[this.searchN]);
                this.searchCard.isFlipped = false;
                await setTimeout(() => {
                    this.cards.map((c) => (c.isFlipped = false));
                    this.searchCard.isFlipped = true;
                }, 5500);
            } else {
              fisherYatesShuffle([...cardSelection, ...cardSelection]).forEach((face, index) => {
                this.cards[index] = {
                  img: face,
                  isFlipped: false,
                  isHidden: false,
                };
              });
            }

            await setTimeout(() => {
                this.deckIsHidden = false;
            }, 500);
        },
        process(card: ICard) {
            if (card.isHidden || card.isFlipped || this.openCards.length === 2)
                return;
            card.isFlipped = !card.isFlipped;

            if (this.gameMode == "mutation") {
                console.log("pro");
                this.turns += 1;
                if (card.img === this.searchCard.img) {
                    console.log("richtig");
                    setTimeout(() => {
                      card.isHidden = true;
                      let newSearch = this.cards.filter(c=>!c.isHidden).sort(() => 0.5 - Math.random())[0]
                      Object.assign(this.searchCard, newSearch);
                      this.searchCard.isFlipped = true
                  }, 800);                  
                } else {
                    setTimeout(() => {
                        card.isFlipped = false;
                    }, 800);
                }
            } else {
                this.openCards.push(card);
                if (this.openCards.length === 2) {
                    this.turns += 1;
                    if (this.openCards[0].img === this.openCards[1].img) {
                        //eventuell sleep?
                        this.openCards.forEach((i) => (i.isHidden = true));
                        this.parisFound += 1;
                        this.openCards.length = 0;
                        setTimeout(() => {
                            this.openCards.map((c) => (c.isHidden = true));
                        }, 800);
                    } else {
                        setTimeout(() => {
                            this.openCards.forEach(
                                (i) => (i.isFlipped = false)
                            );
                            this.openCards.length = 0;
                        }, 800);
                    }
                }
            }
        },
    },
});
