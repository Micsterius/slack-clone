import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { collection, doc, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  currentUserChat: any;
  actualUser: any;
  allChatsId: any;
  allChats: any;
  showChatsWithFriends: boolean = false;
  arrayOfFriendsWithChatUid: any[] = [];
  arrayOfUsersWithChat: any[] = [];
  currentChatId: any = '';
  messages: any[] = [];

  testArray: any[] = [];
  showChat: boolean = false;

  storage = getStorage();

  constructor(private router: Router,
    public afs: AngularFirestore) {
  }
  /**
   * In this function will be get at first all docs form collection posts which contains the actual user uid.
   * Then the user uids of the person who write with the current user will be pushed in the array "arrayOfFriendsWithChatUid"
   * also the doc id will be pushed for further reading the subCollection
   */
  async loadChats() {
    this.arrayOfFriendsWithChatUid.length = 0;
    this.actualUser = JSON.parse(localStorage.getItem('user'))
    let q = query(collection(this.db, "posts"), where("authors", "array-contains", this.actualUser.uid));
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.arrayOfFriendsWithChatUid = [];
      this.showChat = false;
      querySnapshot.forEach((doc) => {
        if (doc.data()['authors'][0] != this.actualUser.uid) this.arrayOfFriendsWithChatUid.push({ author: doc.data()['authors'][0], id: doc.data()['id'] });
        if (doc.data()['authors'][1] != this.actualUser.uid) this.arrayOfFriendsWithChatUid.push({ author: doc.data()['authors'][1], id: doc.data()['id'] });
        this.showChatsWithFriends = true
      })
      this.showChat = true;
    });
    this.showChat = true;
  }

  //give the id of document in the document as a field
  async updateIdInFirestorePostsDocs(id) {
    let docRef = doc(this.db, "posts", id);
    await updateDoc(docRef, { id: id })
  }

  saveCurrentChatId(chatId) {
    this.currentChatId = chatId;
    this.loadChat();
    this.findChatInList(chatId)
  }

  findChatInList(chatId) {
    this.currentUserChat = this.arrayOfFriendsWithChatUid.find((chat) => chat.id == chatId);
  }

  async loadChat() {
    let q = query(collection(this.db, "posts", this.currentChatId, "texts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.messages = [];
      this.showChat = false;
      querySnapshot.forEach((doc) => this.messages.push(doc.data()))
      this.loadImagesForChatTexts();
    });
  }

  loadImagesForChatTexts() {
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].imageUrl.length > 0) this.getImageForChatTexts(i);
    }
    this.showChat = true;
  }

  getImageForChatTexts(i) {
    for (let j = 0; j < this.messages[i].imageUrl.length; j++) {
      const imageUrl = this.messages[i].imageUrl[j];
      getDownloadURL(ref(this.storage, 'uploads/' + imageUrl))
        .then((url) => {
          this.messages[i].imageUrl[j] = `<img src="${url}" alt="">`;
          console.log(this.messages)
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            // ...
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        });
    }
  }
}
