import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, onSnapshot, query, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.scss']
})
export class AddChannelDialogComponent implements OnInit {
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  @Input() name:any;

  constructor(
    public dialogRef: MatDialogRef<AddChannelDialogComponent>,
    public channel: ChannelService
    ) { }

  ngOnInit(): void {
  }

  async createNewChannel(){
    if(this.name){
      let docRef = await addDoc(collection(this.db, "channel"), {
        id: 'id', //push doc id here :)
        name: this.name, 
      });
    } else{
      alert('Bitte Channel mit mindestens 3 zeichen eigeben')
    }
  }

}
