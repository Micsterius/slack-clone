import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
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

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  editUserName: boolean = false;
  editUserId: boolean = false;
  editUserMail: boolean = false;
  editUserPw: boolean = false;
  editPhotoURL: boolean = false;
  editUserPhone: boolean = false;

  editUser: boolean = false;

  activeUser;
  showUserDetails: boolean = false;

  @Input() newName: any;
  @Input() newMail: any;
  @Input() newPhoneNumber: any;
  @Input() newPasswort: any;

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
    { 'src': 'icon-unknown.svg' },
    { 'src': 'tk.jpg' }
  ]

  constructor(
    public authService: AuthService,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public usersService: UsersService
  ) {
    this.activeUser = JSON.parse(localStorage.getItem('user')!);
    console.log('user', this.activeUser)
    this.loadTelephoneNbr() 
  }

  loadTelephoneNbr(){
    setTimeout(() => {
      this.activeUser.phoneNumber = this.usersService.returnUsersPhoneNumber(this.activeUser.uid)
      this.showUserDetails = true;
    }, 2000);
  }

  ngOnInit(): void {
  }

  async changeUserDataNameFirestore() {
    if (await this.authService.UserDataExist()) {
      this.afs.collection('users')
        .doc(this.authService.userData.uid)
        .update({ displayName: this.newName })
        .then(() => {
          console.log('Name updated');
        }).catch((error) => {
          window.alert(error.message);
        });
    }
  }

  async changeUserDataMailFirestore() {
    if (await this.authService.UserDataExist()) {
      this.afs.collection('users')
        .doc(this.authService.userData.uid)
        .update({ email: this.newMail })
        .then(() => {
          console.log('Mail updated');
        }).catch((error) => {
          window.alert(error.message);
        });
    }
  }

  async saveImgUserPhotoURL(src) {
    if (await this.authService.UserDataExist()) {
      this.afs.collection('users')
        .doc(this.authService.userData.uid)
        .update({ photoURL: src })
        .then(() => {
          console.log('Image updated');
        }).catch((error) => {
          window.alert(error.message);
        });
    }
  }

  async changeUserDataPhoneFirestore() {
    this.updatedDocInFirestore();
  }

  async updatedDocInFirestore() {
    if (await this.authService.UserDataExist()) {
      await updateDoc(doc(this.db, "more-user-infos", this.activeUser.uid), {
        phoneNumber: this.activeUser.phoneNumber,
        uid: this.activeUser.uid
      });
    }
  }

  editProfile() {
    this.editUser = true
  }

  closeProfileEdit() {
    this.editUser = false
  }

  saveProfileEdit() {
  //  this.authService.changeUserDataName(this.newName);
  //  this.authService.changeUserDataMail(this.newMail);
  //  this.authService.changeUserDataPw(this.newPasswort);
  //  this.changeUserDataNameFirestore();
  //  this.changeUserDataMailFirestore();
    this.changeUserDataPhoneFirestore();

    this.closeProfileEdit();
  }
}
