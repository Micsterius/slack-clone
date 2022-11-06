import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-channel-main',
  templateUrl: './channel-main.component.html',
  styleUrls: ['./channel-main.component.scss']
})
export class ChannelMainComponent implements OnInit {
  name: string = '';
  channel: any;
  constructor(public channelServ: ChannelService) {

  }

  ngOnInit(): void {
    let id = localStorage.getItem('currentChannel')
    this.channelServ.currentChannelId = id;
    this.channelServ.loadChannels();
  }

  showChannel(id){
    this.channel = this.channelServ.arrayOfChannels.find((channel) => channel.id == id)
    console.log (this.channel.name)
  }



}
