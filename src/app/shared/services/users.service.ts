import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  users: any[] = [];
  usersAdditionalInfos: any[] = [];
  constructor(
    public dialog: MatDialog
  ) { }

  async loadUsers() {
    let q = query(collection(this.db, "users"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.users = [];
      querySnapshot.forEach((doc) => {
        this.users.push(doc.data())
      })
    });
  }

  async loadUsersAdditionalInfos() {
    let q = query(collection(this.db, "more-user-infos"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.usersAdditionalInfos = [];
      querySnapshot.forEach((doc) => {
        this.usersAdditionalInfos.push(doc.data())
      })
      this.checkUsersLastActivity()
    });
  }

  returnUsersPhotoUrl(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'icon-unknown.svg'
    else return user.photoURL
  }

  returnUsersDisplayName(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'Anonym'
    else return user.displayName
  }

  returnUsersMail(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'No mail available'
    else return user.email
  }

  returnUsersPhoneNumber(uid) {
    let user = this.usersAdditionalInfos.find(user => user.uid == uid)
    if (user == undefined) return 'No Phone'
    else return user.phoneNumber
  }

  returnUserStatus(uid) {
    let user = this.usersAdditionalInfos.find(user => user.uid == uid)
    if (user == undefined) return false;
    else if (user.isOnline) return true
    else return false
  }

  async checkUsersLastActivity() {
    for (let i = 0; i < this.usersAdditionalInfos.length; i++) {
      const user = this.usersAdditionalInfos[i];
      //only if user is online it has to be proofed if he is away
      if (user.isOnline) {
        let newTime = Math.round(new Date().getTime() / 1000);
        if (newTime - user.timeStampLastActivity > 600) {
          await updateDoc(doc(this.db, "more-user-infos", user.uid), {
            isOnline: false
          });
        }
      }
    }
  }
}
