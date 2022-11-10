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
    chatServ.loadChats()
  }

  ngOnInit(): void {
  }

  saveCurrentUserId(user) {
    localStorage.setItem('userChat', JSON.stringify(user));
    this.chatServ.saveCurrentChatId(user.id, user.uid);
  }

  navigateToMain() {
    this.router.navigate(['/main-community'])
  }
}
