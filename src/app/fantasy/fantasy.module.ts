import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games/games.component';



@NgModule({
  declarations: [GamesComponent],
  imports: [
    CommonModule
  ],
  exports: [GamesComponent]
})
export class FantasyModule { }
