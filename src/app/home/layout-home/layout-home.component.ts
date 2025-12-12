import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-layout-home',
  templateUrl: './layout-home.component.html',
  styleUrls: ['./layout-home.component.scss']
})
export class LayoutHomeComponent implements OnInit, OnDestroy {

  @Output() categoryChange = new EventEmitter<any[]>();

  category_list: any[] = [];

  constructor(private _category: CategoryService) {

  }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.loadcategory_list();
  }
  loadcategory_list() {
    this.subscription.add(
      this._category.getData().subscribe((data: any) => {
        this.category_list = data;
        this.categoryChange.emit(this.category_list); 
        // console.log(data);
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
