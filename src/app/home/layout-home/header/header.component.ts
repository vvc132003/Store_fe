import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {



  slides = [
    "https://giaodichcode.com/assets/images/bannerv2/POP-UP-CODE_LARGE-2.jpg",
    "https://giaodichcode.com/assets/images/banner/banner2.png"
  ];
  products = [
    {
      image: "https://giaodichcode.com/storage/images/codes/9/286631d6ba8935d76c98-1765117115.jpg",
      title: "Source code website bán hàng thời trang...",
      price: 189000,
      category: "Php & Mysql",
      review: 1,
      avatar: "assets/img/u1.jpg",
      seller: "nrp"
    },
    {
      image: "https://giaodichcode.com/storage/images/codes/46/d51b6bade0f36fad36e2-1765116802.jpg",
      title: "Source code website quản lý hóa đơn...",
      price: 25000,
      category: "Php & Mysql",
      review: 1,
      avatar: "assets/img/u2.jpg",
      seller: "nrp"
    },
    {
      image: "https://giaodichcode.com/storage/images/codes/38/laravel-fi-quanlykho-main-1765035260.png",
      title: "Phần mềm website quản lý kho hàng...",
      price: 1500000,
      category: "Php & Mysql",
      review: 1,
      avatar: "assets/img/u3.jpg",
      seller: "Coder giá rẻ"
    },
    {
      image: "https://giaodichcode.com/storage/images/codes/99/anh-1764904247.png",
      title: "App mobile cho thuê xe oto xe máy...",
      price: 500000,
      category: "Mobile",
      review: 1,
      avatar: "assets/img/u4.jpg",
      seller: "Vương Đức"
    },
    {
      image: "https://giaodichcode.com/storage/images/codes/51/z7281413581870-666d494622f23d148e1320e0a3189af8-1764584459.jpg",
      title: "Website bán thời trang nam nữ",
      price: 500000,
      category: "Php & Mysql",
      review: 1,
      avatar: "assets/img/u5.jpg",
      seller: "Cao Chí Phát"
    }, {
      image: "https://giaodichcode.com/storage/images/codes/20/overlay-video-1764312311.png",
      title: "Công cụ Tạo Overlay cho Video - Thu hút lượt xem trên TikTok - Video được TikTok nhận diện thương hiệu !",
      price: 500000,
      category: "Php & Mysql",
      review: 1,
      avatar: "assets/img/u5.jpg",
      seller: "Cao Chí Phát"
    }
  ];
  @Input() category_list: any[] = [];
  project_list: any[] = [];
  currentIndex = 0;
  prevIndex = 0;
  intervalId: any;
  constructor(private _category: CategoryService, private _project: ProjectService) {

  }
  private subscription = new Subscription();


  ngOnInit() {
    this.startAutoSlide();
    this.loadProject_list();
  }

  loadProject_list(){
    this.subscription.add(
      this._project.getProject_list().subscribe((data:any)=>{
        this.project_list=data;
        console.log(data)
      })
    )
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.subscription.unsubscribe();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  nextSlide() {
    this.prevIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.prevIndex = this.currentIndex;
    this.currentIndex = index;
  }
}