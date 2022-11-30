import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { FileUpload } from 'src/app/models/file-upload.model';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  answersForThread: any;
  answers: any[] = []
  message: any;
  actualUser: User;
  menuPositionY: any = 'below';

  selectedFilesThread?: FileList;
  currentFileUploadThread?: FileUpload;
  urlThread: any;

  filesPreviewThread: any[] = [];
  fileSelectedThread: boolean = false;
  hidden: boolean = true;

  myFilesThread: File[] = [];

  constructor(
    public channelService: ChannelService,
    public usersService: UsersService,
    public generalService: GeneralService,
    private detailViewService: DetailViewPageService,
    private uploadService: FileUploadService
  ) {
    /*  this.answersForThread = JSON.parse(localStorage.getItem('answersForThread')!);
      this.answers = this.answersForThread.answers;*/
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
  }

  ngOnInit(): void {
  }

  async deletePost(post) {
    await this.deleteAllAnswers(post);
    await this.deletePostComplete(post);
    this.changeDetailViewPageContentToThread();
  }

  async deleteAllAnswers(post) {
    const querySnapshot = await getDocs(collection(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers"));
    querySnapshot.forEach(async (doc) => {
      this.deletePostAnswer(post, doc.id)
    });
  }

  async deletePostComplete(post) {
    await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id));
  }

  async deletePostAnswer(post, answerID) {
    await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers", answerID));
  }

  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showOtherUserInfo = false;
    this.detailViewService.showThread = false;
    if (this.generalService.mobilViewIsActive) this.generalService.showPrevSlide = true;
  }

  async sendMessage() {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)
    let urlImage = [];

    this.myFilesThread.forEach(file => urlImage.push(file.name))
    let name = this.getNameOfAuthor();

    if (this.selectedFilesThread) {
      this.upload();
      this.filesPreviewThread.length = 0;
    }

    await setDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", this.channelService.currentThread.post.id, "answers", `${textId + idAdd}`),
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

  getNameOfAuthor() {
    if (this.actualUser.displayName) return this.actualUser.displayName;
    else return 'Anonym'
  }

  getPosition(e) {
    let container = this.myScrollContainer.nativeElement.getBoundingClientRect()
    let y = e.clientY; //y-position of mouse
    let halfContainerHeight = container.height / 2

    if ((halfContainerHeight + container.top) >= y) this.menuPositionY = 'below'
    else this.menuPositionY = 'above'
  }

  selectFileThread(event: any): void {

    this.selectedFilesThread = event.target.files
      for (var i = 0; i <  this.selectedFilesThread.length; i++) {
      this.myFilesThread.push(this.selectedFilesThread.item(i));
    }
    console.log(this.myFilesThread)
    //show a preview of selected File
    this.filesPreviewThread = [];
    if (event.target.files) {
      this.renderFilesPreview();
      this.fileSelectedThread = true;
    }
    console.log(this.myFilesThread)
  }

  deleteSelectedFile(position) {
    console.log(position)
    this.myFilesThread.splice(position, 1)
    if (this.myFilesThread.length >0) this.renderFilesPreview();
    else this.fileSelectedThread = false;
  }

  renderFilesPreview(){
    this.filesPreviewThread = [];
    for (let i = 0; i < this.myFilesThread.length; i++) {
      const file = this.myFilesThread[i];
      console.log(file)
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.urlThread = event.target.result;
        let filePreview = {
          url: this.urlThread,
          hidden: true,
          position: i
        }
        this.filesPreviewThread.push(filePreview)
      }
    }
  }

  upload(): any {
    for (let i = 0; i < this.myFilesThread.length; i++) {
      const file: File | null = this.myFilesThread[i];
      this.currentFileUploadThread = new FileUpload(file);
      this.uploadService.pushFileToStorage(this.currentFileUploadThread)
    }
    this.myFilesThread = undefined;
  }
}
