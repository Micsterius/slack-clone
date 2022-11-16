import { Component, OnInit } from '@angular/core';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-other-user-info',
  templateUrl: './other-user-info.component.html',
  styleUrls: ['./other-user-info.component.scss']
})
export class OtherUserInfoComponent implements OnInit {

  constructor(
    public detailViewService: DetailViewPageService,
    public userService: UsersService) { }

  ngOnInit(): void {
  }

}
