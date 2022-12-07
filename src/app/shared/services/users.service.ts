import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getFirestore, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  users: any[] = [];
  usersAdditionalInfos: any[] = [];
  storage = getStorage();
  imgUnknownHeader = '<img src="./../../../assets/img/userIcons/user-white.png" height="30px">';
  imgUnknownProfile = '<img src="./../../../assets/img/userIcons/user-black.png" height="120px">';
  imgUnknownSidebar = '<img src="./../../../assets/img/userIcons/user-black.png" height="25px">';
  imgUnknownInfo = '<img src="./../../../assets/img/userIcons/user-black.png" height="160px">';
  imgUnknownWindow = '<img src="./../../../assets/img/userIcons/user-black.png" height="80px">';
  imgUnknownThread = '<img src="./../../../assets/img/userIcons/user-black.png" height="25px">';
  imgUnknownChannel = '<img src="./../../../assets/img/userIcons/user-black.png" height="40px">';
  imgUnknownAddChannel = '<img src="./../../../assets/img/userIcons/user-black.png" height="20px">';
  constructor(
    public dialog: MatDialog
  ) { }

  //load all users datas (displayName => name; email: Mail; photoURL => image src)
  async loadUsers() {
    let q = query(collection(this.db, "users"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.users = [];
      querySnapshot.forEach((doc) => {
        this.users.push(doc.data())
      })
      this.getImagesForUsers()
    });
  }

  //load all users additional datas (isOnline => true/false; isAway: true/false; timeStampLastActivity; uid => user id; phoneNumber)
  async loadUsersAdditionalInfos() {
    let q = query(collection(this.db, "more-user-infos"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.usersAdditionalInfos = [];
      querySnapshot.forEach((doc) => {
        this.usersAdditionalInfos.push(doc.data())
      })
      this.checkUsersLastActivity()
    });
  }

  returnUsersPhotoUrl(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'icon-unknown.svg'
    else return user.photoURL
  }

  returnUsersPhotoUrlThread(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownThread
    else  return user.photoURLThread
  }

  returnUsersPhotoUrlWindow(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownWindow
    else  return user.photoURLWindow
  }

  returnUsersPhotoUrlChannel(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownChannel
    else  return user.photoURLChannel
  }

  returnUsersPhotoUrlProfile(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownProfile
    else  return user.photoURLProfile
  }

  returnUsersPhotoUrlInfo(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownInfo
    else  return user.photoURLInfo
  }

  returnUsersPhotoUrlSidebar(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownSidebar
    else  return user.photoURLSidebar
  }

  returnUsersPhotoUrlAddDialog(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownAddChannel
    else  return user.photoURLAddDialog
  }

  returnUsersPhotoUrlHeader(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return this.imgUnknownHeader
    else  return user.photoURLHeader
  }

  getImagesForUsers() {
    this.users.forEach(user => {
      let imageUrl = user.photoURL
      getDownloadURL(ref(this.storage, user.uid + '/' + imageUrl))
        .then((url) => {
          user.photoURLChannel = `<img src="${url}" height="40px" class="image-url" alt="">`;
          user.photoURLInfo = `<img src="${url}" height="160px" class="image-url" alt="">`;
          user.photoURLWindow = `<img src="${url}" height="80px" class="image-url" alt="">`;
          user.photoURLThread = `<img src="${url}" height="25px" class="image-url" alt="">`;
          user.photoURLProfile = `<img src="${url}" height="120px" class="image-url" alt="">`;
          user.photoURLSidebar = `<img src="${url}" height="25px" class="image-url" alt="">`;
          user.photoURLHeader = `<img src="${url}" height="30px" class="image-url" alt="">`;
          user.photoURLAddDialog = `<img src="${url}" height="25px" class="image-url" alt="">`;
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            // ...
            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        });
    })
  }

  returnUsersDisplayName(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'Anonym'
    else return user.displayName
  }

  returnUsersMail(uid) {
    let user = this.users.find(user => user.uid == uid)
    if (user == undefined) return 'No mail available'
    else return user.email
  }

  returnUsersPhoneNumber(uid) {
    let user = this.usersAdditionalInfos.find(user => user.uid == uid)
    if (user == undefined) return 'No Phone'
    else return user.phoneNumber
  }

  /**
   * find user which is shown in user-window component
   * give back the color for status of this user
   * gray in case he is not online or a not registered user
   * green if he/she is online
   * yellow in case he/she is away (changed tap)
   */
  returnUserStatus(uid) {
    let user = this.usersAdditionalInfos.find(user => user.uid == uid)
    if (user == undefined || !user.isOnline) return 'gray'
    else if (user.isOnline) return 'green'
    else if (user.isOnline && user.isAway) return 'yellow'
    else return 'gray'
  }

  /**
   * this function run everytime when sth changed in the collection more-user-infos
   * the current user itself (in case he/she is not a guest) trigger this change every 5min in the main-component by mouseover or touch event
   * so the following function check the status of the user and set him/her status to isOnline=false
   * so in the user-window component change the color of the small circle to show the status 
   */
  async checkUsersLastActivity() {
    for (let i = 0; i < this.usersAdditionalInfos.length; i++) {
      const user = this.usersAdditionalInfos[i];
      //only if user is online it has to be proofed if he is away
      if (user.isOnline) {
        let newTime = Math.round(new Date().getTime() / 1000);
        if (newTime - user.timeStampLastActivity > 600) {
          await updateDoc(doc(this.db, "more-user-infos", user.uid), {
            isOnline: false
          });
        }
      }
    }
  }

  async UserDataOfUserExist(userUid) {
    const docRef = doc(this.db, "users", userUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return true;
    else return false;
  }
}
