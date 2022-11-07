import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'slack-clone';
  constructor(public authService: AuthService) {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user) authService.showLoginArea = false;
    else authService.showLoginArea = true;
  }
}
