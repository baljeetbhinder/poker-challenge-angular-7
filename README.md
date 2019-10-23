# Poker Challenge - Angular 7 !!
Given two five-card poker hands dealt from a modified 52 card deck, classify each hand and determine which hand is the winner (there may be a tie).

The modified 52 card deck is based on a standard 52 card deck without any suits. The deck contains four cards of each rank from 2 through Ace. Tens are represented by a 'T', Jacks are a 'J', Queens are a 'Q', Kings are 'K' and Aces are 'A'. All other cards are represented by their numerical value 2 through 9. Aces can be high (ranked higher than a King) or low (ranked lower than a 2).

**The possible hands in order of ranking from lowest to highest are:**

- HIGHCARD (if you don't have anything else the highest card in your hand, A2467)
- PAIR (any two cards of same value, AA234)
- TWOPAIR (two pairs, AA223)
- THREEOFAKIND (any three cards of same value, KKK23)
- STRAIGHT (five cards in order, 23456)
- FULLHOUSE (a pair and three of a kind, AAKKK)
- FOUROFAKIND (four cards of same value, AAAA2)



See the [https://en.wikipedia.org/wiki/List_of_poker_hands](https://en.wikipedia.org/wiki/List_of_poker_hands) for rules on comparing poker hands including how to compare two hands of the same rank. Note that because both hands are dealt from the same 52 card deck some combinations are not possible. For example, two players cannot both have JJQQQ because that would require six Queen cards when there are only four in the deck (unless somebody is cheating!)
## Ideal Requirements

- node **v12.13.0**
- npm **6.12.0**
- ng cli **7.0.7**

# Steps to Install
- git clone
- npm install
- ng serve

# Running Unit Tests
- ng test

# Contact Me
Coded With &hearts; by [Baljeet Bhinder](mailto:contact@baljeetbhinder.ca)
> Feel free to drop me an email at **contact@baljeetbhinder.ca**

```
```
