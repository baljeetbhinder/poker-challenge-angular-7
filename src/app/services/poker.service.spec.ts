import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { PokerService } from './poker.service';
import { PokerComponent } from '../components/poker/poker.component';

describe('PokerService', () => {

  let component: PokerComponent;
  let fixture: ComponentFixture<PokerComponent>;
  let pkrSvc: PokerService;

  beforeEach(() => {

    TestBed.configureTestingModule({

      declarations: [ PokerComponent ],
      imports: [FormsModule],
      providers: [PokerService]

    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    pkrSvc = TestBed.get(PokerService);
  });

  it('should be created', () => {
    expect(pkrSvc).toBeTruthy();
  });

  it('should contain all the 7 ranks with accurate rank', () => {

    let must_have_ranks = [
      'four_of_a_kind',
      'full_house',
      'straight',
      'three_of_a_kind',
      'two_pair',
      'pair',
      'high_card',
    ];

    let ranks = Object.keys(pkrSvc.ranks);

    must_have_ranks.forEach( (rank, rank_index) => {

      expect(ranks).toContain( rank );

      expect( ranks.indexOf( rank ) ).toBe( rank_index);
    });

  });


  it('should denominate a hand correctly', () => {

    let denom = pkrSvc.getHandDenomination( '55JQQ'.split('') );

    expect ( Object.keys(denom).length ).toBe(3);

    expect( denom ).toEqual(

      jasmine.objectContaining({
        '5':2,
        'J':1,
        'Q':2
      })
    );


    let denomination = pkrSvc.getHandDenomination( '23456'.split('') );
    expect ( Object.keys(denomination).length ).toBe(5);

    expect( denomination ).toEqual(

      jasmine.objectContaining({
        '2':1,
        '3':1,
        '4':1,
        '5':1,
        '6':1
      })
    );

  });


  it('should calculate index strength of a hand accurately', () => {

    expect ( pkrSvc.getIndexStrengthByHand( '23456', component.symbols ) ).toBe(10);

    expect ( pkrSvc.getIndexStrengthByHand( 'TJQKA', component.symbols ) ).toBe(50);

  });


  it('should return rank and rank_strength of the hand correctly ', () => {

    // Check 1
    let player:any = {
      value: '44445',
      is_valid: true
    };

    player.index_strength = pkrSvc.getIndexStrengthByHand( player.value, component.symbols );
    player.denomination   = pkrSvc.getHandDenomination( player.value.split('') );

    expect ( pkrSvc.getRankByHand( player, component.symbols ) ).toEqual(

      jasmine.objectContaining(pkrSvc.ranks.four_of_a_kind)
    );

    expect( player.rank_strength ).toBe( 8 );

    // Check 2
    let player2:any = {
      value: '952KQ',
      is_valid: true
    };

    player2.index_strength = pkrSvc.getIndexStrengthByHand( player2.value, component.symbols );
    player2.denomination   = pkrSvc.getHandDenomination( player2.value.split('') );

    expect ( pkrSvc.getRankByHand( player2, component.symbols ) ).toEqual(

      jasmine.objectContaining(pkrSvc.ranks.high_card)
    );

    expect( player2.rank_strength ).toBe( 10 );

  });


  it('should fetch key by value', () => {

    let obj = { 'k':2, '3':4, '5':1, '8': 'T' }

    for(let key in obj)
      expect( pkrSvc.getKeyByValue( obj, obj[key] ) ).toBe( key );

  });


  it('should check if a hand is consecutive', () => {

    let hands = {

      '2345': false,
      '23456': true,
      'TJQKA': true,
      '44558': false,
      '98765': true,
    };

    for (let hand in hands) {

      let denom   = pkrSvc.getHandDenomination( hand.split('') );

      expect( pkrSvc.isHandConsecutive( denom, component.symbols) ).toBe( hands[hand] );
    }

  });


  it('should calculate results', () => {

    let tbl_hnds = [
      // Winner a
      [{
        value: 'AAAKK',
        is_valid: true,
        expected_win: true,
        expected_rank: pkrSvc.ranks.full_house.rank,
      },
      {
        value: '23456',
        is_valid: true,
        expected_win: false,
        expected_rank: pkrSvc.ranks.straight.rank,
      }],

      // Tie ab
      [{
        value: 'TT8A9',
        is_valid: true,
        expected_win: true,
        expected_rank: pkrSvc.ranks.pair.rank,
      },
      {
        value: 'TTA89',
        is_valid: true,
        expected_win: true,
        expected_rank: pkrSvc.ranks.pair.rank,
      }],

      // Winner b
      [{
        value: 'A2345',
        is_valid: true,
        expected_win: false,
        expected_rank: pkrSvc.ranks.straight.rank,
      },
      {
        value: '23456',
        is_valid: true,
        expected_win: true,
        expected_rank: pkrSvc.ranks.straight.rank,
      }],
      //
    ];

    let tbl_hnds_res  = pkrSvc.calculateResults(tbl_hnds, component.symbols);

    tbl_hnds_res.forEach( (pair, pair_index) => {

      let hand1 = pair[0];
      let hand2 = pair[1];

      expect( hand1.is_winner ).toBe( hand1.expected_win );
      expect( hand1.rank.rank ).toBe( hand1.expected_rank );

      expect( hand2.is_winner ).toBe( hand2.expected_win );
      expect( hand2.rank.rank ).toBe( hand2.expected_rank );
    });

  });

});
