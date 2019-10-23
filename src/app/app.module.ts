import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { PokerComponent } from './components/poker/poker.component';

import { PokerService } from './services/poker.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, PokerComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [ PokerService ]

})
export class AppModule { }
