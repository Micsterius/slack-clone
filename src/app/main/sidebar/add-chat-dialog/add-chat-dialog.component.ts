import { Component, OnInit, Input } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { MatDialogRef } from '@angular/material/dialog';
import { collection, getDocs, getFirestore, onSnapshot, query, addDoc, doc, updateDoc } from 'firebase/firestore';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/shared/services/chat.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GeneralService } from 'src/app/shared/services/general.service';
@Component({
  selector: 'app-add-chat-dialog',
  templateUrl: './add-chat-dialog.component.html',
  styleUrls: ['./add-chat-dialog.component.scss']
})
export class AddChatDialogComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  searchMatchesUsers;
  @Input() name: any;
  constructor(
    public dialogRef: MatDialogRef<AddChatDialogComponent>,
    public userServ: UsersService,
    public chatServ: ChatService,
    public authServ: AuthService,
    public generalService: GeneralService
  ) { }

  ngOnInit(): void {
  }

  async goToChat(userChatId) {
    this.chatServ.saveCurrentChatId(userChatId);
    console.log(userChatId)
    this.generalService.scrollToBottomBoolean();
    //  localStorage.setItem('userChat', JSON.stringify(this.chatServ.currentUserChat));
    this.dialogRef.close();
  }

  checkIfUserHasChat(userUid) {
    if (this.chatServ.arrayOfFriendsWithChatUid.some(user => user.author == userUid)) {
      let chatId = this.getChatId(userUid)
      this.goToChat(chatId)
    }
    else this.createChat(userUid);
  }

  getChatId(userUid){
    let chat = this.chatServ.arrayOfFriendsWithChatUid.find(chat => chat.author == userUid);
    let chatId = chat.id;
    return chatId;
  }

  async createChat(userUid) {
    let docRef = await addDoc(collection(this.db, "posts"), {
      authors: [userUid, this.authServ.userData.uid]
    });
    this.updateIdInFirestoreChatDocs(docRef.id);
    this.goToChat(docRef.id)
  }

  //give the id of document in the document as a field
  async updateIdInFirestoreChatDocs(id) {
    let docRef = doc(this.db, "posts", id);
    await updateDoc(docRef, {
      id: id
    })
  }

  searchForMatch() {
    //suche nach übereinstimmungen mit users array in services bzgl displayName
    if (this.name !== '') {
      this.searchMatchesUsers = this.userServ.users.filter(user => {
        const regex = new RegExp(`^${this.name}`, "gi")
        return user.displayName.match(regex)
      })
    }
  }
}
