import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isMenuOpen = false;

  menuItems = [
    { icon: '📊', label: 'Doanh thu', route: '/admin/revenue', funId: '1000' },
    { icon: '📁', label: 'Loại code', route: '/admin/category', funId: '1001' },
    { icon: '💻', label: 'Mã nguồn', route: '/admin/project', funId: '1001' },
    {
      icon: '🧾',
      label: 'Đơn hàng',
      // route: '/admin/orders',
      funId: '1003',
      isOpen: false,
      subMenu: [
        { label: 'Chưa thanh toán', route: '/admin/orders/pending' },
        { label: 'Đã thanh toán', route: '/admin/orders/paid' },
        { label: 'Đang giao', route: '/admin/orders/shipping' }
      ]
    },
    { icon: '👨‍💼', label: 'Nhân viên', route: '/admin/employees', funId: '1005' },
    // { icon: '📊', label: 'Doanh thu', route: '/admin/revenue', funId: '1006' },
    { icon: '⚙️', label: 'Cài đặt', route: '/admin/settings', funId: '1007' },
  ];

  toggleSubMenu(item: any) {
    if (item.subMenu) {
      item.isOpen = !item.isOpen;
    }
  }

}
