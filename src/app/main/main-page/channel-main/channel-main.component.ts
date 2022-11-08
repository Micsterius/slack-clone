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
  channel: any;
  posts: any[] = [];
  showChannel: boolean = true;
  currentChannelId: string = '';
  constructor(
    public channelServ: ChannelService,
    public detailViewService: DetailViewPageService) {
    this.currentChannelId = localStorage.getItem('currentChannel')
    this.loadChannel()
  }

  ngOnInit(): void {
    /*  let id = localStorage.getItem('currentChannel')
      this.channelServ.currentChannelId = id;*/
  }

  /* showChannel(id){
     this.channel = this.channelServ.arrayOfChannels.find((channel) => channel.id == id)
     console.log (this.channel.name)
   }*/

  loadChannel() {
    let q = query(collection(this.db, "channel", this.currentChannelId, "posts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.posts = [];
      this.showChannel = false;
      querySnapshot.forEach((doc) => {
        this.posts.push(doc.data())
        this.loadChannelAnswers();
      })
      this.showChannel = true;
    });
    this.showChannel = true;
    
  }

  loadChannelAnswers() {
    console.log(this.currentChannelId)
    for (let i = 0; i < this.posts.length; i++) {
      const post = this.posts[i];
      console.log(post.id)
      let answers = [];
      let q = query(collection(this.db, "channel", this.currentChannelId, "posts", `${post.id}`, 'answers'))
      let unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          answers.push(doc.data())
        })
      });
      this.posts[i].answers = answers;
      console.log(this.posts[i])
    }
  }

  changeDetailViewPageContentToThread(){
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showThread = true;
  }
}
