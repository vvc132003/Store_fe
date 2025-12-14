import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.scss']
})
export class PagesLoginComponent implements OnInit {


  constructor(private titleService: Title) { }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.titleService.setTitle("Đăng Nhập");
  }
  email = '';
  password = '';

  onSubmit() {
    console.log(this.email, this.password);
    // call API login tại đây
  }
}
