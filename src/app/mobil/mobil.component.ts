import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Swiper, Virtual } from "swiper";
import { SwiperComponent } from 'swiper/angular';

// install Swiper modules
SwiperCore.use([Virtual]);
@Component({
  selector: 'app-mobil',
  templateUrl: './mobil.component.html',
  styleUrls: ['./mobil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobilComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  slideNext(){
    this.swiper.swiperRef.slideNext(100);
  }
  slidePrev(){
    this.swiper.swiperRef.slidePrev(100);
  }

}
