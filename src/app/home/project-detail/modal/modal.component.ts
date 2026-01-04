import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnChanges {
  @Input() isTypeOpen = false;
  @Input() project_dw: any = {};
  @Input() currentUser: any = {};

  @Output() closeTypeModal = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  constructor(private orderService: OrderService, private notificationService: NotificationService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  download_dw(project: any) {
    if (!this.currentUser || this.currentUser.balance <= project.price) {
      this.notificationService.showError("1028");
      return;
    }
    this.download.emit(project);
  }

  closeType() {
    this.isTypeOpen = false;
    this.closeTypeModal.emit();
  }
}