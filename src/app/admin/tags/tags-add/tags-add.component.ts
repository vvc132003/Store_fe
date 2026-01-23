import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { TagsService } from 'src/app/services/tags.service';


@Component({
  selector: 'app-tags-add',
  templateUrl: './tags-add.component.html',
  styleUrls: ['./tags-add.component.scss']
})
export class TagsAddComponent implements OnChanges, OnDestroy {
  FRONTEND_ICONS = [
    'fa-html5',
    'fa-css3-alt',
    'fa-js',
    'fa-angular',
    'fa-react',
    'fa-vuejs',
    'fa-sass',
    'fa-bootstrap'
  ];
  BACKEND_ICONS = [
    'fa-node-js',
    'fa-java',
    'fa-python',
    'fa-php',
    'fa-golang',
    'fa-dotnet',
    'fa-server',
    'fa-terminal'
  ];
  DATABASE_ICONS = [
    'fa-database',
    'fa-envira',
    'fa-leaf',
  ];
  FRAMEWORK_ICONS = [
    'fa-laravel',
    'fa-symfony',
    'fa-spring',
    'fa-express',
    'fa-nextjs',
    'fa-nestjs',
  ];
  DEVOPS_ICONS = [
    'fa-docker',
    'fa-git-alt',
    'fa-github',
    'fa-gitlab',
    'fa-jenkins',
    'fa-linux',
    'fa-windows'
  ];
  ALL_PROGRAMMING_ICONS = [
    ...this.FRONTEND_ICONS,
    ...this.BACKEND_ICONS,
    ...this.DATABASE_ICONS,
    ...this.FRAMEWORK_ICONS,
    ...this.DEVOPS_ICONS
  ];

  getIconClass(icon: string): string {
    const brands = [
      'fa-angular', 'fa-react', 'fa-vuejs',
      'fa-html5', 'fa-css3-alt', 'fa-js',
      'fa-node-js', 'fa-bootstrap',
      'fa-github', 'fa-gitlab',
      'fa-docker', 'fa-linux', 'fa-windows'
    ];

    if (brands.includes(icon)) {
      return 'fab';   // Brand icon
    }

    if (icon) {
      return 'fas';   // Solid icon
    }

    return 'fa';      // Fallback (hiếm khi dùng)
  }

  selectIcon(icon: string) {
    this.newtag.icon = icon;
  }
  private subscription = new Subscription();

  constructor(private _tag: TagsService) { }

  @Input() showtags_add = false;
  @Input() data: any;
  @Input() newtag: any = {};
  @Output() newData = new EventEmitter<void>();

  @Output() closetags_Add = new EventEmitter<void>();
  text: string = "";
  action: string = "";
  tables = [
    { label: 'Thông tin thẻ', icon: 'bi-collection', tab: 'category' },
  ];


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.data = { ...changes['data'].currentValue };
      this.text = this.data.text;
      this.action = this.data.action;
    }
    if (changes['category'] && changes['category'].currentValue) {
      this.newtag = { ...changes['category'].currentValue };
      // console.log(this.category);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.newtag.slug = this.toSlug(this.newtag.name);
  }

  save(): void {
    if (this.action === "add") {
      this.saveTag();
    } else {
      this.updatetag();
    }
  }

  saveTag() {
    this.subscription.add(
      this._tag.postData(this.newtag).subscribe((res: any) => {
        this.newData.emit(res);
        this.close();
      })
    )
  }
  updatetag() {
    this.subscription.add(
      this._tag.updateData(this.newtag).subscribe((res: any) => {
        this.newData.emit(res);
        this.close();
      })
    )
  }


  close() {
    this.closetags_Add.emit();
  }

}
