import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  breadcrumb_title: string = "";
  breadcrumb_categoryname: string = "";
  constructor(private titleService: Title, private _project: ProjectService, private route: ActivatedRoute) { }
  private subscription = new Subscription();
  activeTab: number = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }

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
        this.breadcrumb_title = data.title;
        this.breadcrumb_categoryname = data.categoryName;
        this.titleService.setTitle(data.title);
      })
    )

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
