import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LayoutHomeComponent } from './layout-home/layout-home.component';
import { NavbarComponent } from './layout-home/navbar/navbar.component';
import { HeaderComponent } from './layout-home/header/header.component';
import { IndexComponent } from './index/index.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { PageHeaderComponent } from './core_home/page-header/page-header.component';
import { PageRightComponent } from './core_home/page-right/page-right.component';


@NgModule({
  declarations: [
    HomeComponent,
    LayoutHomeComponent,
    NavbarComponent,
    HeaderComponent,
    IndexComponent,
    ProjectDetailComponent,
    PageHeaderComponent,
    PageRightComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
