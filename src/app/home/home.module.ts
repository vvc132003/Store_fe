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
import { SharedModule } from '../shared/shared.module';
import { CategorySourceCodeComponent } from './category-source-code/category-source-code.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { FormsModule } from '@angular/forms';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { TopupComponent } from './topup/topup.component';
import { CardMenuComponent } from './layout-home/card-menu/card-menu.component';
import { CardHeaderSideComponent } from './layout-home/card-header-side/card-header-side.component';
// import { SessionWarningComponent } from './pages/session-warning/session-warning.component';


@NgModule({
  declarations: [
    HomeComponent,
    LayoutHomeComponent,
    NavbarComponent,
    HeaderComponent,
    IndexComponent,
    ProjectDetailComponent,
    PageHeaderComponent,
    PageRightComponent,
    CategorySourceCodeComponent,
    PagesLoginComponent,
    PagesRegisterComponent,
    DashboardsComponent,
    TopupComponent,
    CardMenuComponent,
    CardHeaderSideComponent,
    // SessionWarningComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class HomeModule { }
