import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/AuthService';
import { FavoriteService } from 'src/app/services/favorite.service';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnDestroy, OnInit {

  cars = [
    {
      imgSrc: 'http://192.168.1.6/uploads/a3.png',
      title: 'Website bán xe ô tô giới thiệu dịch vụ xe ô tô | Đại lý phân phối xe ô tô xe máy dịch vụ sử',
      price: '900.000 đ',
      views: 23,
      category: 'Khác',
      rating: 5
    },
    {
      imgSrc: 'http://192.168.1.6/uploads/a2.jpg',
      title: 'Xe ô tô nhập khẩu mới giá tốt',
      price: '1.200.000 đ',
      views: 18,
      category: 'Khác',
      rating: 5
    },
    // Thêm các đối tượng xe khác nếu cần
  ];
  projectRamdom: any[] = [];
  project_list: any[] = [];
  project: any = {};
  mainImage: string = "";
  slideIndex = 0;
  intervalId: any;
  @ViewChild('thumbList') thumbList!: ElementRef<HTMLDivElement>;

  breadcrumb_title: string = "";
  breadcrumb_categoryname: string = "";
  constructor(private titleService: Title, private sanitizer: DomSanitizer,
    private _project: ProjectService, private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _order: OrderService,
    private cookieService: CookieService,
    private _user: UserService,
    private _notification: NotificationService,
    private _favorite: FavoriteService,
    private auth: AuthService
  ) { }
  private subscription = new Subscription();
  activeTab: number = -1;



  slug_viewCount: any;
  //#region  load dữ liệu
  ngOnInit(): void {
    // const token = this.cookieService.get('access_token');
    // let payload: any;
    // if (token) {
    //   payload = this.parseJwt(token);
    // }
    this.subscription.add(
      this._activatedRoute.paramMap.subscribe(params => {
        const slug = params.get('slug');
        if (slug) {
          // Lấy slug cũ từ localStorage
          const oldSlug = localStorage.getItem('slug_viewCount');

          if (slug !== oldSlug) {
            this.slug_viewCount = oldSlug;
          }
          localStorage.setItem('slug_viewCount', slug);
          localStorage.setItem('last_route', '/source-code/' + slug);

          this.loadProject_detail(slug);
        }
      })
    );
    this.getRandom();
  }
  getRandom() {
    this.subscription.add(
      this._project.getRandom().subscribe((res: any) => {
        this.projectRamdom = res;
      })
    )
  }
  //#region  event
  // bookmark(projectId: string): void {
  //   const datapost = {
  //     projectId: projectId
  //   }
  //   this.subscription.add(
  //     this._favorite.postData(datapost).subscribe((data: any) => {
  //       if (data) {
  //         this.project.isFavorite = true;
  //         this._notification.showSuccess("1006");
  //       } else {
  //         this._notification.showWarning("1007");
  //       }
  //     })
  //   )
  // }

  bookmark(projectId: string): void {
    const datapost = {
      projectId: projectId
    }
    this.subscription.add(
      this._favorite.postData(datapost).subscribe({
        next: () => {
          this.project.isFavorite = true;
          this._notification.showSuccess("1006");
        },
        error: err => {
          if (err.status === 401) {
            this.showWarning = true;
          } else {
            this._notification.showWarning("1007");
          }
        }
      })
    );
  }


  prevImage() {
    this.slideIndex =
      (this.slideIndex - 1 + this.project.images.length) % this.project.images.length;
    this.mainImage = this.project.images[this.slideIndex];
    this.scrollThumbnailIntoView();

  }

  nextImage() {
    this.slideIndex = (this.slideIndex + 1) % this.project.images.length;
    this.mainImage = this.project.images[this.slideIndex];
    this.scrollThumbnailIntoView();

  }
  countImage: number = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }

  goToDemoTab(tab: number) {
    this.activeTab = tab;
    const tabElement = document.querySelector('.tab-content');
    tabElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  selectImage(img: string) {
    this.mainImage = img;
    this.slideIndex = this.project.images.indexOf(img);
    this.scrollThumbnailIntoView();

  }
  private startAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.slideIndex = (this.slideIndex + 1) % this.project.images.length;
      this.mainImage = this.project.images[this.slideIndex];
      this.scrollThumbnailIntoView();
    }, 3000);
  }
  private scrollThumbnailIntoView() {
    const container = this.thumbList.nativeElement; // container ngang
    const images = container.querySelectorAll('img');
    const activeImg = images[this.slideIndex] as HTMLElement;

    if (activeImg) {
      // Tọa độ ảnh so với container
      const containerWidth = container.clientWidth;
      const imgOffsetLeft = activeImg.offsetLeft;
      const imgWidth = activeImg.offsetWidth;

      // Scroll sao cho ảnh active nằm giữa container
      const scrollTo = imgOffsetLeft - (containerWidth / 2) + (imgWidth / 2);

      container.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }



  onProjectLatestReceived(data: any[]) {
    this.project_list = data;
  }

  // loadProject_list() {
  //   this.subscription.add(
  //     this._project.getProject_latest().subscribe((data: any[]) => {
  //       this.project_list = data
  //       // .sort(
  //       //   (a: any, b: any) =>
  //       //     new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       // ).slice(0, 5);
  //     })
  //   );
  // }

  loadProject_detail(slug: string) {
    // const slug = this.route.snapshot.paramMap.get('slug');
    this.subscription.add(
      this._project.getProjectBySlug(slug!).subscribe((data: any) => {
        this.project = data;
        console.log(data);
        this.mainImage = this.project.thumbnailUrl;
        if (!this.project.images.includes(this.mainImage)) {
          this.project.images.push(this.mainImage);
        }
        this.countImage = this.project.images.length;
        this.startAutoSlide();
        this.breadcrumb_title = data.title;
        this.breadcrumb_categoryname = data.categoryName;
        this.titleService.setTitle(data.title);
        // console.log(data);
        this.setSafeUrl(this.project.demoUrl);
      })
    )

  }
  safeUrl: SafeResourceUrl | null = null;
  setSafeUrl(url?: string) {
    if (url) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.safeUrl = null;
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  // private parseJwt(token: string): any {
  //   const payload = token.split('.')[1];
  //   const decoded = atob(payload);
  //   const utf8 = decodeURIComponent(
  //     decoded
  //       .split('')
  //       .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //       .join('')
  //   );
  //   return JSON.parse(utf8);
  // }
  isTypeOpen = false;

  project_dw: any;
  showisTypeOpen(project: any) {
    // this.auth.me().subscribe({
    //   next: user => {
    //     this.project_dw = project;
    //     this.isTypeOpen = true;
    //   },
    //   error: () => {
    //     this.showWarning = true;
    //   }
    // });
    this.auth.session().subscribe((is: boolean) => {
      if (!is) {
        this.showWarning = true;
        return;
      }
      this.project_dw = project;
      this.isTypeOpen = true;
    })

  }


  closeType() {
    this.isTypeOpen = false;
  }

  currentUser: any = {};

  onUserLoaded(user: any) {
    this.currentUser = user;
    // console.log(user);
  }


  showWarning: boolean = false;
  isDownloading = false;

  download(project: any): void {
    // const token = this.cookieService.get('access_token');
    // if (!token) {
    //   this.showWarning = true;
    //   return;
    // }
    this.isDownloading = true;
    // const payload = this.parseJwt(token);

    const data = {
      // userId: payload.nameid,
      projectId: project.id,
      quantity: 0,
      totalPrice: project.price,
      status: "SUCCESS",
    };
    this.subscription.add(
      this._order.postData(data).subscribe((response: any) => {
        const downloadUrl = response.downloadUrl;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.click();
        this.isTypeOpen = false;
        this._notification.showSuccess("1029");
        this.isDownloading = false;
      }, error => {
        console.error('Order creation failed:', error);
        this.isDownloading = false;
      })
    );
  }


}
