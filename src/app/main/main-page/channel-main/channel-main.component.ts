import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-channel-main',
  templateUrl: './channel-main.component.html',
  styleUrls: ['./channel-main.component.scss']
})
export class ChannelMainComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  name: string = '';
  currentChannel: any;
  posts: any[] = [];
  showChannel: boolean = true;
  currentChannelId: string = '';
  constructor(
    public channelServ: ChannelService,
    public detailViewService: DetailViewPageService) {
    this.currentChannel = JSON.parse(localStorage.getItem('currentChannel')!)
    this.loadChannel()
  }

  ngOnInit(): void {
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

  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showThread = true;
  }

  saveAnswersToShow(answers) {
    let answersForThread = {
      name: this.currentChannel.name,
      answers: answers
    }
    localStorage.setItem('answersForThread', JSON.stringify(answersForThread));
    this.channelServ.showThread = true;
  }
}
