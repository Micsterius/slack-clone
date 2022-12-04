import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/services/auth.service';
import { UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  activeUser: any;
  storageTime;
  time = 0;

  pageReloaded = window.performance
    .getEntriesByType('navigation')
    .map((nav) => (nav as any).type)
    .includes('reload');

  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {
    userService.loadUsers();
    userService.loadUsersAdditionalInfos();
    this.activeUser = JSON.parse(localStorage.getItem('user')!);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.userIsAway()
      else this.userIsStillActive()
    })

    document.addEventListener('touchstart', () => {
      this.userIsStillActive()
    })
  }

  async userIsStillActive() {
    if (await this.authService.UserDataExist()) {
      let newTime = Math.round(new Date().getTime() / 1000);
      if (newTime - this.time > 300) {
        this.time = newTime;
        await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
          timeStampLastActivity: newTime,
          isOnline: true,
          isAway: false
        });
      }
    }
  }

  ngOnInit(): void {
  }

  async userIsAway() {
    if (await this.authService.UserDataExist()) {
      let newTime = Math.round(new Date().getTime() / 1000);
      if (await this.authService.UserDataExist()) {
        await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
          timeStampLastActivity: newTime,
          isAway: true
        });
      }
    }
  }
}
