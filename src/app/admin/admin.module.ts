import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { NotificationComponent } from './notification/notification.component';
import { FormComponent } from './core/form/form.component';
import { ImgsComponent } from './core/imgs/imgs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectComponent } from './project/project.component';
import { CategoryComponent } from './category/category.component';
import { CategoryAddComponent } from './category/category-add/category-add.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProjectAddComponent } from './project/project-add/project-add.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    ToolbarComponent,
    NotificationComponent,
    FormComponent,
    ImgsComponent,
    DashboardComponent,
    ProjectComponent,
    CategoryComponent,
    CategoryAddComponent,
    CategoryListComponent,
    ProjectAddComponent,
    ProjectListComponent,
    ProjectDetailComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    FormsModule,
    BsDatepickerModule,
    SharedModule
  ]
})
export class AdminModule { }
