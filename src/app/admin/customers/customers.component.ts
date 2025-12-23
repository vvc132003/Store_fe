import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, OnDestroy {


  showUser_add = false;
  newUser: any = {};
  data: any = {};
  users: any[] = [];
  user_id: any = {};
  count: number = 0;




  constructor(private titleService: Title, private _user: UserService) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle('Quản lý khách hàng');
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadUsers() {
    this.subscription.add(
      this._user.getData().subscribe((data: any) => {
        this.users = data.sort((a: any, b: any) => {
          return b.id.localeCompare(a.id);
        });

        // console.log(this.categories);
        this.user_id = this.users[0];
        this.count = this.users.length;
        // if (this.pendingActions.length > 0) {
        //   this.evetnbuttons(this.pendingActions);
        //   // this.pendingActions = [];
        // }
      })
    );
  }

  //#region event
  selectUser(event: any) {
    this.user_id = event;
    // this.evetnbuttons(this.pendingActions);
    // console.log(event);
    // console.log(this.drink);
  }


  click(event: any) {
    // this.isModalVisible = true;

    const modalMap: { [key: string]: () => void } = {
      '101': () => setTimeout(() => this.showUser_add = true, 0),
      '102': () => setTimeout(() => this.showUser_add = true, 0)
    };

    const openModal = modalMap[event];
    if (openModal) {
      openModal();
    }
    switch (event) {
      case '101':
        // this.showoffcanvas = true;
        this.newUser = {};
        this.data = {
          action: 'add',
          text: 'Thêm khách hàng'
        };
        break;
      case '102':
        // this.showoffcanvas = true;
        this.newUser = this.users.find(dr => dr.id == this.user_id.id);
        this.data = {
          action: 'update',
          text: 'Cập nhật khách hàng'
        };
        break;
      case '103':
        break;
      case '104':
        this._user.deleteData(this.user_id.id).subscribe(data => {
          this.users = this.users.filter(d => d.id !== this.user_id.id);
          this.user_id = this.users[0];
        })
        break;
      default:
        break;
    }
  }
  newData(data: any) {
    const index = this.users.findIndex(c => c.id === data.id);
    if (index === -1) {
      this.count += 1;
      // this.categories.unshift(data);
      this.users = [data, ...this.users];
    } else {
      const updated = [...this.users];
      updated[index] = data;
      this.users = updated;
    }
    this.user_id = data;
    // if (this.pendingActions.length > 0) {
    //   this.evetnbuttons(this.pendingActions);
    //   // this.pendingActions = [];
    // }
  }

  close() {
    // this.showDetail = false;
    this.showUser_add = false;
    setTimeout(() => {
      // this.isModalVisible = false;
    }, 400);
  }

}