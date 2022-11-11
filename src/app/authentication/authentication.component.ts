import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  showForgotPassword: boolean = false;
  showVerifyMail: boolean = false;
  showSignUp: boolean = false;
  showSignIn: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
