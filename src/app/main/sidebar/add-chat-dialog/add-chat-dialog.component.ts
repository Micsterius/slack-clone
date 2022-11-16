import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-chat-dialog',
  templateUrl: './add-chat-dialog.component.html',
  styleUrls: ['./add-chat-dialog.component.scss']
})
export class AddChatDialogComponent implements OnInit {
  @Input() name:any;
  constructor() { }

  ngOnInit(): void {
  }

  createNewChat(){
    
  }

}
