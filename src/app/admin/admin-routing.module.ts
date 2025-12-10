import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  { path: 'revenue/:funId', component: DashboardComponent },
  { path: 'category/:funId', component: CategoryComponent },
  { path: 'project/:funId', component: ProjectComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
