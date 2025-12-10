import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {


  showcategory_add = false;
  newcategory: any = {};
  data: any = {};
  category: any[] = [];
  category_id: any = {};
  count: number = 0;




  constructor(private titleService: Title, private _category: CategoryService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle('Loại code');
    this.loadCategorys();
  }
  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
  loadCategorys() {
    this.subscription.add(
      this._category.getData().subscribe((data: any) => {
        this.category = data.sort((a: any, b: any) => {
          return b.id.localeCompare(a.id);
        });

        // console.log(this.categories);
        this.category_id = this.category[0];
        this.count = this.category.length;
        // if (this.pendingActions.length > 0) {
        //   this.evetnbuttons(this.pendingActions);
        //   // this.pendingActions = [];
        // }
      })
    );
  }

  //#region event
  selectCategory(event: any) {
    this.category_id = event;
    // this.evetnbuttons(this.pendingActions);
    // console.log(event);
    // console.log(this.drink);
  }


  click(event: any) {
    // this.isModalVisible = true;

    const modalMap: { [key: string]: () => void } = {
      '101': () => setTimeout(() => this.showcategory_add = true, 0),
      '102': () => setTimeout(() => this.showcategory_add = true, 0)
    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '101':
        // this.showoffcanvas = true;
        this.newcategory = {};
        this.data = {
          action: 'add',
          text: 'Thêm loại code'
        };
        break;
      case '102':
        // this.showoffcanvas = true;
        this.newcategory = this.category.find(dr => dr.id == this.category_id.id);
        this.data = {
          action: 'update',
          text: 'Cập nhật loại code'
        };
        break;
      case '103':
        break;
      case '104':
        this._category.deleteData(this.category_id.id).subscribe(data => {
          this.category = this.category.filter(d => d.id !== this.category_id.id);
          this.category_id = this.category[0];
        })
        break;
      default:
        break;
    }
  }
  newData(data: any) {
    const index = this.category.findIndex(c => c.id === data.id);
    if (index === -1) {
      this.count += 1;
      // this.categories.unshift(data);
      this.category = [data, ...this.category];
    } else {
      const updated = [...this.category];
      updated[index] = data;
      this.category = updated;
    }
    this.category_id = data;
    // if (this.pendingActions.length > 0) {
    //   this.evetnbuttons(this.pendingActions);
    //   // this.pendingActions = [];
    // }
  }

  close() {
    // this.showDetail = false;
    this.showcategory_add = false;
    setTimeout(() => {
      // this.isModalVisible = false;
    }, 400);
  }

}