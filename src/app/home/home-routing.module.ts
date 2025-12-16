import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { IndexComponent } from './index/index.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CategorySourceCodeComponent } from './category-source-code/category-source-code.component';
import { PagesLoginComponent } from './pages/pages-login/pages-login.component';
import { PagesRegisterComponent } from './pages/pages-register/pages-register.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { TopupComponent } from './topup/topup.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'source-code/:slug', component: ProjectDetailComponent },
  { path: 'danh-muc-source-code', component: CategorySourceCodeComponent },
  { path: 'dang-nhap', component: PagesLoginComponent },
  { path: 'dang-ky', component: PagesRegisterComponent },
  { path: 'dashboards', component: DashboardsComponent },
  { path: 'topup', component: TopupComponent }





];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
