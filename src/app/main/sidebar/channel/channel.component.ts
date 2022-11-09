import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  panelOpenState: boolean = false;
  
  constructor(
    public channelServ: ChannelService,
    private router: Router) {
      channelServ.loadChannels();
     }

  ngOnInit(): void {
  }

  saveCurrentChannelId(channel){
    this.channelServ.saveCurrentChannel(channel);
    localStorage.setItem('currentChannel', JSON.stringify(channel))
  }

  navigateToChannelMain() {
    this.router.navigate(['/channel-main'])
  }

}
