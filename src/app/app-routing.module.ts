import { HomepageComponent } from './home/homepage/homepage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YahooAuthComponent } from './login/yahoo-auth/yahoo-auth.component';


const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'yahoo_auth', component: YahooAuthComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
