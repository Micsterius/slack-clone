import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-show-user-dialog',
  templateUrl: './show-user-dialog.component.html',
  styleUrls: ['./show-user-dialog.component.scss']
})
export class ShowUserDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UsersService) { }

  ngOnInit(): void {
    console.log(this.data.userUid);
  }

}
