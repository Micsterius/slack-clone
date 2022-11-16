import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-window',
  templateUrl: './user-window.component.html',
  styleUrls: ['./user-window.component.scss']
})
export class UserWindowComponent implements OnInit {
  @Input() uid: string;
  constructor(public userService: UsersService) { }

  ngOnInit(): void {
  }

}
