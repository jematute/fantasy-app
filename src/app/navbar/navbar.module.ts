import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
