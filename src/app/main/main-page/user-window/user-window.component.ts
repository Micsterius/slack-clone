import { Component, Input, OnInit } from '@angular/core';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-window',
  templateUrl: './user-window.component.html',
  styleUrls: ['./user-window.component.scss']
})
export class UserWindowComponent implements OnInit {
  @Input() uid: string;
  constructor(
    public userService: UsersService,
    public detailViewService: DetailViewPageService) { }

  ngOnInit(): void {
  }

  showUserDetails(){
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showThread = false;
    this.detailViewService.showOtherUserInfo = true;

    this.detailViewService.userToShow = this.uid;
  }

}
