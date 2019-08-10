import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage/homepage.component';
import {ButtonModule} from 'primeng/button';
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule
  ],
  exports: [HomepageComponent]
})
export class HomeModule { }
