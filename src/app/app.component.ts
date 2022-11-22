import { Component, HostListener } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from './shared/services/auth.service';
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
  
  title = 'slack-clone';
  constructor(
    public authService: AuthService,
    private userService: UsersService) {
    let user = JSON.parse(localStorage.getItem('user'))
    if(user) this.authService.showLoginArea = false;
    else this.authService.showLoginArea = true;

    userService.loadUsers();
    userService.loadUsersAdditionalInfos();
  }

  ngOnInit(){
    this.windowWidth = window.innerWidth;
  }

  /*
  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    const userId = this.authService.userData.uid; // get user id
    await this.authService.SignOut(); // sign out user
  }
  */
}

