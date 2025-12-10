import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnChanges {
  showButtons = false;

  buttons: any[] = [
    { id: '101', funId: '1001', label: 'Thêm', icon: 'fa-plus', type: 'primary', class: '', display: 'block', language: 'vi', action: () => this.event('101') },
    { id: '102', funId: '1001', label: 'Cập nhật', icon: 'fa-refresh', type: 'warning', class: '', display: 'block', language: 'vi', action: () => this.event('102') },
    { id: '103', funId: '1001', label: 'Xem', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'vi', action: () => this.event('103') },
    { id: '104', funId: '1001', label: 'Xoá', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'vi', action: () => this.event('104') },

    { id: '106', funId: '1003', label: 'Hoàn tất', icon: 'fa-check', type: 'success', class: '', display: 'block', language: 'vi', action: () => this.event('106') },

    { id: '108', funId: '1002', label: 'Tạo đơn', icon: 'fa-file-invoice', type: '', class: 'custom-create-btn', display: 'block', language: 'vi', action: () => this.event('108') },
    { id: '101', funId: '1002', label: 'Thêm', icon: 'fa-plus', type: 'primary', class: '', display: 'block', language: 'vi', action: () => this.event('101') },
    { id: '105', funId: '1002', label: 'Sao chép', icon: 'fa-copy', type: '', class: 'btn-custom-copy', display: 'block', language: 'vi', action: () => this.event('105') },
    { id: '102', funId: '1002', label: 'Cập nhật', icon: 'fa-refresh', type: 'warning', class: '', display: 'block', language: 'vi', action: () => this.event('102') },
    { id: '103', funId: '1002', label: 'Xem', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'vi', action: () => this.event('103') },
    { id: '104', funId: '1002', label: 'Xoá', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'vi', action: () => this.event('104') },
    { id: '109', funId: '1002', label: 'Thêm khu vực', icon: 'fa-plus', type: 'success', class: '', display: 'block', language: 'vi', action: () => this.event('109') },
    { id: '110', funId: '1002', label: 'Chuyển bàn', icon: 'fa-random', type: 'primary', class: '', display: 'block', language: 'vi', action: () => this.event('110') },
    { id: '111', funId: '1002', label: 'Thanh toán', icon: 'fa-money-bill-wave', type: 'success', class: '', display: 'block', language: 'vi', action: () => this.event('111') },
    { id: '112', funId: '1002', label: 'Huỷ đơn', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'vi', action: () => this.event('112') },
    { id: '113', funId: '1002', label: 'In hóa đơn', icon: 'fa-print', type: '', class: 'btn-custom-print', display: 'block', language: 'vi', action: () => this.event('113') },
    { id: '114', funId: '1002', label: 'Xem thông tin khách hàng', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'vi', action: () => this.event('114') },
    { id: '115', funId: '1002', label: 'Tách đơn', icon: 'fa-scissors', type: '', class: 'btn btn-warning', display: 'block', language: 'vi', action: () => this.event('115') },

    { id: '101', funId: '1005', label: 'Thêm', icon: 'fa-plus', type: 'primary', class: '', display: 'block', language: 'vi', action: () => this.event('101') },
    { id: '102', funId: '1005', label: 'Cập nhật', icon: 'fa-refresh', type: 'warning', class: '', display: 'block', language: 'vi', action: () => this.event('102') },
    { id: '103', funId: '1005', label: 'Xem', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'vi', action: () => this.event('103') },
    { id: '104', funId: '1005', label: 'Xoá', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'vi', action: () => this.event('104') },

    /* --- ENGLISH --- */

    { id: '101', funId: '1001', label: 'Add', icon: 'fa-plus', type: 'primary', class: '', display: 'block', language: 'en', action: () => this.event('101') },
    { id: '102', funId: '1001', label: 'Update', icon: 'fa-refresh', type: 'warning', class: '', display: 'block', language: 'en', action: () => this.event('102') },
    { id: '103', funId: '1001', label: 'View', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'en', action: () => this.event('103') },
    { id: '104', funId: '1001', label: 'Delete', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'en', action: () => this.event('104') },

    { id: '106', funId: '1003', label: 'Complete', icon: 'fa-check', type: 'success', class: '', display: 'block', language: 'en', action: () => this.event('106') },

    { id: '108', funId: '1002', label: 'Create Order', icon: 'fa-file-invoice', type: '', class: 'custom-create-btn', display: 'block', language: 'en', action: () => this.event('108') },
    { id: '101', funId: '1002', label: 'Add', icon: 'fa-plus', type: 'primary', class: '', display: 'block', language: 'en', action: () => this.event('101') },
    { id: '105', funId: '1002', label: 'Copy', icon: 'fa-copy', type: '', class: 'btn-custom-copy', display: 'block', language: 'en', action: () => this.event('105') },
    { id: '102', funId: '1002', label: 'Update', icon: 'fa-refresh', type: 'warning', class: '', display: 'block', language: 'en', action: () => this.event('102') },
    { id: '103', funId: '1002', label: 'View', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'en', action: () => this.event('103') },
    { id: '104', funId: '1002', label: 'Delete', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'en', action: () => this.event('104') },
    { id: '109', funId: '1002', label: 'Add Area', icon: 'fa-plus', type: 'success', class: '', display: 'block', language: 'en', action: () => this.event('109') },
    { id: '110', funId: '1002', label: 'Move Table', icon: 'fa-random', type: 'primary', class: '', display: 'block', language: 'en', action: () => this.event('110') },
    { id: '111', funId: '1002', label: 'Payment', icon: 'fa-money-bill-wave', type: 'success', class: '', display: 'block', language: 'en', action: () => this.event('111') },
    { id: '112', funId: '1002', label: 'Cancel Order', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'en', action: () => this.event('112') },
    { id: '113', funId: '1002', label: 'Print Invoice', icon: 'fa-print', type: '', class: 'btn-custom-print', display: 'block', language: 'en', action: () => this.event('113') },
    { id: '114', funId: '1002', label: 'View Customer Info', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'en', action: () => this.event('114') },
    { id: '115', funId: '1002', label: 'Split Order', icon: 'fa-scissors', type: '', class: 'btn btn-warning', display: 'block', language: 'en', action: () => this.event('115') },

    { id: '101', funId: '1005', label: 'Add', icon: 'fa-plus', type: 'primary', class: '', display: 'block', language: 'en', action: () => this.event('101') },
    { id: '102', funId: '1005', label: 'Update', icon: 'fa-refresh', type: 'warning', class: '', display: 'block', language: 'en', action: () => this.event('102') },
    { id: '103', funId: '1005', label: 'View', icon: 'fa-eye', type: 'secondary', class: '', display: 'block', language: 'en', action: () => this.event('103') },
    { id: '104', funId: '1005', label: 'Delete', icon: 'fa-trash', type: 'danger', class: '', display: 'block', language: 'en', action: () => this.event('104') }
  ];

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) { }


  @Output() showPupAdd = new EventEmitter<string>();
  @Output() showButtonss = new EventEmitter<any>();

  @Input() text: string = "";
  @Input() count: number = 0;
  @Input() buttonNone: any[] = [];
  @Input() tableName: string = "";

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['buttonNone']) {
      this.buttonNone = this.buttonNone;
      this.loadButtons();
    }
    if (changes['language'] && !changes['language'].firstChange) {
      this.filterButtonsByLanguage();
    }
  }

  @Input() language: string = "";

  loadButtons(): void {
    if (this.rawButtons.length > 0) return;

    this.funId = this.route.snapshot.paramMap.get('funId') || '';
    this.rawButtons = this.buttons.filter((data: any) => data.funId === this.funId);
    this.filterButtonsByLanguage();

  }

  filterButtonsByLanguage(): void {
    const lang = localStorage.getItem('selectedLanguage')?.toLowerCase() || 'vi';

    this.buttons = this.rawButtons
      .filter((btn: any) => btn.language?.toLowerCase() === lang)
      .map(btn => ({
        ...btn,
        action: () => this.event(btn.id)
      }));
    // console.log(this.buttons);
    this.buttonNone = this.buttons;
    // this.cdr.detectChanges(); // buộc Angular cập nhật view

    // this.showButtonss.emit(this.buttons);
  }


  rawButtons: any[] = [];
  funId: string = '';

  ngOnInit(): void {
    // this.funId = this.route.snapshot.paramMap.get('funId') || '';

    // this.toolbarButtonsService.getToolbarButtons().subscribe((data: any) => {
    //   this.rawButtons = data;
    //   console.log("bt", data);
    //   this.buttons = this.rawButtons.map(btn => ({
    //     ...btn,
    //     action: () => this.event(btn.id)
    //   }));

    //   const filteredButtons = this.buttons.filter(btn => btn.funId === this.funId);
    //   this.showButtonss.emit(filteredButtons);
    // })


  }

  //#region  event

  toggleButtons() {
    this.showButtons = !this.showButtons;
  }

  event(buttonId: string) {
    this.showPupAdd.emit(buttonId);
    this.showButtons = false;
  }

  getButtonClass(type: string) {
    // console.log(type);
    switch (type) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'warning': return 'btn-warning';
      case 'danger': return 'btn-danger';
      case 'success': return 'btn-success';
      default: return 'light';
    }
  }
}

