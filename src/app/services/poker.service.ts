import { Injectable } from '@angular/core';

@Injectable()
export class PokerService {


  /**
   * Application wide ranks for the game of poker
   *
   */
  ranks:any = {


    'four_of_a_kind'	: {

      rank: 1,

      name: 'Four Of A Kind'
    },


    'full_house'		: {

      rank: 2,

      name: 'Full House'
    },


    'straight'			: {

      rank: 3,

      name: 'Straight'
    },


    'three_of_a_kind'	: {

      rank: 4,

      name: 'Three Of A Kind'
    },


    'two_pair'			: {

      rank: 5,

      name: 'Two Pair'
    },


    'pair'				: {
      rank: 6,
      name: 'Pair'
    },


    'high_card'			: {

      rank: 7,

      name: 'High Card'
    }


  };



  /**
   * Perform steps one by one to gather data for results
   * @arg table_hands [Object]
   * @arg symbols [Array]
   * @ret table_hands [Object]
   * @dev Baljeet Bhinder
   *
   */
  calculateResults (table_hands, symbols){



    table_hands.forEach(pair =>{



      let player1 = pair[0];
      let player2 = pair[1];



      player1.denomination = this.getHandDenomination( player1.value.split('').sort() )


      player2.denomination = this.getHandDenomination( player2.value.split('').sort() )




      //---------------------------------
      // Useful in case of a tie
      //---------------------------------

      player1.index_strength = this.getIndexStrengthByHand( player1.value, symbols );
      player2.index_strength = this.getIndexStrengthByHand( player2.value, symbols );

      //---------------------------------




      //------------------------------
      // Get rank of each player
      //------------------------------

      player1.rank = this.getRankByHand(player1, symbols);
      player2.rank = this.getRankByHand(player2, symbols);


      //------------------------------


      pair = this.decideWinner(pair);


    });

    return table_hands;


  }


  /**
   * Declare the winner based on the values
   * calculated of the cards
   * @arg pair [Object]
   * @ret pair [Object]
   * @dev Baljeet Bhinder
   *
   */
  decideWinner ( pair ) {


    let player1 = pair[0];
    let player2 = pair[1];



    //--------------------
    // Player 1 wins
    //--------------------

    if( player1.rank.rank < player2.rank.rank ) {

      player1.is_winner = true;
      player2.is_winner = false;
    }


    //--------------------
    // Player 2 wins
    //--------------------

    else if ( player2.rank.rank < player1.rank.rank ){

      player1.is_winner = false;
      player2.is_winner = true;
    }



    //--------------------
    // Possible Tie
    //--------------------

    else {

      pair = this.applyTieBraker ( pair );
    }

    //--------------------



    return pair;

  }



  /**
   * To break the tie apply secondary methods
   * if the ranks are same
   * @arg pair [Object]
   * @ret pair [Object]
   * @dev Baljeet Bhinder
   *
   */
  applyTieBraker ( pair ) {


    let player1 = pair[0];
    let player2 = pair[1];



    //-----------------------------------------------
    // First compare rank strength to break the tie
    //-----------------------------------------------

    if( player1.rank_strength > player2.rank_strength ) {

      player1.is_winner = true;
      player2.is_winner = false;
    }

    else if ( player2.rank_strength > player1.rank_strength ) {

      player1.is_winner = false;
      player2.is_winner = true;
    }

    //-----------------------------------------------




    //-----------------------------------------------
    // Then compare index strength to break the tie
    //-----------------------------------------------

    else{


      if( player1.index_strength > player2.index_strength ) {

        player1.is_winner = true;
        player2.is_winner = false;
      }


      else if ( player2.index_strength > player1.index_strength ) {

        player1.is_winner = false;
        player2.is_winner = true;
      }


      // If nothing breaks the tie both are winners
      else {

        player1.is_winner = true;
        player2.is_winner = true;
      }

    }


    //-----------------------------------------------



    return pair;

  }



  /**
   * Distribute hand into its denomination
   * used for further comparison
   * @arg hand [Object]
   * @ret hand_denomination [Object]
   * @dev Baljeet Bhinder
   *
   */
  getHandDenomination(hand) {


    let hand_denomination:any = {};

    hand.map(card_number => {


	  	!(card_number in hand_denomination)
        ?
        hand_denomination[card_number] = 1
        :
        hand_denomination[card_number]++;


    });



    return hand_denomination;
  }



  /**
   * To calculate the index strength of a hand
   * will be used to break the tie if need be
   * @arg hand [Object]
   * @arg symbols [Object]
   * @ret strength [Number]
   * @dev Baljeet Bhinder
   *
   */
  getIndexStrengthByHand ( hand, symbols ) {



    let strength = 0;


    for (let i = 0; i < hand.length; i++)
      strength += symbols.indexOf(hand[i]);



    return strength;
  }




