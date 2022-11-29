import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  currentChannelId: string = '';
  currentChannel: any;
  arrayOfChannels: any[] = [];
  showThread: boolean = false;
  posts: any;
  showChannel: boolean = false;
  currentThread: any;
  constructor() { }

  async loadChannels() {
    let q = query(collection(this.db, "channel"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.arrayOfChannels.length = 0;
      querySnapshot.forEach((doc) => {
        this.arrayOfChannels.push(doc.data())
      })
    });
  }

  saveCurrentChannel(channel) {
    // localStorage.setItem('currentChannel', channelId);
    this.currentChannel = channel;
    this.loadChannel();
  }

  loadChannel() {
    let q = query(collection(this.db, "channel", this.currentChannel.id, "posts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.posts = [];
      this.showChannel = false;
      querySnapshot.forEach((doc) => {
        this.posts.push(doc.data())
        this.loadChannelAnswers();
      })
   /*   setTimeout(() => {
        this.getImagesOfEveryPost();
      }, 5000);*/

      this.showChannel = true;
    });
    this.showChannel = true;

  }

  getImagesOfEveryPost() {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].imageUrl.length > 0) {
        console.log('ABC')
        const imageUrls = this.posts[i].imageUrl;
        for (let j = 0; j < imageUrls.length; i++) {
          const imageUrl = imageUrls[j];
          this.posts[i].imageUrl[j] = this.getImage(imageUrl);
        }
      }
    }
  }

  /*download images area*/


  storage = getStorage();

  // Get the download URL
  getImage(postImageUrl) {
    console.log('AVC')
    getDownloadURL(ref(this.storage, 'uploads/' + postImageUrl))
      .then((url) => {
        return `<img src="${url}">`;
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
  }

  loadChannelAnswers() {
    for (let i = 0; i < this.posts.length; i++) {
      const post = this.posts[i];
      let answers = [];
      this.posts[i].answers = answers; //necessary for inital load, because else it doesn't know posts.answers in html
      let q = query(collection(this.db, "channel", this.currentChannel.id, "posts", `${post.id}`, 'answers'))
      let unsubscribe = onSnapshot(q, (querySnapshot) => {
        answers = [];
        querySnapshot.forEach((doc) => {
          answers.push(doc.data())
          this.posts[i].answers = answers;
        })
      });
    }
  }
}
