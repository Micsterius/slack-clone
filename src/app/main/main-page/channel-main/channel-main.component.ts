import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
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
  constructor(public channelServ: ChannelService) {
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

  async loadChannel() {
    let q = query(collection(this.db, "channel", this.currentChannelId, "posts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.posts = [];
      this.showChannel = false;
      querySnapshot.forEach((doc) => {
        this.posts.push(doc.data())
      })
      this.showChannel = true;
    });
    this.showChannel = true;
  }


}
