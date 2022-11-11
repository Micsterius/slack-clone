import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
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
  constructor(
    public channelServ: ChannelService,
    public detailViewService: DetailViewPageService) {
    this.currentChannel = JSON.parse(localStorage.getItem('currentChannel')!)
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
}
