import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, OnDestroy {
  @Input() breadcrumb_title: string = "";
  @Input() breadcrumb_categoryname: string = "";
  project_latest: any[] = [];
  @Output() projectLatestChange = new EventEmitter<any[]>();

  onbreadcrumb_title: boolean = true;

  constructor(private _project: ProjectService) {

  }
  private subscription = new Subscription();


  ngOnInit(): void {
    this.loadProject_latest();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadProject_latest() {
    this.subscription.add(
      this._project.getProject_latest().subscribe((data: any) => {
        this.project_latest = data;
        this.projectLatestChange.emit(this.project_latest);
        // console.log(data);
      })
    )
  }
}
