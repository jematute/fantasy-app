import { TeamListComponent } from './fantasy/league/team-list/team-list.component';
import { LeagueComponent } from './fantasy/league/league.component';
import { GamesComponent } from './fantasy/games/games.component';
import { HomepageComponent } from './home/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YahooAuthComponent } from './login/yahoo-auth/yahoo-auth.component';
import { TeamComponent } from './fantasy/team/team.component';


const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'yahoo_oauth', component: YahooAuthComponent },
  { path: 'games', component: GamesComponent },
  { path: 'league/:id', component: LeagueComponent, children: [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', component: TeamListComponent },
    { path: 'team/:id', component: TeamComponent }
  ]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
