import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games/games.component';
import {ButtonModule} from 'primeng/button';
import { LeagueComponent } from './league/league.component';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { TeamListComponent } from './league/team-list/team-list.component'
import {PanelModule} from 'primeng/panel';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {BlockUIModule} from 'primeng/blockui';

@NgModule({
  declarations: [GamesComponent, LeagueComponent, TeamComponent, TeamListComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    PanelModule,
    TabViewModule,
    TableModule,
    ScrollPanelModule,
    BlockUIModule
  ],
  exports: [GamesComponent, LeagueComponent, TeamComponent, TeamListComponent]
})
export class FantasyModule { }
