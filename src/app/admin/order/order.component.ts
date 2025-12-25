import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {


  showUser_add = false;
  newUser: any = {};
  data: any = {};
  orders: any[] = [];
  order_id: any = {};
  count: number = 0;




  constructor(private titleService: Title, private _order: OrderService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý code đã bán');
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadOrder() {
    this.subscription.add(
      this._order.getData().subscribe((data: any) => {
        this.orders = data.sort((a: any, b: any) => {
          return b.id.localeCompare(a.id);
        });

        this.order_id = this.orders[0];
        this.count = this.orders.length;
      })
    );
  }

  //#region event
  selectOrder(event: any) {
    this.order_id = event;
  }


  click(event: any) {
    // this.isModalVisible = true;
    console.log(event)

    const modalMap: { [key: string]: () => void } = {
      '101': () => setTimeout(() => this.showUser_add = true, 0),
      '102': () => setTimeout(() => this.showUser_add = true, 0)
    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '105':
        this._order.exportOrdersExcel().subscribe({
          next: (res: Blob) => {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Orders.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            // console.error('Download failed', err);
            // alert('Xuất file thất bại!');
          }
        }); break;
      case '106':
        this._order.exportOrdersPdf().subscribe({
          next: (res: Blob) => {
            const url = window.URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Orders.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            // console.error('Download failed', err);
            // alert('Xuất file thất bại!');
          }
        }); break;
      default:
        break;
    }
  }



}