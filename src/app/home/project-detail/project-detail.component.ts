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
