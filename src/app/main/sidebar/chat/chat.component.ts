import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ChatService } from 'src/app/shared/services/chat.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddChatDialogComponent } from '../add-chat-dialog/add-chat-dialog.component';

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
    private router: Router,
    public dialog: MatDialog,
    public usersServ: UsersService,
    public generalService: GeneralService) {
    chatServ.loadChats();
   /* let userChat = JSON.parse(localStorage.getItem('userChat')!);
    if (userChat != null) {
      chatServ.currentUserChat = userChat;
      chatServ.currentChatId = userChat.id;
      chatServ.loadChat();
      console.log(userChat);
    }
    else console.log('No Chat in local Storage')*/
  }

  ngOnInit(): void {
  }

  saveCurrentChatId(userChatId) {
    this.chatServ.saveCurrentChatId(userChatId);
    console.log(userChatId)
    this.generalService.scrollToBottomBoolean();
  //  localStorage.setItem('userChat', JSON.stringify(this.chatServ.currentUserChat));
  }

  navigateToMain() {
    this.router.navigate(['/main-community'])
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(AddChatDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
