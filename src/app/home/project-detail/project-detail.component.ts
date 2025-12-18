import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { ProjectService } from 'src/app/services/project.service';

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

  project_list: any[] = [];
  project: any = {};
  mainImage: string = "";
  slideIndex = 0;
  intervalId: any;
  @ViewChild('thumbList') thumbList!: ElementRef<HTMLDivElement>;

  breadcrumb_title: string = "";
  breadcrumb_categoryname: string = "";
  constructor(private titleService: Title, private _project: ProjectService, private route: ActivatedRoute,
    private _order: OrderService,
    private cookieService: CookieService
  ) { }
  private subscription = new Subscription();
  activeTab: number = 0;



  slug_viewCount: any;
  //#region  load dữ liệu
  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        const slug = params.get('slug');
        if (slug) {
          // Lấy slug cũ từ localStorage
          const oldSlug = localStorage.getItem('slug_viewCount');

          if (slug !== oldSlug) {
            this.slug_viewCount = oldSlug;
          }
          localStorage.setItem('slug_viewCount', slug);
          this.loadProject_detail(slug);
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

  selectTab(index: number) {
    this.activeTab = index;
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
        this.mainImage = this.project.thumbnailUrl;
        if (!this.project.images.includes(this.mainImage)) {
          this.project.images.push(this.mainImage);
        }
        this.startAutoSlide();
        this.breadcrumb_title = data.title;
        this.breadcrumb_categoryname = data.categoryName;
        this.titleService.setTitle(data.title);
      })
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  //#region  event

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

  download(project: any): void {
    const token = this.cookieService.get('access_token');
    const payload = this.parseJwt(token);

    const data = {
      userId: payload.nameid,
      projectId: project.id,
      quantity: 0,
      totalPrice: project.price,
      status: "10",
    };

    this.subscription.add(
      this._order.postData(data).subscribe((response: any) => {
        const downloadUrl = response.downloadUrl;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.click();
      }, error => {
        console.error('Order creation failed:', error);
      })
    );
  }


}
