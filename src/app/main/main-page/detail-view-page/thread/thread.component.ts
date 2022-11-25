import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { DetailViewPageService } from 'src/app/shared/services/detail-view-page.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);

  answersForThread: any;
  answers: any[] = []
  message: any;
  actualUser: User;
  menuPositionY: any = 'below';

  constructor(
    public channelService: ChannelService,
    public usersService: UsersService,
    public generalService: GeneralService,
    private detailViewService: DetailViewPageService
  ) {
    /*  this.answersForThread = JSON.parse(localStorage.getItem('answersForThread')!);
      this.answers = this.answersForThread.answers;*/
    this.actualUser = JSON.parse(localStorage.getItem('user')!)
  }

  ngOnInit(): void {
  }

  async deletePost(post) {
    /*for (let i = 0; i < this.channelService.currentThread.post.answers.length; i++) {
      const answer = this.channelService.currentThread.post.answers[i];
      await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers", answer.id));
      if (this.channelService.currentThread.post.answers.length == 0) {
        await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id));
      }
    }*/
    this.deleteAllAnswers(post)
      .then(function (post) {
        this.deletePostComplete(post);
      })
    this.changeDetailViewPageContentToThread();
    /* setTimeout(() => {
       this.deletePostComplete(post);
     }, 500);*/
  }

  async deleteAllAnswers(post) {
    const querySnapshot = await getDocs(collection(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers"));
    querySnapshot.forEach(async (doc) => {
      this.deletePostAnswer(post, doc.id)
    });
  }

  async deletePostComplete(post) {
    await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id));
  }

  async deletePostAnswer(post, answerID) {
    await deleteDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", post.id, "answers", answerID));
  }

  changeDetailViewPageContentToThread() {
    this.detailViewService.showUserInfo = false;
    this.detailViewService.showOtherUserInfo = false;
    this.detailViewService.showThread = false;
    if (this.generalService.mobilViewIsActive) this.generalService.showPrevSlide = true;
  }

  async sendMessage() {
    let textId = Math.round(new Date().getTime() / 1000);
    let idAdd = Math.random().toString(16).substr(2, 6)

    let name = this.getNameOfAuthor();

    await setDoc(doc(this.db, "channel", this.channelService.currentChannel.id, "posts", this.channelService.currentThread.post.id, "answers", `${textId + idAdd}`),
      {
        content: this.message,
        authorId: this.actualUser.uid,
        authorName: name,
        id: `${textId + idAdd}`,
        timeStamp: textId
      })
    this.message = '';
  }

  getNameOfAuthor() {
    if (this.actualUser.displayName) return this.actualUser.displayName;
    else return 'Anonym'
  }

  getPosition(e) {
    let container = this.myScrollContainer.nativeElement.getBoundingClientRect()
    let y = e.clientY; //y-position of mouse
    let halfContainerHeight = container.height / 2

    if ((halfContainerHeight + container.top) >= y) this.menuPositionY = 'below'
    else this.menuPositionY = 'above'
  }
}
