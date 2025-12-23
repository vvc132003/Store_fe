import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  showproject_add: boolean = false;
  newproject: any = {};
  project_list: any[] = [];
  project_id: any = {};
  data: any = {};
  count: number = 0;

  constructor(private titleService: Title, private _project: ProjectService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý mã nguồn');
    this.loadProject();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadProject() {
    this.subscription.add(
      this._project.getData().subscribe((data: any) => {
        this.project_list = data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.project_id = data[0];
        this.count = this.project_list.length;

      })
    )
  }

  //#region event


  click(event: any) {
    // this.isModalVisible = true;

    const modalMap: { [key: string]: () => void } = {
      '101': () => setTimeout(() => this.showproject_add = true, 0),
      '102': () => setTimeout(() => this.showproject_add = true, 0)
    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '101':
        // this.showoffcanvas = true;
        this.newproject = {};
        this.data = {
          action: 'add',
          text: 'Thêm mã nguồn'
        };
        break;
      case '102':
        // this.showoffcanvas = true;
        this.newproject = this.project_list.find(dr => dr.id == this.project_id.id);
        this.data = {
          action: 'update',
          text: 'Cập nhật mã nguồn'
        };
        break;
      case '103':
        break;
      case '104':
        // this._category.deleteData(this.category_id.id).subscribe(data => {
        //   this.category = this.category.filter(d => d.id !== this.category_id.id);
        //   this.category_id = this.category[0];
        // })
        break;
      case '106':
        this._project.exportProjectsExcel().subscribe({
          next: (res: Blob) => {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ProjectsWithImages.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            // console.error('Download failed', err);
            // alert('Xuất file thất bại!');
          }
        });
        break;
      default:
        break;
    }
  }
  newData(data: any) {
    const index = this.project_list.findIndex(c => c.id === data.id);
    if (index === -1) {
      this.count += 1;
      // this.categories.unshift(data);
      this.project_list = [data, ...this.project_list];
    } else {
      const updated = [...this.project_list];
      updated[index] = data;
      this.project_list = updated;
    }
    this.project_id = data;
    // if (this.pendingActions.length > 0) {
    //   this.evetnbuttons(this.pendingActions);
    //   // this.pendingActions = [];
    // }
  }
  selectpRroject(event: any) {
    this.project_id = event;
    // this.evetnbuttons(this.pendingActions);
    // console.log(event);
    // console.log(this.drink);
  }
  close() {
    // this.showDetail = false;
    this.showproject_add = false;
    setTimeout(() => {
      // this.isModalVisible = false;
    }, 400);
  }
}

