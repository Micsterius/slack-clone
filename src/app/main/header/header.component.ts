import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    public detailViewService: DetailViewPageService) { }

  ngOnInit(): void {
  }

  navigateToPersonal() {
    this.router.navigate(['/personal'])
  }

  changeDetailViewPageContentToUserInfo() {
    this.detailViewService.showUserInfo = true;
    this.detailViewService.showThread = false;
    this.detailViewService.showOtherUserInfo = false;
  }

}
