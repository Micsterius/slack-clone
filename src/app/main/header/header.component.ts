import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    public detailViewService: DetailViewPageService,
    private generalService: GeneralService) { }

  ngOnInit(): void {
  }

  navigateToPersonal() {
    this.router.navigate(['/personal'])
  }

  changeDetailViewPageContentToUserInfo() {
    this.detailViewService.showUserInfo = true;
    this.detailViewService.showThread = false;
    this.detailViewService.showOtherUserInfo = false;
    if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
    setTimeout(() => {
      if (this.generalService.mobilViewIsActive) this.generalService.showNextSlide = true;
    }, 10);

  }

  themePink() {
    document.documentElement.style.setProperty('--main-color', '#FA2759');
    document.documentElement.style.setProperty('--secondary-color', '#f7b0c1');
    document.documentElement.style.setProperty('--background-color', '#fff2f5');
    localStorage.setItem('mainColor', '#FA2759');
    localStorage.setItem('secColor', '#f7b0c1');
    localStorage.setItem('backgroundColor', '#fff2f5');
  }

  themeViolett() {
    document.documentElement.style.setProperty('--main-color', '#7403bf');
    document.documentElement.style.setProperty('--secondary-color', '#ae8ec4');
    document.documentElement.style.setProperty('--background-color', '#faf3fe');
    localStorage.setItem('mainColor', '#7403bf');
    localStorage.setItem('secColor', '#ae8ec4');
    localStorage.setItem('backgroundColor', '#faf3fe');

  }

  themeOrange() {
    document.documentElement.style.setProperty('--main-color', '#fe8801');
    document.documentElement.style.setProperty('--secondary-color', '#ffdbb2');
    document.documentElement.style.setProperty('--background-color', '#fff9f1');
    localStorage.setItem('mainColor', '#fe8801');
    localStorage.setItem('secColor', '#ffdbb2');
    localStorage.setItem('backgroundColor', '#fff9f1');
  }

  themeDark() {
    document.documentElement.style.setProperty('--main-color', '#42324f');
    document.documentElement.style.setProperty('--secondary-color', '#afa1bd');
    document.documentElement.style.setProperty('--background-color', '#faf3fe');
    localStorage.setItem('mainColor', '#42324f');
    localStorage.setItem('secColor', '#afa1bd');
    localStorage.setItem('backgroundColor', '#faf3fe');
  }

}
