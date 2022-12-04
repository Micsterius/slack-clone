import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { FileUpload } from 'src/app/models/file-upload.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { GeneralService } from 'src/app/shared/services/general.service';
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
  currentChatId;
  messages: any[] = [];
  showChat: boolean = false;
  message: any;
  actualUser: User;

  currentFileUploadChat?: FileUpload;

  constructor(
    public chatService: ChatService,
    public authService: AuthService,
    public usersService: UsersService,
    public generalService: GeneralService,
    public uploadService: FileUploadService
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

  /**here the new doc id in the subcollection texts will be generated with two components. 
   * The first one is a timestamp, so the messeages are in the right order when they come 
   * from firestore. The second component is a randowm string with 6 characters if two 
   * users post at the same time. */
  async sendMessage() {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    let urlImage = [];
    this.generalService.myFilesChat.forEach(file => urlImage.push(file.name))
    if (this.generalService.selectedFilesChat) {
      this.upload();
      this.generalService.filesPreviewChat.length = 0;
    }
    await this.setDocInFirestore(textId, idAdd, urlImage)
    this.message = '';
    this.generalService.fileSelectedChat = false;
  }

  async setDocInFirestore(textId, idAdd, urlImage){
    await setDoc(doc(this.db, "posts", this.chatService.currentChatId, "texts", `${textId + idAdd}`),
    {
      content: this.message,
      author: this.actualUser.uid,
      id: `${textId + idAdd}`,
      timeStamp: textId,
      imageUrl: urlImage
    })
  }

  deleteSelectedFile(position) {
    this.generalService.myFilesChat.splice(position, 1)
    if (this.generalService.myFilesChat.length > 0) this.generalService.renderFilesPreviewChat();
    else this.generalService.fileSelectedChat = false;
  }

  upload(): any {
    for (let i = 0; i < this.generalService.myFilesChat.length; i++) {
      const file: File | null = this.generalService.myFilesChat[i];
      this.currentFileUploadChat = new FileUpload(file);
      this.uploadService.pushFileToStorage(this.currentFileUploadChat)
    }
    this.generalService.myFilesThread.length = 0; //if set undefined, it runs into an error on next loading picture
  }

}
