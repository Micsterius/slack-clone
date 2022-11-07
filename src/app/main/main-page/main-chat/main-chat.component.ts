import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  currentChatId;
  messages: any[] = [];
  showChat: boolean = false;
  userFriend: User;
  currentUser: User;
  message: any;

  constructor(
    public chatServ: ChatService,
    public authServ: AuthService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('user')!);
    this.currentChatId = JSON.parse(localStorage.getItem('currentChatId')!);
    this.userFriend = JSON.parse(localStorage.getItem('userFriend')!);
    this.loadChat();
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /** scroll automatically to last message */
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
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

  /**here the new doc id in the subcollection texts will be generated with two components. 
   * The first one is a timestamp, so the messeages are in the right order when they come 
   * from firestore. The second component is a randowm string with 6 characters if two 
   * users post at the same time. */
  async sendMessage() {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    await setDoc(doc(this.db, "posts", this.currentChatId, "texts", `${textId + idAdd}`), { content: this.message, author: this.currentUser.uid })
    this.message = '';
  }

}