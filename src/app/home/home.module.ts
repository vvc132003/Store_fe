import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
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
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PurchasedCodeComponent } from './purchased-code/purchased-code.component';
import { FavoriteCodeComponent } from './favorite-code/favorite-code.component';
import { TransactionComponent } from './transaction/transaction.component';
import { FooterComponent } from './layout-home/footer/footer.component';
import { ModalComponent } from './project-detail/modal/modal.component';
import { ProjectserviceComponent } from './projectservice/projectservice.component';
import { LatestcodeComponent } from './index/latestcode/latestcode.component';
import { FeaturedwebsiteComponent } from './index/featuredwebsite/featuredwebsite.component';
import { FeaturedsoftwareComponent } from './index/featuredsoftware/featuredsoftware.component';
import { FeaturedapplicationsComponent } from './index/featuredapplications/featuredapplications.component';
import { FeaturedgameComponent } from './index/featuredgame/featuredgame.component';
import { CommentComponent } from './project-detail/comment/comment.component';
import { CommentItemComponent } from './project-detail/comment/comment-item/comment-item.component';
import { UpdateAccountComponent } from './update-account/update-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HistoryCommentComponent } from './history-comment/history-comment.component';


@NgModule({
  declarations: [
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
    PurchasedCodeComponent,
    FavoriteCodeComponent,
    TransactionComponent,
    FooterComponent,
    ModalComponent,
    ProjectserviceComponent,
    LatestcodeComponent,
    FeaturedwebsiteComponent,
    FeaturedsoftwareComponent,
    FeaturedapplicationsComponent,
    FeaturedgameComponent,
    CommentComponent,
    CommentItemComponent,
    UpdateAccountComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HistoryCommentComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    BsDatepickerModule
  ]
})
export class HomeModule { }
