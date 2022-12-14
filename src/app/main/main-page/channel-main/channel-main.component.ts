import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { FileUpload } from 'src/app/models/file-upload.model';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { BidiModule } from '@angular/cdk/bidi';

@Component({
  selector: 'app-channel-main',
  templateUrl: './channel-main.component.html',
  styleUrls: ['./channel-main.component.scss']
})
export class ChannelMainComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  name: string = '';
  currentChannel: any;
  posts: any[] = [];
  showChannel: boolean = true;
  currentChannelId: string = '';
  message: string = '';
  actualUser: User;
  menuPositionY: any = 'below';
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  url: any;
  filesPreview: any[] = [];
  fileSelected: boolean = false;
  hidden: boolean = true;
  myFiles: File[] = [];

  constructor(
    public channelServ: ChannelService,
    public detailViewService: DetailViewPageService,
    public userService: UsersService,
    public generalService: GeneralService,
    private uploadService: FileUploadService) {
    this.currentChannel = JSON.parse(localStorage.getItem('currentChannel')!)
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
    channelServ.currentChannel = this.currentChannel;

    if (!this.currentChannel) {
      this.currentChannel = {
        name: 'Regeln',
        id: 'JsFlpBJololcnDEjcSqz'
      }
      channelServ.currentChannel = this.currentChannel;
    }
    this.channelServ.loadChannel();
    channelServ.showChannel = true;
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  async deletePost(post) {
    await deleteDoc(doc(this.db, "channel", this.channelServ.currentChannel.id, "posts", post.id));
  }

  deleteSelectedFile(position) {
    this.generalService.myFiles.splice(position, 1)
    if (this.generalService.myFiles.length > 0) this.generalService.renderFilesPreview();
    else this.generalService.fileSelected = false;
  }

  upload(): any {
    for (let i = 0; i < this.generalService.myFiles.length; i++) {
      const file: File | null = this.generalService.myFiles[i];
      this.currentFileUpload = new FileUpload(file);
      this.uploadService.pushFileToStorage(this.currentFileUpload)
    }
    this.generalService.myFiles.length = 0; //if set undefined, it runs into an error on next loading picture
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getPosition(e) {
    let container = this.myScrollContainer.nativeElement.getBoundingClientRect()

    let y = e.clientY; //y-position of mouse

    let halfContainerHeight = container.height / 2
    if ((halfContainerHeight + container.top) >= y) this.menuPositionY = 'below'
    else this.menuPositionY = 'above'
  }

  /** scroll automatically to last message */
  scrollToBottom(): void {
    if (this.generalService.scrollToBottom) {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showOtherUserInfo = false;
    this.detailViewService.showThread = true;
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
  }

  saveAnswersToShow(post) {
    let postForThread = {
      name: this.channelServ.currentChannel.name,
      post: post
    }
    localStorage.setItem('postForThread', JSON.stringify(postForThread));
    this.channelServ.showThread = true; //proof if it is necessary, two times called
    this.channelServ.currentThread = postForThread;
  }

  /**here the new doc id in the subcollection texts will be generated with two components. 
 * The first one is a timestamp, so the messeages are in the right order when they come 
 * from firestore. The second component is a randowm string with 6 characters if two 
 * users post at the same time. */
  async sendMessage() {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    let urlImage = [];
    this.generalService.myFiles.forEach(file => urlImage.push(file.name))
    if (this.generalService.selectedFiles) {
      this.upload();
      this.generalService.filesPreview.length = 0;
    }
    this.checkIfUploadDone(textId, idAdd, urlImage);

    this.message = '';
    this.generalService.fileSelected = false;
  }

  async setDocInFirestore(textId, idAdd, urlImage) {
    await setDoc(doc(this.db, "channel", this.channelServ.currentChannel.id, "posts", `${textId + idAdd}`),
      {
        content: this.message,
        author: this.actualUser.uid,
        id: `${textId + idAdd}`,
        timeStamp: textId,
        imageUrl: urlImage
      })
  }
  storage = getStorage();

  checkIfUploadDone(textId, idAdd, urlImage) {
    for (let i = 0; i < urlImage.length; i++) {
      const imageUrl = urlImage[i];
      getDownloadURL(ref(this.storage, 'uploads/' + imageUrl))
        .then(async (url) => {
          if (i == urlImage.length - 1) {
            await this.setDocInFirestore(textId, idAdd, urlImage)
          };
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              setTimeout(() => {
                this.checkIfUploadDone(textId, idAdd, urlImage);
              }, 2000);
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
