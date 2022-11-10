import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ChatService } from 'src/app/shared/services/chat.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  panelOpenState: boolean = false;

  constructor(
    public chatServ: ChatService,
    private router: Router) {
    chatServ.loadChats();
    let userChat = JSON.parse(localStorage.getItem('userChat')!);
    if (userChat != null) {
      chatServ.currentUserChat = userChat;
      chatServ.currentChatId = userChat.id;
      chatServ.loadChat();
      console.log(userChat);
    }
    else console.log('No Chat in local Storage')
  }

  ngOnInit(): void {
  }

  saveCurrentUserId(userChat) {
    this.chatServ.saveCurrentChatId(userChat.id);
    localStorage.setItem('userChat', JSON.stringify(this.chatServ.currentUserChat));
  }

  navigateToMain() {
    this.router.navigate(['/main-community'])
  }
}
