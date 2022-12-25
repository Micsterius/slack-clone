import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { FileUpload } from 'src/app/models/file-upload.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SendMessageService } from 'src/app/shared/services/send-message.service';
import { UsersService } from 'src/app/shared/services/users.service';
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
  storage = getStorage();
  private basePath = '/uploads';

  currentChatId;
  messages: any[] = [];
  showChat: boolean = false;
  message: string = '';
  actualUser: User;

  currentFileUploadChat?: FileUpload;

  constructor(
    public chatService: ChatService,
    public authService: AuthService,
    public usersService: UsersService,
    public generalService: GeneralService,
    public uploadService: FileUploadService,
    public messageService: SendMessageService,
  ) {
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /** scroll automatically to last message */
  scrollToBottom(): void {
    if (this.generalService.scrollToBottom) {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  sendMessageChat(){
    this.messageService.sendMessageChat(this.actualUser.uid, this.chatService.currentChatId)
  }

  deleteSelectedFile(position) {
    this.messageService.myFilesChat.splice(position, 1)
    if (this.messageService.myFilesChat.length > 0) this.messageService.renderFilesPreviewChat();
    else this.messageService.fileSelectedChat = false;
  }
}
