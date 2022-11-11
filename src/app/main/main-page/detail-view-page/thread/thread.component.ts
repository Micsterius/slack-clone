import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  answersForThread: any;
  answers: any [] = []
  constructor(
    public channelServ: ChannelService
  ) {
  /*  this.answersForThread = JSON.parse(localStorage.getItem('answersForThread')!);
    this.answers = this.answersForThread.answers;*/
   }

  ngOnInit(): void {
  }
}
