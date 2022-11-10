import { identifierName } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
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
    this.allChatsId = query(collection(this.db, "posts"), where("authors", "array-contains", this.actualUser.uid));
    this.allChats = await getDocs(this.allChatsId);
    this.allChats.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc.data().authors[0] != this.actualUser.uid) this.arrayOfFriendsWithChatUid.push({ author: doc.data().authors[0], id: doc.data().id });
      if (doc.data().authors[1] != this.actualUser.uid) this.arrayOfFriendsWithChatUid.push({ author: doc.data().authors[1], id: doc.data().id });
      this.getUserInfo()
    });
  }

  async getUserInfo() {
    this.arrayOfUsersWithChat.length = 0;
    this.arrayOfFriendsWithChatUid.forEach(async (obj) => {
      let docRef = doc(this.db, "users", obj.author); //search in the users collection for the user with the same uid as the author uid//search in the users collection for the user with the same uid as the author uid
      let docSnap = await getDoc(docRef);
      let user;
      if (docSnap.exists()) {
        if (!this.arrayOfUsersWithChat.some((friend) => friend.uid == docSnap.data()["uid"])) { //user is not already in array
          user = docSnap.data()
          user['id'] = obj.id; // save id of doc of chat with the user in the user object to read out the information later, when the chat window will be opened by click on the users box
          this.arrayOfUsersWithChat.push(user)
        }
        if (this.arrayOfFriendsWithChatUid.length == this.arrayOfUsersWithChat.length) this.showChatsWithFriends = true;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
  }  

  //give the id of document in the document as a field
  async updateIdInFirestorePostsDocs(id) {
    let docRef = doc(this.db, "posts", id);
    await updateDoc(docRef, {
      id: id
    })
  }

  saveCurrentChatId(chatId, userId) {
    this.currentChatId = chatId;
    this.loadChat();
    this.findUserInList(chatId)
  }

  findUserInList(chatId) {
    console.log('A',chatId)
    console.log('B',this.arrayOfUsersWithChat)
    this.currentUserChat = this.arrayOfUsersWithChat.find((user) => user.id == chatId);
    console.log('C',this.currentUserChat)
  }

  async loadChat() {
    let q = query(collection(this.db, "posts", this.currentChatId, "texts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.messages = [];
      this.showChat = false;
      querySnapshot.forEach((doc) => {
        this.messages.push(doc.data())
      })
      this.showChat = true;
    });
    this.showChat = true;
  }
}
