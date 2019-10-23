import { Component } from '@angular/core';

import { Pair } from '../../interfaces/datatypes.interface';

import { PokerService } from '../../services/poker.service';


@Component({

  selector: 'poker',

  templateUrl: './poker.component.html',

  styleUrls: [ './poker.component.css' ]

})


export class PokerComponent  {



  constructor( private pkrSvc: PokerService ) {}



  // # of pairs to be calculated
  tables:number=1;



  table_hands:Array<Pair>=[];



  // symbols to depict cards of the deck 
  symbols:Array<string>=['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];



  // keyboard key codes of the selected symbols of the cards
  allowedKeys:Array<number>=[50,51,52,53,54,55,56,57, 84,116, 74,106, 81,113, 75,107, 65,97];




  /** 
   * Upon initialization of the component
   * @dev Baljeet Bhinder
   * 
   */
  ngOnInit(){


    // pair of hands must be max 10 & min 1
    this.validateTablesCount(); 


    // Reset the initial hands to empty 
    this.resetHandValidators();

  }



  /** 
   * Validation to make sure pair of hands do not jump off the limit
   * @dev Baljeet Bhinder
   * 
   */
  validateTablesCount (){


    this.table_hands = [];


    if(this.tables > 10) this.tables = 10;


    else if(this.tables < 1) this.tables = 1;
    

    for(let i = 0; i<this.tables; i++){


      this.table_hands[i] = [{value:'', is_valid:true}, {value:'', is_valid:true}];
    }
  }



  /** 
   * Only allow valid card symbols to be inserted in the boxes
   * @dev Baljeet Bhinder
   * 
   */
  validateHand(e){


    return this.allowedKeys.includes(e.keyCode);
  }




  /** 
   * Before start processing validate everything
   * 1. all the hands should have 5 cards
   * 2. Card count in the pair must be correct there shouldn;t be more than 4 Queens etc.
   * @dev Baljeet Bhinder
   * 
   */
  validate(){


    this.resetHandValidators( true );


    let is_card_count_valid = true;


    this.table_hands.forEach(pair => {



      let hand1 = pair[0];
      let hand2 = pair[1];



      if(hand1.value.length != 5 )
        hand1.is_valid = is_card_count_valid = false;



      if(hand2.value.length != 5 )
        hand2.is_valid = is_card_count_valid = false;



      if( !hand1.is_valid ||  !hand2.is_valid)
      return false;



      if(is_card_count_valid)
      is_card_count_valid = this.isCardCountValid(hand1.value, hand2.value);



      if(!is_card_count_valid)
        hand1.is_valid = hand2.is_valid = false;   


    });



    if (!is_card_count_valid) return false;


    this.table_hands = this.pkrSvc.calculateResults(this.table_hands, this.symbols);

  }




  /** 
   * Empty the hands & reset them to their initial state
   * @arg keep_values to reset just other stuff like validations except values
   * @dev Baljeet Bhinder
   * 
   */
  resetHandValidators( keep_values = false ){

    let table_hands_backup = this.table_hands;

    this.table_hands = [];

    for (let i = 0; i < table_hands_backup.length; i++) {


      this.table_hands.push([
        
        { value: '', is_valid: true },
        
        { value: '', is_valid: true }

      ]);



      if(keep_values) {


        this.table_hands[i][0].value = table_hands_backup[i][0].value;

        this.table_hands[i][1].value = table_hands_backup[i][1].value;
      }

    }

  }




  /** 
   * Ensure that the card count of a pair is valid
   * There should not be anyone cheating 
   * @dev Baljeet Bhinder
   * 
   */
  isCardCountValid (hand1, hand2) {



    let is_valid 	= true;


    let hands 		= (hand1+hand2).split('').sort( (a, b) => a - b );


    let uniq 		  = hands.filter((val, idx, hands) => hands.indexOf(val) == idx);


    for (var i = 0; i < uniq.length; i++) {


      let symbol_count = hands.filter(v => v == uniq[i] ).length;


      // Apply card count check as there can;t be more than 4 cards of any type
      if(symbol_count > 4)
        return is_valid = false;
    }


    return is_valid;

  }


}
