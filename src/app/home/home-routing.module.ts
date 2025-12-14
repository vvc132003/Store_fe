import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { IndexComponent } from './index/index.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { CategorySourceCodeComponent } from './category-source-code/category-source-code.component';
import { PagesLoginComponent } from './pages-login/pages-login.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'source-code/:slug', component: ProjectDetailComponent },
  { path: 'danh-muc-source-code', component: CategorySourceCodeComponent },
  { path: 'dang-nhap', component: PagesLoginComponent }



];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