  /**
   * Calculate Player rank and their corresponding rank strength
   * Rank strength will be used to decide winner if ranks are same
   * @arg player [Object]
   * @ret Object
   * @dev Baljeet Bhinder
   *
   */
  getRankByHand( player, symbols ) {




    let hand = player.value;

    let all_card_counts = Object.values( player.denomination );




    //-----------------
    // Four of a kind
    //-----------------

    let is_four_of_a_kind:any = all_card_counts.find( v => v == 4 );

    if( is_four_of_a_kind ) {


      let symbol = this.getKeyByValue(player.denomination, is_four_of_a_kind);

      let symbol_index = symbols.indexOf(symbol);

      player.rank_strength = symbol_index * is_four_of_a_kind;

      return this.ranks.four_of_a_kind;
    }

    //-----------------




    //------------------------------------
    // Full house - 3 of a kind + a pair
    //------------------------------------

    let is_three_of_a_kind:any = all_card_counts.find( v => v == 3 );

    let is_pair:any = all_card_counts.find( v => v == 2 );

    if ( is_three_of_a_kind && is_pair ) {

      let symbol1 = this.getKeyByValue(player.denomination, is_three_of_a_kind);
      let symbol2 = this.getKeyByValue(player.denomination, is_pair);

      let symbol1_index = symbols.indexOf(symbol1);
      let symbol2_index = symbols.indexOf(symbol2);

      player.rank_strength = symbol1_index * is_three_of_a_kind;
      player.rank_strength += symbol2_index * is_pair;

      return this.ranks.full_house;
    }

    //------------------------------------



    //-------------------
    // Straight
    //-------------------

    if( this.isHandConsecutive( player.denomination, symbols ) ) {


      // if Ace was treated lower reduce the rank strength
      if(hand[0]=='A')
      player.index_strength -= symbols.indexOf('A');


      player.rank_strength = player.index_strength;


      return this.ranks.straight;
    }

    //-------------------



    //---------------
    // 3 of a kind
    //---------------

    if ( is_three_of_a_kind ) {

      let symbol = this.getKeyByValue(player.denomination, is_three_of_a_kind);

      let symbol_index = symbols.indexOf(symbol);

      player.rank_strength = symbol_index * is_three_of_a_kind;

      return this.ranks.three_of_a_kind;
    }

    //---------------



    //---------------
    // 2 Pair
    //---------------

    let pairs = all_card_counts.filter(v => v==2);

    if( pairs.length == 2 ) {

      player.rank_strength = 0;

      for(let key in player.denomination) {

        if( player.denomination[key] == 2 ){

          let symbol = key;

          let symbol_index = symbols.indexOf(symbol);

          player.rank_strength += symbol_index * 2;
        }
      }

      return this.ranks.two_pair;
    }

    //---------------



    //---------------
    // Pair
    //---------------

    if( is_pair ) {

    let symbol = this.getKeyByValue(player.denomination, is_pair);

    let symbol_index = symbols.indexOf(symbol);

    player.rank_strength = symbol_index * is_pair;

      return this.ranks.pair;
    }

    //---------------



    //--------------------------
    // Default rank assignment
    //--------------------------


    // Rank strength will be of the highest card in this case

    let highest_card = player.value.split('').sort((a,b) => a-b).pop();


    player.rank_strength = symbols.indexOf(highest_card);


    return this.ranks.high_card;

    //--------------------------



  }



  /**
   * To get the key from object based on its value
   * @arg obj [Object]
   * @arg value [Number | String | Boolean | Any]
   * @ret key [String]
   * @dev Baljeet Bhinder
   *
   */
  getKeyByValue(obj, value) {


    return Object.keys(obj).find(key => obj[key] == value);
  }




  /**
   * Check consecutivity of the hand
   * @arg hand [String]
   * @symbols [Object]
   * @ret is_consecutive [Boolean]
   * @dev Baljeet Bhinder
   *
   */
  isHandConsecutive ( hand, symbols ) {



    let indexes 		= [];
    let is_consecutive 	= true;



    //------------------------------------------------------
    // Straight counts only for 5 consecutives - no lesser
    //------------------------------------------------------

    if( Object.keys(hand).length < 5 ) return false;

    //------------------------------------------------------




    //-------------------------------------
    // Convert symbols into their indexes
    //-------------------------------------

    Object.keys( hand ).map(e => indexes.push( symbols.indexOf(e) ) )

    // Sort the indexes array ascending
    indexes = indexes.sort((a, b) => a - b);

    //-------------------------------------



    //---------------------------------
    // 'Aces' can be lower as well
    //---------------------------------

    if( indexes[0] == symbols.indexOf('2') && indexes.includes( symbols.indexOf('A') ) ) {


      // Replace A index with -1 to make it the lowest index
      indexes[ indexes.indexOf( symbols.indexOf('A') ) ] = -1;


      // Resort the array
      indexes = indexes.sort((a, b) => a - b);
    }

    //---------------------------------



    //---------------------------------
    // Consecutivity Check
    //---------------------------------

    for (let i = 1; i < indexes.length; i++)
      if (indexes[i - 1] != indexes[i] - 1) return is_consecutive = false;

    //---------------------------------



    return is_consecutive;



  }

}
