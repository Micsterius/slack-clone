import { Component, HostListener } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from './shared/services/auth.service';
import { GeneralService } from './shared/services/general.service';
import { UsersService } from './shared/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  windowWidth;
  windowHeight;

  title = 'slack-clone';
  constructor(
    public authService: AuthService,
    private userService: UsersService,
    private generalService: GeneralService) {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user) this.authService.showLoginArea = false;
    else this.authService.showLoginArea = true;

    userService.loadUsers();
    userService.loadUsersAdditionalInfos();
  }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    if (window.innerWidth < 800) this.generalService.mobilViewIsActive = true;
    this.loadColor();
  }

  @HostListener('window:resize', ['$event'])

  resizeWindow() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    if (window.innerWidth < 800) this.generalService.mobilViewIsActive = true;
  }

  getMainColor() {
    return localStorage.getItem('mainColor');
  }

  getSecColor() {
    return localStorage.getItem('secColor');
  }

  getBackgroundColor() {
    return localStorage.getItem('backgroundColor')
  }

  loadColor() {
    document.documentElement.style.setProperty('--main-color', this.getMainColor());
    document.documentElement.style.setProperty('--secondary-color', this.getSecColor());
    document.documentElement.style.setProperty('--background-color', this.getBackgroundColor());
  }
}

