import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-balance',
  templateUrl: './update-balance.component.html',
  styleUrls: ['./update-balance.component.scss']
})
export class UpdateBalanceComponent implements OnChanges {
  @Input() showUpdateBalance = false;
  @Input() data: any;
  @Input() user: any = {};
  balance: number = 0;
  @Output() newData = new EventEmitter<void>();

  @Output() closeBalanceUpdate = new EventEmitter<void>();

  text: string = "";
  action: string = "";

  tables = [
    { label: 'Nạp tiền', icon: 'fa-money-bill', tab: 'category' },
  ];

  constructor(private _user: UserService, private _notification: NotificationService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue) {
      this.user = { ...changes['user'].currentValue };
    }
  }

  close() {
    this.closeBalanceUpdate.emit();
  }


  save() {
    this._user.updateBalanceMoney(this.user.id, this.balance).subscribe((data: any) => {
      this.close();
      this.newData.emit(data);
      this._notification.showSuccess('1038');
    })
  }
}