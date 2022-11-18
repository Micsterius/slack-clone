import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  timedOutCloser;
  scrollToBottom;
  showDetailView: boolean = false;

  constructor() { }

  getTransformedTimeStampToDate(timeStamp) {
    let time = Number(timeStamp)
    let date = new Date(time * 1000);
    let cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let cTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let dateTime = cDate + ' ' + cTime;
    return dateTime;
  }

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
}
