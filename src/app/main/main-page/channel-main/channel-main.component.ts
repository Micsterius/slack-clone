import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, doc, getFirestore, onSnapshot, query, setDoc } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-channel-main',
  templateUrl: './channel-main.component.html',
  styleUrls: ['./channel-main.component.scss']
})
export class ChannelMainComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  name: string = '';
  currentChannel: any;
  posts: any[] = [];
  showChannel: boolean = true;
  currentChannelId: string = '';
  message: any;
  actualUser: User;

  constructor(
    public channelServ: ChannelService,
    public detailViewService: DetailViewPageService) {
    this.currentChannel = JSON.parse(localStorage.getItem('currentChannel')!)
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
    channelServ.currentChannel = this.currentChannel
  }

  ngOnInit(): void {
  }




  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showThread = true;
  }

  saveAnswersToShow(answers) {
    let answersForThread = {
      name: this.currentChannel.name,
      answers: answers
    }
    localStorage.setItem('answersForThread', JSON.stringify(answersForThread));
    this.channelServ.showThread = true; //proof if it is necessary, two times called
    this.channelServ.currentThread = answersForThread;
  }

  /**here the new doc id in the subcollection texts will be generated with two components. 
 * The first one is a timestamp, so the messeages are in the right order when they come 
 * from firestore. The second component is a randowm string with 6 characters if two 
 * users post at the same time. */
  async sendMessage() {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)

    let name = this.getNameOfAuthor();
    
    await setDoc(doc(this.db, "channel", this.channelServ.currentChannel.id, "posts", `${textId + idAdd}`),
      {
        content: this.message,
        authorId: this.actualUser.uid,
        authorName: name,
        id: `${textId + idAdd}`,
        timeStamp: textId
      })
    this.message = '';
  }

  getNameOfAuthor(){
    if (this.actualUser.displayName) return this.actualUser.displayName;
    else return 'Anonym'
  }
}
