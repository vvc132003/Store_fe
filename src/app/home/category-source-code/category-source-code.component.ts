import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-category-source-code',
  templateUrl: './category-source-code.component.html',
  styleUrls: ['./category-source-code.component.scss']
})
export class CategorySourceCodeComponent implements OnInit, OnDestroy {


  project_latest: any[] = [];
  project_by_categoryslug: any[] = [];
  constructor(private _project: ProjectService, private titleService: Title, private route: ActivatedRoute) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadProject_latest();
    this.titleService.setTitle("Danh mục mã nguồn");
    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.loadSourceCodeByCategory(category);
      }
    });
  }

  loadProject_latest() {
    this.subscription.add(
      this._project.getProject_latest().subscribe((data: any) => {
        this.project_latest = data;
        // console.log(data);
      })
    )
  }

  categoryname: string = "";
  count: number = 0;
  loadSourceCodeByCategory(category: string) {
    this.subscription.add(
      this._project.getProjectByCategorySlug(category).subscribe((data: any) => {
        this.project_by_categoryslug = data;
        this.categoryname = data[0].categoryName;
        this.count = data.length;
        // console.log(data)
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
