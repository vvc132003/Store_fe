import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
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
import { CustomersComponent } from './customers/customers.component';
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FavoriteListComponent } from './favorites/favorite-list/favorite-list.component';
import { OrderComponent } from './order/order.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { SettingComponent } from './setting/setting.component';
import { CommentComponent } from './comment/comment.component';
import { CommentListComponent } from './comment/comment-list/comment-list.component';
import { CommentDetailComponent } from './comment/comment-detail/comment-detail.component';
import { CommentItemComponent } from './comment/comment-detail/comment-item/comment-item.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TagsComponent } from './tags/tags.component';
import { TagsAddComponent } from './tags/tags-add/tags-add.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    HeaderComponent,
    LayoutComponent,
    SidebarComponent,
    ToolbarComponent,
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
    CustomersComponent,
    CustomersListComponent,
    FavoritesComponent,
    FavoriteListComponent,
    OrderComponent,
    OrderListComponent,
    DepositComponent,
    WithdrawComponent,
    SettingComponent,
    CommentComponent,
    CommentListComponent,
    CommentDetailComponent,
    CommentItemComponent,
    ChangePasswordComponent,
    TagsComponent,
    TagsAddComponent
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
