import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  @Output() currentNotification = new EventEmitter<any>();

  @Output() countnotis = new EventEmitter<number>();


  constructor(private _notification: NotificationService, private sanitizer: DomSanitizer, private datePipe: DatePipe, private cookieService: CookieService) { }
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
  currentUser: any;

  countnoti: number = 0;
  loadNotificationByUserId() {
    const token = this.cookieService.get('access_token');
    if (!token) {
      return;
    }
    const payload = this.parseJwt(token);
    this.currentUser = payload.unique_name;
    // console.log(this.currentUser);
    this.loadSoket(payload);
    const userId = payload?.role === 'admin' ? undefined : payload?.nameid;
    this.subscription.add(
      this._notification.getNotification(userId).subscribe((data: any[]) => {
        this.notifications = data;
        // this.countnoti = data.length;
        if (payload?.role === 'admin') {
          this.countnotis.emit(0);
          return;
        }
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        this.countnoti = unreadCount;
        this.countnotis.emit(unreadCount);
        // console.log(data);
      })
    )
  }


  markAsRead(n: any) {
    const token = this.cookieService.get('access_token');
    if (!token) return;

    const payload = this.parseJwt(token);
    if (payload?.role === 'admin') return;

    if (n.isRead) return;

    this._notification.markAsRead(n.id).subscribe(() => {
      n.isRead = true;
      this.countnoti = this.notifications.filter(x => !x.isRead).length;
      this.countnotis.emit(this.countnoti ?? 0);
    });
  }



  getFormattedTime(dateStr: string | Date): string | null {
    const date = new Date(dateStr);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return null;
    }
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (diffMinutes < 1) {
      return 'Vừa xong';
    } else if (diffMinutes < 60 && isToday) {
      return `${diffMinutes} phút trước`;
    } else if (isToday) {
      return this.datePipe.transform(date, 'HH:mm') ?? 'ngày';
    } else if (isYesterday) {
      return `Hôm qua ${this.datePipe.transform(date, 'HH:mm') ?? ''}`;
    } else if (date.getFullYear() === now.getFullYear()) {
      return this.datePipe.transform(date, 'dd/MM HH:mm') ?? '';
    } else {
      return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') ?? '';
    }
  }

  sanitizeMessage(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(message);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this._notification.stopConnection1();
  }
  //#region  event
  close() {
    this.showoNotification = false;
    this.closePupAdd.emit();
  }


  loadSoket(data: any) {
    this.subscription.add(
      this._notification.startConnection1(data.nameid).subscribe(() => {
        this._notification.loadNotification().subscribe((res: any) => {
          this.newNotification(res);
        })
      })
    )
  }


  newNotification(data: any) {
    this.countnoti += 1;
    this.countnotis.emit(this.countnoti);
    this.notifications = [data, ...this.notifications];
    this.currentNotification.emit(data);
  }

}