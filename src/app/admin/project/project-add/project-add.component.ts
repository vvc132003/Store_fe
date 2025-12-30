import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { NotificationService } from 'src/app/services/notification.service';
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

  codeTypes = [
    { id: 1, name: 'Website' },
    { id: 2, name: 'Mobile' },
    { id: 3, name: 'Desktop' },
    { id: 4, name: 'Library' },
    { id: 5, name: 'API' }
  ];

  @Output() closeProjectAdd = new EventEmitter<void>();
  text: string = "";
  tables = [
    { label: 'Thông tin chung', icon: 'bi-collection', tab: 'category' },
    { label: 'Thông tin thêm', icon: 'bi-gear', tab: 'setting' }
  ];
  private subscription = new Subscription();
  constructor(private _category: CategoryService, private _project: ProjectService, private _notification: NotificationService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.data = { ...changes['data'].currentValue };
      this.text = this.data.text;
      this.action = this.data.action;
    }
    if (changes['project'] && changes['project'].currentValue) {
      this.project = { ...changes['project'].currentValue };
      if (this.action === 'copy') {
        this.project.thumbnailUrl = '';
        this.project.images = [];

        this.selectedFile_zip = null;
        this.selectedFile_img = null;
        this.imageFiles = [];

        this.previewImg = null;
        this.previewImages = [];
      }
    }

    if (this.action === "add") {
      this.project.categoryId = this.category[0].id;
      this.project.typeName = this.codeTypes[0].name;
    }
    if (this.project && !this.project.code) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      let code = 'PROJ-';

      for (let i = 0; i < 3; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
        code += numbers[Math.floor(Math.random() * numbers.length)];
      }
      this.project.code = code
    }
  }
  // Hàm định dạng số thành VND
  formatVND(value: number | null): string {
    if (!value) return '';
    return value.toLocaleString('vi-VN') + ' ₫';
  }

  // Xử lý input
  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // Loại bỏ ký tự không phải số
    const numericValue = input.value.replace(/[^0-9]/g, '');

    // Cập nhật project.price (số nguyên)
    this.project.price = numericValue ? parseInt(numericValue, 10) : 0;

    // Hiển thị lại định dạng VND
    input.value = this.formatVND(this.project.price);
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

  //#region  event

  save(): void {
    if (this.action === 'add' || this.action === 'copy') {
      this.saveProject();
      // console.log(this.project);
    } else {
      this.updateCategory();
    }
  }

  saveProject() {

    if (!this.project.title) {
      this._notification.showWarning("1011");
      return;
    }
    if (!this.project.price) {
      this._notification.showWarning("1012");
      return;
    }
    // return;

    // this.category.icon = this.categoryIcons[0].icon;
    if (!this.selectedFile_zip || !this.selectedFile_img || !this.selectedFile_video) {
      this._notification.showWarning("1013");
      return;
    }

    const maxSize = 5 * 1024 * 1024 * 1024;
    if (this.selectedFile_zip.size > maxSize) {
      this._notification.showWarning("1014");

      // console.error('File is too large');
      return;
    }


    this._project.uploadZip(this.selectedFile_zip, this.selectedFile_img, this.project.zipPath, this.project.thumbnailUrl, this.imageFiles, this.selectedFile_video).subscribe(res => {
      this.project.zipPath = res.fileUrl;
      this.project.thumbnailUrl = res.thumbnailUrl;
      this.project.images = res.imageUrls;
      this.project.demoUrl = res.video;
      this._project.postData(this.project).subscribe(data => {
        this.close();
        this.newData.emit(data);
        this._notification.showSuccess('1003');
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


  selectedFile_video: File | null = null;
  onFileSelected_video(event: any) {
    this.selectedFile_video = event.target.files[0];
  }

  selectedTags: any[] = [];

  selectTag(tag: any) {
    const exists = this.selectedTags.find(t => t.id === tag.id);
    if (!exists) {
      this.selectedTags.push(tag);
      this.project.tagIds = this.selectedTags.map(t => t.id);
    }
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
  previewImages: string[] = [];
  imageFiles: File[] = [];


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

  // Nhiều ảnh
  onFileSelected_images(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.imageFiles = Array.from(input.files);
      // console.log(this.imageFiles);
      this.previewImages = [];

      this.imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImages.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
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
    this.project.slug = this.toSlug(this.project.title);
  }

  removeSelectedZip() {
    this.selectedFile_zip = null;
    this.project.zipPath = '';
  }

  close() {
    this.closeProjectAdd.emit();
  }

  //#region  css màu cho mô tả
  onInputDescription(editor: HTMLElement) {
    this.project.description = editor.innerHTML;
  }

  onInputInstallationGuide(editor: HTMLElement) {
    this.project.installationGuide = editor.innerHTML;
  }

  exec(editor: HTMLElement, command: string, value?: any) {
    editor.focus();
    document.execCommand(command, false, value);
  }

  changeColor(editor: HTMLElement, event: Event) {
    const color = (event.target as HTMLInputElement).value;
    editor.focus();
    document.execCommand('foreColor', false, color);
  }

  insertImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      document.execCommand('insertImage', false, reader.result as string);
    };
    reader.readAsDataURL(file);
  }

}
