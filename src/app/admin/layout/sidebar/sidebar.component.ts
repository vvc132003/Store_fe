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
      // isOpen: false,
      // subMenu: [
      //   { label: 'Chưa thanh toán', route: '/admin/orders/pending' },
      //   { label: 'Đã thanh toán', route: '/admin/orders/paid' },
      //   { label: 'Đang giao', route: '/admin/orders/shipping' }
      // ]
    },
    { icon: '👤', label: 'Khách hàng', route: '/admin/customer', funId: '1003' },
    {
      icon: '💳', label: 'Thanh toán',
      // route: '/admin/payment',
      funId: '1004',
      isOpen: false,
      subMenu: [
        { label: 'Giao dịch nạp tiền', route: '/admin/payment/deposit', funId: '1004-1' },
        { label: 'Giao dịch rút tiền', route: '/admin/payment/withdraw', funId: '1004-2' },
      ]
    },
    {
      icon: '💾',
      label: 'Code đã lưu',
      route: '/admin/favorite-code',
      funId: '1007'
    },
    { icon: '📝', label: 'Nội dung', route: '/admin/content', funId: '1009' },
    // { icon: '📊', label: 'Doanh thu', route: '/admin/revenue', funId: '1006' },
    {
      icon: '⚙️', label: 'Cài đặt', route: '/admin/settings', funId: '1007',
      isOpen: false,
      subMenu: [
        { label: 'Thông tin website', route: '/admin/settings/website', funId: '1007-1' },
        { label: 'Bảo mật', route: '/admin/settings/security', funId: '1007-2' },
        { label: 'Email & Thông báo', route: '/admin/settings/notification', funId: '1007-3' },
        { label: 'Backup & Restore', route: '/admin/settings/backup', funId: '1007-4' },
        { label: 'Thanh toán', route: '/admin/settings/payment', funId: '1007-5' }
      ]
    },
  ];

  toggleSubMenu(item: any) {
    if (item.subMenu) {
      item.isOpen = !item.isOpen;
    }
  }

}
