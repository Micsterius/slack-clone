import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialog-errors',
  templateUrl: './dialog-errors.component.html',
  styleUrls: ['./dialog-errors.component.scss']
})
export class DialogErrorsComponent implements OnInit {
  error;
  constructor() { }

  ngOnInit(): void {
  }

}
