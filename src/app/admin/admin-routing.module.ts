import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { CategoryComponent } from './category/category.component';
import { AdminGuard } from '../services/AdminGuard';
import { CustomersComponent } from './customers/customers.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { OrderComponent } from './order/order.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { SettingComponent } from './setting/setting.component';
import { CommentComponent } from './comment/comment.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TagsComponent } from './tags/tags.component';

const routes: Routes = [
  { path: 'revenue/:funId', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'category/:funId', component: CategoryComponent, canActivate: [AdminGuard] },
  { path: 'project/:funId', component: ProjectComponent, canActivate: [AdminGuard] },
  { path: 'customer/:funId', component: CustomersComponent, canActivate: [AdminGuard] },
  { path: 'favorite-code/:funId', component: FavoritesComponent, canActivate: [AdminGuard] },
  { path: 'order/:funId', component: OrderComponent, canActivate: [AdminGuard] },
  { path: 'deposit/:funId', component: DepositComponent, canActivate: [AdminGuard] },
  { path: 'withdraw/:funId', component: WithdrawComponent, canActivate: [AdminGuard] },
  { path: 'settings/:funId', component: SettingComponent, canActivate: [AdminGuard] },
  { path: 'comments/:funId', component: CommentComponent, canActivate: [AdminGuard] },
  { path: 'change-password/:funId', component: ChangePasswordComponent, canActivate: [AdminGuard] },
  { path: 'tags/:funId', component: TagsComponent, canActivate: [AdminGuard] },








];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
