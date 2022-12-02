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

  activeEditorIsChannel: boolean = false;
  activeEditorIsThread: boolean = false;

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
      if (this.timedOutCloser) {
        clearTimeout(this.timedOutCloser);
      }
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
  }

  changeActiveEditorToThread() {
    this.activeEditorIsThread = true;
    this.activeEditorIsChannel = false;
  }

  selectFile(event: any): void {
    if (this.activeEditorIsThread) {
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
    }
    if (this.activeEditorIsChannel) {
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
    }
    event.target.value = ''; // necessary to be able to load the same file again
  }

  renderFilesPreviewThread() {
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
    console.log(this.filesPreviewThread)
  }

  renderFilesPreview() {
    this.filesPreview = [];
    for (let i = 0; i < this.myFiles.length; i++) {
      const file = this.myFiles[i];
      console.log(file)
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
}


