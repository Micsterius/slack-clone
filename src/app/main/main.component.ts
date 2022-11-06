import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  showFiller: boolean = false;
  showOpen: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  changeArrow(){
    this.showOpen = !this.showOpen
  }

}
