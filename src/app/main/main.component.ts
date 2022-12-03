import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  activeUser: any;
  constructor(
    private authService: AuthService
  ) { 
    this.activeUser = JSON.parse(localStorage.getItem('user')!);
  }

  ngOnInit(): void {
  }

  //set the user status to offline in case of close tab
  @HostListener('window:beforeunload', [ '$event' ])
  async beforeUnloadHandler(e) {
    e.preventDefault();
    e.returnValue = '';
    await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
      isOnline: false
    });
  }

}
