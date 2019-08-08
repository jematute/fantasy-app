import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HomeModule } from './home/home.module';
import { AuthInterceptor } from './login/auth.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavbarModule } from './navbar/navbar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { FantasyModule } from './fantasy/fantasy.module';
import { YahooAuthComponent } from './login/yahoo-auth/yahoo-auth.component';

@NgModule({
  declarations: [
    AppComponent,
    YahooAuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFontAwesomeModule,
    HomeModule,
    NavbarModule,
    SidebarModule,
    FantasyModule
  ],
  providers: [ HttpClient, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  } ],
  bootstrap: [AppComponent],
  exports: [YahooAuthComponent]
})
export class AppModule { }
