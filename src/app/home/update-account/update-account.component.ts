import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ProjectService } from 'src/app/services/project.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss']
})
export class UpdateAccountComponent implements OnInit, OnDestroy {


  // user: any = {};
  transactions: any[] = [];
  showFilter = false;
  isDesktop = true;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  totalPages = 1;
  filteredData: any[] = [];
  currentPage = 1;
  pageSize = 5; // mỗi trang 10 item
  pagedData: any[] = [];
  searchText = "";
  priceFrom: number | null = null;
  priceTo: number | null = null;
  orderCount: number = 0;
  orderCount_year: number = 0;

  transactionType: string | null = null;
  orderCountData: any[] = [];
  revenueData: any[] = [];
  constructor(private _user: UserService,
    private titleService: Title, private cookieService: CookieService,
    private cdr: ChangeDetectorRef,
    private _project: ProjectService,
    private _transaction: TransactionService,
    private _notification: NotificationService) { }
  private subscription = new Subscription();

  private parseJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const utf8 = decodeURIComponent(
      decoded
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(utf8);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Tài khoản của tôi - Cập nhật tài khoản');
  }


  currentUser: any = {};

  onUserLoaded(user: any) {
    this.currentUser = user;
    this.previewImg = this.currentUser.avatar && this.currentUser.avatar.trim() !== ''
      ? this.currentUser.avatar
      : null;
  }

  previewImg: string | null = null;
  selectedFile_img: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.currentUser.avatar = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile_img = file;
        this.previewImg = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  update(): void {
    if (!this.selectedFile_img) return;
    this.subscription.add(
      this._user.uploadImg(this.selectedFile_img, this.currentUser.avatar).subscribe((res: any) => {
        this.currentUser.avatar = res.thumbnailUrl;
        this._user.updateUser(this.currentUser.id, this.currentUser).subscribe(() => {
          this._notification.showSuccess("1030");
        })
      })
    )
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}

