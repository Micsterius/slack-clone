import { Component, OnInit, Input } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { MatDialogRef } from '@angular/material/dialog';
import { collection, getDocs, getFirestore, onSnapshot, query, addDoc, doc, updateDoc } from 'firebase/firestore';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
import { ChatService } from 'src/app/shared/services/chat.service';
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
    public chatServ: ChatService
  ) { }

  ngOnInit(): void {
  }

  async goToChat(userUid) {





    // if (this.name.length >= 3 && !this.checkIfNameAlreadyExist()) {
    //   let docRef = await addDoc(collection(this.db, "KEIN PLAN"), {
    //     name: this.name,
    //   });
    //   this.updateIdInFirestoreChannelDocs(docRef.id);
    // } else {
    //   if (this.name.length < 3) alert('Bitte User mit mindestens 3 zeichen eigeben');
    //   if (this.checkIfNameAlreadyExist()) alert('Chat existiert bereits');
    // }



  }

  //give the id of document in the document as a field
  // async updateIdInFirestoreChannelDocs(id) {
  //   let docRef = doc(this.db, "KEIN PLAN", id);
  //   await updateDoc(docRef, {
  //     id: id
  //   })
  //   this.dialogRef.close();
  // }

  checkIfUserHasChat(userUid) {
    if (this.chatServ.arrayOfFriendsWithChatUid.some(user => user.uid == userUid)) {
      this.goToChat(userUid)
    }
    // else{
    //   this.chatServ.loadChat()
    // }
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
