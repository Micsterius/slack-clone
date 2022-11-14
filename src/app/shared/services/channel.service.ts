import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot, query } from 'firebase/firestore';
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
    this.arrayOfChannels.length = 0;

    let q = query(collection(this.db, "channel"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.arrayOfChannels.push(doc.data())
      })
    });
  }

  /**
   * 
let q = query(collection(this.db, "channel"))
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.arrayOfChannels.push(doc.data())
      })
    });
   */

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
      this.showChannel = true;
    });
    this.showChannel = true;

  }

  loadChannelAnswers() {
    console.log(this.currentChannel.id)
    for (let i = 0; i < this.posts.length; i++) {
      const post = this.posts[i];
      console.log(post.id)
      let answers = [];
      let q = query(collection(this.db, "channel", this.currentChannel.id, "posts", `${post.id}`, 'answers'))
      let unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          answers.push(doc.data())
        })
      });
      this.posts[i].answers = answers;
      console.log(this.posts[i])
    }
  }
}
