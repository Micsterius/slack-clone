import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  answersForThread: any;
  answers: any [] = []
  constructor() {
    this.answersForThread = JSON.parse(localStorage.getItem('answersForThread')!);
    this.answers = this.answersForThread.answers;
   }

  ngOnInit(): void {
  }

}
