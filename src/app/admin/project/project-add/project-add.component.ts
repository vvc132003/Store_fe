import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss']
})
export class ProjectAddComponent implements OnChanges, OnInit {
  @Input() data: any;
  @Input() project: any = {};
  @Input() showcproject_add = false;
  @Output() newData = new EventEmitter<void>();
  action: string = "";
  category: any[] = [];

  @Output() closeProjectAdd = new EventEmitter<void>();
  text: string = "";
  tables = [
    { label: 'Thông tin chung', icon: 'bi-collection', tab: 'category' },
    { label: 'Thông tin thêm', icon: 'bi-gear', tab: 'setting' }
  ];
  private subscription = new Subscription();
  constructor(private _category: CategoryService, private _project: ProjectService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.data = { ...changes['data'].currentValue };
      this.text = this.data.text;
      this.action = this.data.action;
    }
    if (changes['project'] && changes['project'].currentValue) {
      this.project = { ...changes['project'].currentValue };
      this.previewImg = this.project.thumbnailUrl;
      if (this.project.zipPath) {
        this.selectedFile_zip = this.project.zipPath.split('/').pop(); // chỉ lấy tên file
      }      // console.log(this.category);
    }
  }

  get selectedZipName(): string {
    if (!this.selectedFile_zip) return '';
    return (this.selectedFile_zip instanceof File)
      ? this.selectedFile_zip.name
      : this.selectedFile_zip;
  }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory() {
    this.subscription.add(
      this._category.getData().subscribe((data: any) => {
        this.category = data;
      })
    )
  }

  save(): void {
    if (this.action === 'add') {
      this.saveProject();
    } else {
      this.updateCategory();
    }
  }

  saveProject() {
    // this.category.icon = this.categoryIcons[0].icon;
    if (!this.selectedFile_zip || !this.selectedFile_img) {
      return;
    }

    const maxSize = 5 * 1024 * 1024 * 1024;
    if (this.selectedFile_zip.size > maxSize) {
      // console.error('File is too large');
      return;
    }


    this._project.uploadZip(this.selectedFile_zip, this.selectedFile_img, this.project.zipPath, this.project.thumbnailUrl).subscribe(res => {
      this.project.zipPath = res.fileUrl;
      this.project.thumbnailUrl = res.thumbnailUrl;
      this._project.postData(this.project).subscribe(data => {
        this.close();
        this.newData.emit(data);
      });
    });
  }

  updateCategory() {
    // this.category.icon = this.categoryIcons[0].icon;
    // this._category.updateData(this.category).subscribe((data: any) => {
    //   // console.log(data);
    // this.close();
    // this.newData.emit(data);
    // })
  }


  selectedFile_zip: File | null = null;

  onFileSelected_zip(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile_zip = file;
      this.project.zipPath = file.name;
    }
  }
  selectedFile_img: File | null = null;
  previewImg: string | null = null;


  onFileSelected_img(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.project.thumbnailUrl = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile_img = file;
        // console.log(this.selectedFile_img);
        this.previewImg = reader.result as string; // <-- gán trực tiếp
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
    }
  }

  removeSelectedZip() {
    this.selectedFile_zip = null;
    this.project.zipPath = '';
  }

  close() {
    this.closeProjectAdd.emit();
  }


}
