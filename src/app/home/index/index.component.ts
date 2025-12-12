import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @Input() category_list: any[] = [];

  constructor(private titleService: Title, private _project: ProjectService) { }
  private subscription = new Subscription();
  ngOnInit(): void {
    this.titleService.setTitle('Mua Bán Source code đa nền tảng');
    // this.loadProject();
  }
}
