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
  storage = getStorage();

  currentChannelId: string = '';
  currentChannel: any;
  arrayOfChannels: any[] = [];
  showThread: boolean = false;
  posts: any;
  showChannel: boolean = false;
  showAnswers: boolean = false;
  currentThread: any;
  constructor() { }

  //load all channels as observables which will be run again if in firestore collection sth change
  async loadChannels() {
    let q = query(collection(this.db, "channel"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.arrayOfChannels.length = 0;
      querySnapshot.forEach((doc) => {
        this.arrayOfChannels.push(doc.data())
      })
    });
  }

  //get current channel from sideboard
  saveCurrentChannel(channel) {
    this.currentChannel = channel;
    this.loadChannel();
  }

  //load all posts of the channel
  loadChannel() {
    let q = query(collection(this.db, "channel", this.currentChannel.id, "posts"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.posts = [];
      this.showChannel = false;
      querySnapshot.forEach((doc) => {
        this.posts.push(doc.data())
        this.loadChannelAnswers();
      })
      this.getImagesForPostFromStorage()
    });
  }

  //start function get image for all posts with an image url
  getImagesForPostFromStorage() {
    for (let i = 0; i < this.posts.length; i++) {
      const post = this.posts[i];
      if (post.imageUrl.length > 0) this.getImage(i)

    }
    this.showChannel = true;
  }

  // Get the download URL for the image
  getImage(number) {
    for (let i = 0; i < this.posts[number].imageUrl.length; i++) {
      const imageUrl = this.posts[number].imageUrl[i];
      getDownloadURL(ref(this.storage, 'uploads/' + imageUrl))
        .then((url) => {
          this.posts[number].imageUrl[i] = `<img src="${url}" alt="">`;
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
    this.showChannel = true;
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
        if(this.posts[i].answers.length > 0) this.loadImagesToAnswers(i)
      });
    }
  }

  loadImagesToAnswers(i) {
    for (let j = 0; j < this.posts[i].answers.length; j++) {
      if (this.posts[i].answers[j].imageUrl.length > 0) this.getImageForAnswers(i, j)
    }
    this.showAnswers = true;
  }

  getImageForAnswers(i, j) {
    for (let f = 0; f < this.posts[i].answers[j].imageUrl.length; f++) {
      const imageUrl = this.posts[i].answers[j].imageUrl[f];
      getDownloadURL(ref(this.storage, 'uploads/' + imageUrl))
        .then((url) => {
          this.posts[i].answers[j].imageUrl[f] = `<img src="${url}" alt="">`;
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
  }
}
