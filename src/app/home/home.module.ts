import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LayoutHomeComponent } from './layout-home/layout-home.component';
import { NavbarComponent } from './layout-home/navbar/navbar.component';
import { HeaderComponent } from './layout-home/header/header.component';
import { IndexComponent } from './index/index.component';


@NgModule({
  declarations: [
    HomeComponent,
    LayoutHomeComponent,
    NavbarComponent,
    HeaderComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
