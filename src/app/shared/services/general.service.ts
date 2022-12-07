import { Injectable } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  timedOutCloser;
  scrollToBottom;
  showDetailView: boolean = false;
  mobilViewIsActive: boolean = false;
  showNextSlide: boolean = false;
  showPrevSlide: boolean = false;

  adminActive: boolean = false;

  //show and hide editor
  showEditorChannel: boolean = true;
  showEditorThread: boolean = true;
  showEditorChat: boolean = true;

  //set editor active for fileupload
  activeEditorIsChannel: boolean = false;
  activeEditorIsThread: boolean = false;
  activeEditorIsChat: boolean = false;
  activeEditorIsUser: boolean = false;

  //User
  selectedFilesUser?: FileList;
  currentFileUploadUser?: FileUpload;
  urlUser: any;
  filePreviewUser: any;
  fileSelectedUser: boolean = false;
  myFilesUser: File[] = [];;

  //THREAD
  selectedFilesThread?: FileList;
  currentFileUploadThread?: FileUpload;
  urlThread: any;
  filesPreviewThread: any[] = [];
  fileSelectedThread: boolean = false;
  myFilesThread: File[] = [];

  //CHANNEL
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  url: any;
  filesPreview: any[] = [];
  fileSelected: boolean = false;
  myFiles: File[] = [];

  //CHAT
  selectedFilesChat?: FileList;
  currentFileUploadChat?: FileUpload;
  urlChat: any;
  filesPreviewChat: any[] = [];
  fileSelectedChat: boolean = false;
  myFilesChat: File[] = [];

  constructor() { }

  getTransformedTimeStampToDate(timeStamp) {
    let time = Number(timeStamp)
    let date = new Date(time * 1000);
    let cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let cTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    return dateTime;
  }

  //timeout in this function is necessary, because he needs time to write the variable for the yPosition of the mat menu
  mouseEnter(trigger) {
    setTimeout(() => {
      if (this.timedOutCloser) clearTimeout(this.timedOutCloser);
      trigger.openMenu();
    }, 10);
  }

  mouseLeave(trigger) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }

  scrollToBottomBoolean() {
    this.scrollToBottom = true;
    setTimeout(() => {
      this.scrollToBottom = false;
    }, 500);
  }

  changeActiveEditorToChannel() {
    this.activeEditorIsThread = false;
    this.activeEditorIsChannel = true;
    this.activeEditorIsChat = false;
    this.activeEditorIsUser = false;
  }

  changeActiveEditorToThread() {
    this.activeEditorIsThread = true;
    this.activeEditorIsChannel = false;
    this.activeEditorIsChat = false;
    this.activeEditorIsUser = false;
  }

  changeActiveEditorToChat() {
    this.activeEditorIsThread = false;
    this.activeEditorIsChannel = false;
    this.activeEditorIsChat = true;
    this.activeEditorIsUser = false;
  }

  changeActiveEditorToUser() {
    this.activeEditorIsThread = false;
    this.activeEditorIsChannel = false;
    this.activeEditorIsChat = false;
    this.activeEditorIsUser = true;
  }

  selectFile(event: any): void {
    if (this.activeEditorIsThread) this.selectFileThread(event)
    if (this.activeEditorIsChannel) this.selectFileChannel(event)
    if (this.activeEditorIsChat) this.selectFileChat(event)
    if (this.activeEditorIsUser) this.selectFileUser(event)
  }

  selectFileChannel(event) {
    this.selectedFiles = event.target.files
    console.log(this.selectedFiles)
    for (var i = 0; i < this.selectedFiles.length; i++) {
      this.myFiles.push(this.selectedFiles.item(i));
    }
    //show a preview of selected File
    this.filesPreview = [];
    if (event.target.files) {
      this.renderFilesPreview();
      this.fileSelected = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  selectFileUser(event) {
    this.selectedFilesUser = event.target.files
    this.myFilesUser.push(this.selectedFilesUser.item(0))
    //show a preview of selected File
    this.filesPreview = [];
    if (event.target.files) {
      this.renderFilePreviewUser();
      this.fileSelectedUser = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  selectFileThread(event) {
    this.selectedFilesThread = event.target.files
    for (var i = 0; i < this.selectedFilesThread.length; i++) {
      this.myFilesThread.push(this.selectedFilesThread.item(i));
    }
    //show a preview of selected File
    this.filesPreviewThread = [];
    if (event.target.files) {
      this.renderFilesPreviewThread();
      this.fileSelectedThread = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  selectFileChat(event) {
    this.selectedFilesChat = event.target.files
    for (var i = 0; i < this.selectedFilesChat.length; i++) {
      this.myFilesChat.push(this.selectedFilesChat.item(i));
    }
    //show a preview of selected File
    this.filesPreviewChat = [];
    if (event.target.files) {
      this.renderFilesPreviewChat();
      this.fileSelectedChat = true;
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  renderFilesPreviewThread() {
    this.filesPreviewThread = [];
    for (let i = 0; i < this.myFilesThread.length; i++) {
      const file = this.myFilesThread[i];
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

  renderFilePreviewUser() {
    const file = this.selectedFilesUser.item(0);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.urlUser = event.target.result;
      this.filePreviewUser = this.urlUser
    }
  }

  renderFilesPreviewChat() {
    this.filesPreviewChat = [];
    for (let i = 0; i < this.myFilesChat.length; i++) {
      const file = this.myFilesChat[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.urlChat = event.target.result;
        let filePreview = {
          url: this.urlChat,
          hidden: true,
          position: i
        }
        this.filesPreviewChat.push(filePreview)
      }
    }
  }

  //render files preview channel
  renderFilesPreview() {
    this.filesPreview = [];
    for (let i = 0; i < this.myFiles.length; i++) {
      const file = this.myFiles[i];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        let filePreview = {
          url: this.url,
          hidden: true,
          position: i
        }
        this.filesPreview.push(filePreview)
      }
    }
  }

  expandEditorChannel() {
    this.showEditorChannel = !this.showEditorChannel
  }

  expandEditorThread() {
    this.showEditorThread = !this.showEditorThread
  }

  expandEditorChat() {
    this.showEditorChat = !this.showEditorChat
  }
}


