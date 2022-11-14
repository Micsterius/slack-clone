import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  answersForThread: any;
  answers: any [] = []
  message: any;
  constructor(
    public channelServ: ChannelService,
    public usersService: UsersService,
    public generalService: GeneralService,

  ) {
  /*  this.answersForThread = JSON.parse(localStorage.getItem('answersForThread')!);
    this.answers = this.answersForThread.answers;*/
   }

  ngOnInit(): void {
  }

  sendMessage(){
    //
  }
}
