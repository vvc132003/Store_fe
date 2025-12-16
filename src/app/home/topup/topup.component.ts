import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.scss']
})
export class TopupComponent {
 activeTab = 1;

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
