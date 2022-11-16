import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation, Keyboard, Virtual } from "swiper";

// install Swiper modules
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserInfoComponent implements OnInit {

  editUserName: boolean = false;
  editUserId: boolean = false;
  editUserMail: boolean = false;
  editUserPw: boolean = false;
  editPhotoURL: boolean = false;
  editUserPhone: boolean = false;
  

  images: any [] = [
   {'src': 'icon_female_1.png'},
   {'src': 'icon_female_2.png'},
   {'src': 'icon_female_3.jpg'},
   {'src': 'icon_female_4.jpg'},
   {'src': 'icon_female_5.jpg'},
   {'src': 'icon_female_6.png'},
   {'src': 'icon_female_7.jpg'},
   {'src': 'icon_male_1.png'},
   {'src': 'icon_male_2.png'},
   {'src': 'icon_male_3.png'},
   {'src': 'icon_male_4.png'},
   {'src': 'icon_male_5.jpg'},
   {'src': 'icon_male_6.png'},
   {'src': 'icon-unknown.svg'}
]

imgSrc2: any [] = [
  {'src': 'counting-1.png'},
  {'src': 'counting-2.png'},
  {'src': 'counting-3.png'}
]

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore
  ) {
  }

  ngOnInit(): void {
  }

  changeUserDataNameFirestore(newName) {
    this.afs.collection('users')
      .doc(this.authService.userData.uid)
      .update({displayName: newName})
      .then(() => {
        console.log('Name updated');
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  changeUserDataMailFirestore(newMail) {
    this.afs.collection('users')
      .doc(this.authService.userData.uid)
      .update({email: newMail})
      .then(() => {
        console.log('Mail updated');
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  saveImgUserPhotoURL(src){
    this.afs.collection('users')
    .doc(this.authService.userData.uid)
    .update({photoURL: src})
    .then(() => {
      console.log('Image updated');
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  changeUserDataPhoneFirestore(value){
    this.afs.collection('users')
    .doc(this.authService.userData.uid)
    .update({phoneNumber: value})
    .then(() => {
      console.log('Image updated');
    }).catch((error) => {
      window.alert(error.message);
    });
  }
}
