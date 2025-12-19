import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

  notifications: any[] = [];
  avatar: string = 'https://randomuser.me/api/portraits/men/32.jpg';
  notificationss: any[] = [
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

  constructor(private _notification: NotificationService, private cookieService: CookieService) { }
  private subscription = new Subscription();
  private parseJwt(token: string): any {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    const utf8 = decodeURIComponent(
      decoded
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(utf8);
  }
  ngOnInit(): void {
    this.loadNotificationByUserId();
  }

  loadNotificationByUserId() {
    const token = this.cookieService.get('access_token');
    if (!token) {
      return;
    }
    const payload = this.parseJwt(token);
    this.subscription.add(
      this._notification.getNotificationByUserId(payload?.nameid).subscribe((data: any) => {
        this.notifications = data;
        // console.log(data);
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  //#region  event
  close() {
    this.showoNotification = false;
    this.closePupAdd.emit();
  }
}