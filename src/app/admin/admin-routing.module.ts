import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { CategoryComponent } from './category/category.component';
import { AdminGuard } from '../services/AdminGuard';

const routes: Routes = [
  { path: 'revenue/:funId', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'category/:funId', component: CategoryComponent, canActivate: [AdminGuard] },
  { path: 'project/:funId', component: ProjectComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
