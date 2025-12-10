import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  notifications: any[] = [
    {
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      username: 'Nguyễn Văn A',
      message: 'Đã thêm sản phẩm mới vào kho.',
      time: '5 phút trước'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      username: 'Trần Thị B',
      message: 'Đơn hàng #1234 đã được thanh toán.',
      time: '15 phút trước'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
      username: 'Lê Văn C',
      message: 'Có bình luận mới trên sản phẩm.',
      time: '1 giờ trước'
    },
    {
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      username: 'Phạm Thị D',
      message: 'Cập nhật trạng thái đơn hàng #1235.',
      time: '2 giờ trước'
    }
  ];
@Input() showoNotification!: boolean;
  @Output() closePupAdd = new EventEmitter<void>();

  close() {
    this.showoNotification = false;
    this.closePupAdd.emit();
  }
}