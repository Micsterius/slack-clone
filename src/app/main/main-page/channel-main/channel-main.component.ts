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
  message: any;
  actualUser: User;

  editorWidth: number;
  menuPositionY: any = 'below';

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  url: any;

  filesPreview: any [] = [];
  fileSelected: boolean = false;
  hidden: boolean = true;

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

    this.downloadImage();
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  async deletePost(post) {
    await deleteDoc(doc(this.db, "channel", this.channelServ.currentChannel.id, "posts", post.id));
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    //show a preview of selected File
    if (event.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        let filePreview = {
          url: this.url,
          hidden: true}
        this.filesPreview.push(filePreview)
      }
    }
    this.fileSelected = true;
  }

  upload(): any {

    const file: File | null = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    return this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage ? percentage : 0);
      },
      error => {
        console.log(error);
      }
    );
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

    let name = this.getNameOfAuthor();
    let urlImage = "";

    if (this.selectedFiles) {
      this.upload();

    }

    await setDoc(doc(this.db, "channel", this.channelServ.currentChannel.id, "posts", `${textId + idAdd}`),
      {
        content: this.message,
        authorId: this.actualUser.uid,
        authorName: name,
        id: `${textId + idAdd}`,
        timeStamp: textId,
        imageUrl: urlImage
      })
    this.message = '';
  }

  // hasNewMessageImages(){

  // }

  getNameOfAuthor() {
    if (this.actualUser.displayName) return this.actualUser.displayName;
    else return 'Anonym'
  }

  /*download images area*/

  img = '<img src="">';
  storage = getStorage();
  starsRef = ref(this.storage, 'uploads/bild.jpg');

  // Get the download URL
  downloadImage() {
    getDownloadURL(this.starsRef)
      .then((url) => {
        this.img = `<img src="${url}">`;
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
