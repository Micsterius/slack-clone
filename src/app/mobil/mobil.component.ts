import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation, Keyboard, Virtual } from "swiper";

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);
@Component({
  selector: 'app-mobil',
  templateUrl: './mobil.component.html',
  styleUrls: ['./mobil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobilComponent implements OnInit {

  apps = ['', '<router-outlet></router-outlet>']
  constructor() { }

  ngOnInit(): void {
  }

}
