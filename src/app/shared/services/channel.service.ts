import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  currentChannelId: string = '';

  arrayOfChannels: any[] = [];
  constructor() { }

  async loadChannels() {
    this.arrayOfChannels.length = 0;

    const querySnapshot = await getDocs(collection(this.db, "channel"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.arrayOfChannels.push(doc.data())
    });
  }

  saveCurrentChannelId(channelId){
    localStorage.setItem('currentChannel', JSON.stringify(channelId));
    this.currentChannelId = channelId;
  }
}
