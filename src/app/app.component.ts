import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'source-code-store';
  showSessionWarning$ = this._user.showWarning$;
  constructor(private _user: UserService) { }
}
