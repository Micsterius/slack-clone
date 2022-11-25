import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
import SwiperCore, { Keyboard, Navigation, Pagination, Swiper, Virtual } from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { GeneralService } from '../shared/services/general.service';

// install Swiper modules
SwiperCore.use([Virtual, Navigation, Pagination, Keyboard]);
@Component({
  selector: 'app-mobil',
  templateUrl: './mobil.component.html',
  styleUrls: ['./mobil.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MobilComponent implements OnInit {
  showDetailViewPageMobil: boolean = true

  constructor(
    public generalService: GeneralService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  slideNext() {
    this.swiper.swiperRef.slideNext(100);
  }
  slidePrev() {
    this.swiper.swiperRef.slidePrev(100);
  }

  checkShowNextSlide() {
    if (this.generalService.showNextSlide) {
      this.slideNext();
      this.generalService.showNextSlide = false;
    }
  }

  checkShowPrevSlide(){
    if (this.generalService.showPrevSlide) {
      this.slidePrev();
      this.generalService.showPrevSlide = false;
    }
  }

}
