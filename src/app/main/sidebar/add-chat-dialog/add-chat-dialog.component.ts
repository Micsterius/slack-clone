import { Component, OnInit, Input } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { MatDialogRef } from '@angular/material/dialog';
import { collection, getDocs, getFirestore, onSnapshot, query, addDoc, doc, updateDoc } from 'firebase/firestore';
import { UsersService } from 'src/app/shared/services/users.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-chat-dialog',
  templateUrl: './add-chat-dialog.component.html',
  styleUrls: ['./add-chat-dialog.component.scss']
})
export class AddChatDialogComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  @Input() name:any;
  constructor(
    public dialogRef: MatDialogRef<AddChatDialogComponent>,
    public user: UsersService,
  ) { }

  ngOnInit(): void {
  }

  async createNewChat(){
    if (this.name.length >= 3 && !this.checkIfNameAlreadyExist()) {
      let docRef = await addDoc(collection(this.db, "KEIN PLAN"), {
        name: this.name,
      });
      this.updateIdInFirestoreChannelDocs(docRef.id);
    } else {
      if(this.name.length < 3) alert('Bitte User mit mindestens 3 zeichen eigeben');
      if(this.checkIfNameAlreadyExist()) alert('Chat existiert bereits');
    }
  }

    //give the id of document in the document as a field
    async updateIdInFirestoreChannelDocs(id) {
      let docRef = doc(this.db, "KEIN PLAN", id);
      await updateDoc(docRef, {
        id: id
      })
      this.dialogRef.close();
    }

  checkIfNameAlreadyExist(){
    return this.user.users.some(user => user.name == this.name)
   }

   searchForMatch(){
    //suche nach übereinstimmungen mit users array in services bzgl displayName
   }
}
