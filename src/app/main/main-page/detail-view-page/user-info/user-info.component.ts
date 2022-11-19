import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';

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

  @ViewChild('getUserPhoneNbr') private getUserPhoneNbr: ElementRef;

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

  phoneNumber: any;
  reCaptchaVerifier: any;
  appVerifier: any;
  confirmationResult: any;

  editUserName: boolean = false;
  editUserId: boolean = false;
  editUserMail: boolean = false;
  editUserPw: boolean = false;
  editPhotoURL: boolean = false;
  editUserPhone: boolean = false;


  actualUser: any;

  images: any[] = [
    { 'src': 'icon_female_1.png' },
    { 'src': 'icon_female_2.png' },
    { 'src': 'icon_female_3.jpg' },
    { 'src': 'icon_female_4.jpg' },
    { 'src': 'icon_female_5.jpg' },
    { 'src': 'icon_female_6.png' },
    { 'src': 'icon_female_7.jpg' },
    { 'src': 'icon_male_1.png' },
    { 'src': 'icon_male_2.png' },
    { 'src': 'icon_male_3.png' },
    { 'src': 'icon_male_4.png' },
    { 'src': 'icon_male_5.jpg' },
    { 'src': 'icon_male_6.png' },
    { 'src': 'icon-unknown.svg' }
  ]

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public usersService: UsersService
  ) {
  }

  getOTP() {
    this.reCaptchaVerifier = new RecaptchaVerifier(this.getUserPhoneNbr.nativeElement, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    }, this.auth);
    
    this.afAuth
    .signInWithPhoneNumber(this.phoneNumber, this.reCaptchaVerifier)
    .then((confirmationResult) => {
      console.log('confirmationResult')
    })
    .catch((error) => {
      window.alert(error.message);
    });
}

  ngOnInit(): void {
  }

  changeUserDataNameFirestore(newName) {
    this.afs.collection('users')
      .doc(this.authService.userData.uid)
      .update({ displayName: newName })
      .then(() => {
        console.log('Name updated');
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  changeUserDataMailFirestore(newMail) {
    this.afs.collection('users')
      .doc(this.authService.userData.uid)
      .update({ email: newMail })
      .then(() => {
        console.log('Mail updated');
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  saveImgUserPhotoURL(src) {
    this.afs.collection('users')
      .doc(this.authService.userData.uid)
      .update({ photoURL: src })
      .then(() => {
        console.log('Image updated');
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  changeUserDataPhoneFirestore(value) {
    this.afs.collection('users')
      .doc(this.authService.userData.uid)
      .update({ phoneNumber: value })
      .then(() => {
        console.log('Phone updated');
      }).catch((error) => {
        window.alert(error.message);
      });
  }
}
