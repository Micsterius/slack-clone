import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  users: any[] = [];
  constructor() { }

  async loadChat() {
    let q = query(collection(this.db, "users"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.users = [];
      querySnapshot.forEach((doc) => {
        this.users.push(doc.data())
      })
    });
  }
}
