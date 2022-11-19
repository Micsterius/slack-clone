import { Component } from '@angular/core';
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

/* funktioniert nicht 
 async checkIfUserExistInFirestore(user) {
    const docRef = doc(this.db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      this.authService.showLoginArea = false;
    } else {
      // doc.data() will be undefined in this case
      this.authService.showLoginArea = true;
    }
  }*/
}

