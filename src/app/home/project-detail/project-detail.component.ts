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

  project: any = {};
  breadcrumb_title: string = "";
  breadcrumb_categoryname: string = "";
  constructor(private titleService: Title, private _project: ProjectService, private route: ActivatedRoute) { }
  private subscription = new Subscription();
  activeTab: number = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }
  ngOnInit(): void {
    this.loadProject_detail();
  }

  loadProject_detail() {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.subscription.add(
      this._project.getProjectBySlug(slug!).subscribe((data: any) => {
        // console.log(data);
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
