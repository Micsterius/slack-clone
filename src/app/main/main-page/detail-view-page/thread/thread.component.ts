import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { FileUpload } from 'src/app/models/file-upload.model';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { SendMessageService } from 'src/app/shared/services/send-message.service';
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
  storage = getStorage();
  
  answersForThread: any;
  answers: any[] = []
  message: string = '';
  actualUser: User;
  menuPositionY: any = 'below';
  selectedFilesThread?: FileList;
  currentFileUploadThread?: FileUpload;
  urlThread: any;
  filesPreviewThread: any[] = [];
  fileSelectedThread: boolean = false;
  hidden: boolean = true;
  myFilesThread: File[] = [];
  private basePath = '/uploads';

  constructor(
    public channelService: ChannelService,
    public usersService: UsersService,
    public generalService: GeneralService,
    private detailViewService: DetailViewPageService,
    private uploadService: FileUploadService,
    public messageService: SendMessageService
  ) {
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
    this.messageService.myFilesThread.forEach(file => urlImage.push(file.name))
    if (this.messageService.selectedFilesThread) {//if files are there for upload
      this.upload(textId, idAdd, urlImage);
      this.messageService.filesPreviewThread.length = 0;
    }
    else this.setDocInFirestore(textId, idAdd, urlImage)
  }

  async setDocInFirestore(textId, idAdd, urlImage) {
    await setDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", this.channelService.currentThread.post.id, "answers", `${textId + idAdd}`),
      {
        content: this.message,
        author: this.actualUser.uid,
        id: `${textId + idAdd}`,
        timeStamp: textId,
        imageUrl: urlImage
      })
      this.message = '';
      this.messageService.fileSelectedThread = false;
  }

  getPosition(e) {
    let container = this.myScrollContainer.nativeElement.getBoundingClientRect()
    let y = e.clientY; //y-position of mouse
    let halfContainerHeight = container.height / 2

    if ((halfContainerHeight + container.top) >= y) this.menuPositionY = 'below'
    else this.menuPositionY = 'above'
  }

  deleteSelectedFile(position) {
    this.messageService.myFilesThread.splice(position, 1)
    if (this.messageService.myFilesThread.length > 0) this.messageService.renderFilesPreviewThread();
    else this.messageService.fileSelectedThread = false;
  }

  upload(textId, idAdd, urlImage): any {
    for (let i = 0; i < this.messageService.myFilesThread.length; i++) {
      const file: File | null = this.messageService.myFilesThread[i];
      this.currentFileUploadThread = new FileUpload(file);
      this.pushFileToStorage(this.currentFileUploadThread, i, this.messageService.myFilesThread.length, textId, idAdd, urlImage)
    }
    this.messageService.myFilesThread.length = 0; //if set undefined, it runs into an error on next loading picture
  }

  pushFileToStorage(fileUpload: FileUpload, currentFile, totalNbrOfFiles, textId, idAdd, urlImage) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload.file);
    uploadBytes(storageRef, fileUpload.file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (currentFile + 1 == totalNbrOfFiles) this.setDocInFirestore(textId, idAdd, urlImage)
        });
      }
    );
  }
}
