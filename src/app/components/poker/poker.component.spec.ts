import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PokerComponent } from './poker.component';
import { FormsModule } from '@angular/forms';
import { PokerService } from '../../services/poker.service';
import { By } from "@angular/platform-browser";

describe('PokerComponent', () => {

  let component: PokerComponent;
  let fixture: ComponentFixture<PokerComponent>;
  let title_el;
  let total_num_of_pairs_el;
  let all_hands_el;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokerComponent ],
      imports: [FormsModule],
      providers: [PokerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerComponent);
    component = fixture.componentInstance;


    title_el = fixture.debugElement.query( By.css('#title') ).nativeElement;

    total_num_of_pairs_el = fixture.debugElement.query( By.css('#pair_of_hands') ).nativeElement;
    total_num_of_pairs_el.value = 1;
    total_num_of_pairs_el.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  });


  //---------------------------------------------------
  // Unit Tests - Scroll Down for Integration Tests
  //---------------------------------------------------

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default number of pairs to be evaluated as 1', () => {

    expect( component.tables ).toBe( 1 );
  });


  it('should have default empty table_hands ', () => {

    expect( component.table_hands.length ).toBe( 1 );
  });

  function validateTableHandInitializations( table_hands, keep_values = false ) {

    table_hands.forEach( (pair, pair_index) => {

      expect( pair.length ).toBe( 2 );

      pair.forEach ( (hand, hand_index) => {

        expect( hand.is_valid ).toBeTruthy();

        if( !keep_values )
          expect( hand.value ).toBe( '' );
        else
          expect( hand.value ).toBe( table_hands[pair_index][hand_index].value );
      });
    });
  }

  it('should validate # of pairs to be calculated & their corresponding pair initializations ', () => {

    // Testing table hand initialization for case lower than 0
    component.tables = 0;
    component.validateTablesCount();
    expect( component.tables ).toBe( 1 );
    expect( component.table_hands.length ).toBe( 1 );
    validateTableHandInitializations(component.table_hands);


    // Testing table hand initialization for case more than 10
    component.tables = 100;
    component.validateTablesCount();
    expect( component.tables ).toBe( 10 );
    expect( component.table_hands.length ).toBe( 10 );
    validateTableHandInitializations(component.table_hands);


    // Testing table hand initialization for case 1 <= n <= 10
    component.tables = 5;
    component.validateTablesCount();
    expect( component.tables ).toBe( 5 );
    expect( component.table_hands.length ).toBe( 5 );
    validateTableHandInitializations(component.table_hands);

  });

  it('should validate reset hand validators', () => {

    component.resetHandValidators();
    expect( component.table_hands.length ).toBe( 1 );
    validateTableHandInitializations(component.table_hands);

  });

  it('should validate reset hand validators with keeping values', () => {

    component.table_hands = [
        [{value: 'AAAK', is_valid: false}, {value: '', is_valid: false}],
        [{value: '23456', is_valid: true}, {value: '789TJ', is_valid: true}],
    ];

    component.resetHandValidators( true );

    expect( component.table_hands.length ).toBe( 2 );

    validateTableHandInitializations(component.table_hands, true);

  });


  it("should validate cards in the pair to make sure there are no cards with more than 4 time occurence ", () => {

    // 'Ace' occurence is 5 times which is not possible in 52 card deck
    expect( component.isCardCountValid( 'AAAAK', 'A2345' ) ).toBeFalsy();

    expect( component.isCardCountValid( '22334', '55667' ) ).toBeTruthy();
  });


  //---------------------------
  // Integration Tests
  //---------------------------


    describe('Integration Tests', () =>{

      it('should display title as defined', () => {

        expect( title_el.textContent ).toContain('Poker Challenge');
      });


      it('should update the value of # of pairs from UI input ', () => {

        total_num_of_pairs_el.value = 2;
        total_num_of_pairs_el.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect( component.tables ).toBe( 2 );
      });


      it('should create # of pairs to be evaluated as the value of pair of hands input', () => {

        component.table_hands = [
          [{value:'', is_valid:true}, {value:'', is_valid:true}],
          [{value:'', is_valid:true}, {value:'', is_valid:true}]
        ];

        fixture.detectChanges();

        fixture.whenStable().then(() => {

          all_hands_el = fixture.debugElement.queryAll( By.css('.hand') );

          // Total hands must be double of the # of pairs
          expect( all_hands_el.length ).toBe( component.table_hands.length * 2 );

        });


      });

      it('should validate the hands input & calculate result', async(() => {

        spyOn(component, 'validateHand');
        spyOn(component, 'validate');

        component.table_hands = [
          [{value:'', is_valid:true}, {value:'', is_valid:true}]
        ];

        fixture.detectChanges();

        let hand_0 = fixture.debugElement.query( By.css('#pair_0_hand_0') ).nativeElement;
        let hand_1 = fixture.debugElement.query( By.css('#pair_0_hand_1') ).nativeElement;
        let calc_btn = fixture.debugElement.query( By.css('#calc_btn') ).nativeElement;

        hand_0.value = 'AAAKK';
        hand_0.dispatchEvent(new Event('input'));
        hand_0.dispatchEvent(new Event('keypress'));

        hand_1.value = '22548';
        hand_1.dispatchEvent(new Event('input'));
        hand_1.dispatchEvent(new Event('keypress'));

        // Make sure hand validator is called
        fixture.detectChanges();
        expect( component.validateHand ).toHaveBeenCalled();

        // Press the submit button & ensure validate is called which will get results
        calc_btn.click();
        fixture.detectChanges();
        expect(component.validate).toHaveBeenCalled();

      }));

    });



});
