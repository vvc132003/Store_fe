import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnChanges {
  @Input() showcategory_add = false;
  @Input() data: any;
  @Input() category: any = {};
  @Output() newData = new EventEmitter<void>();

  @Output() closeCategoryAdd = new EventEmitter<void>();

  text: string = "";
  action: string = "";

  tables = [
    { label: 'Thông tin loại code', icon: 'bi-collection', tab: 'category' },
    // { label: 'Cài đặt', icon: 'bi-gear', tab: 'setting' }
  ];

  constructor(private _category: CategoryService, private _notification: NotificationService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.data = { ...changes['data'].currentValue };
      this.text = this.data.text;
      this.action = this.data.action;
    }
    if (changes['category'] && changes['category'].currentValue) {
      this.category = { ...changes['category'].currentValue };
      // console.log(this.category);
    }
    if (this.action === 'copy') {
      this.category.code = "";
    }
    if (this.category && !this.category.code) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      let code = 'CODE-';

      for (let i = 0; i < 3; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
        code += numbers[Math.floor(Math.random() * numbers.length)];
      }
      this.category.code = code
    }
  }

  close() {
    this.closeCategoryAdd.emit();
  }

  toSlug(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }

  onNameChange() {
    this.category.slug = this.toSlug(this.category.name);
  }
  save(): void {
    if (this.action === 'add' || this.action === 'copy') {
      this.saveCategory();
    } else {
      this.updateCategory();
    }
  }

  saveCategory() {
    // this.category.icon = this.categoryIcons[0].icon;
    this._category.postData(this.category).subscribe((data: any) => {
      // console.log(data);
      this.close();
      this.newData.emit(data);
      this._notification.showSuccess('1001');
    })
  }
  updateCategory() {
    // this.category.icon = this.categoryIcons[0].icon;
    this._category.updateData(this.category).subscribe((data: any) => {
      // console.log(data);
      this.close();
      this.newData.emit(data);
      this._notification.showSuccess('1002');

    })
  }

}
