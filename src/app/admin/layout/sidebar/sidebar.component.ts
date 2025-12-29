import { Component } from '@angular/core';



interface SubMenu {
  icon?: string;
  label: string;
  route: string;
  funId: string;
}

interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  funId: string;
  isOpen?: boolean;
  subMenu?: SubMenu[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent {
  isMenuOpen = false;

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Doanh thu', route: '/mbcode/admin/revenue', funId: '1000' },
    { icon: '📁', label: 'Loại code', route: '/mbcode/admin/category', funId: '1001' },
    {
      icon: '⬆️',
      label: 'Code tải lên',
      route: '/mbcode/admin/project',
      funId: '1001'
    },
    {
      icon: '💰',
      label: 'Code đã bán',
      route: '/mbcode/admin/order',
      funId: '1005'
    },
    { icon: '👤', label: 'Khách hàng', route: '/mbcode/admin/customer', funId: '1003' },
    {
      icon: '🏦', label: 'Giao dịch',
      funId: '1004',
      isOpen: false,
      subMenu: [
        { icon: '➕', label: 'Giao dịch nạp tiền', route: '/mbcode/admin/deposit', funId: '1004-1' },
        { icon: '➖', label: 'Giao dịch trừ tiền', route: '/mbcode/admin/withdraw', funId: '1004-2' },
      ]
    },
    {
      icon: '💾',
      label: 'Code đã lưu',
      route: '/mbcode/admin/favorite-code',
      funId: '1007'
    },
    { icon: '📝', label: 'Nội dung', route: '/mbcode/admin/content', funId: '1009' },
    // { icon: '📊', label: 'Doanh thu', route: '/admin/revenue', funId: '1006' },
    {
      icon: '⚙️', label: 'Cài đặt', route: '/mbcode/admin/settings', funId: '1010'
    },
  ];

  toggleSubMenu(item: MenuItem) {
    if (!item.subMenu) return;

    // đóng menu khác
    this.menuItems.forEach(i => {
      if (i !== item) i.isOpen = false;
    });

    item.isOpen = !item.isOpen;
  }

}
