import { Component, Input, OnInit } from '@angular/core';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';
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
    public detailViewService: DetailViewPageService,
    private generalService: GeneralService) { }

  ngOnInit(): void {
  }

  showUserDetails() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showThread = false;
    this.detailViewService.showOtherUserInfo = true;

    this.detailViewService.userToShow = this.uid;
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
  }

  checkIfNbrExist(uid) {
    if (this.userService.returnUsersPhoneNumber(uid) == 'No Phone') alert('Keine Nummer hinterlegt')
  }
}
