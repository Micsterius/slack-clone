import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { finalize, Observable } from 'rxjs';
import { FileUpload } from 'src/app/models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  storageFB = getStorage();
  private basePath = '/uploads';
  public basePathUser: string = '';
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) { }

  /*  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
      const filePath = `${this.basePath}/${fileUpload.file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileUpload.file);
  
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
          });
        })
      ).subscribe();
  
      return uploadTask.percentageChanges();
    }
  */
  pushUserImageFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const filePath = `${this.basePathUser}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  async pushFileToStorage(fileUpload: FileUpload) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = ref(this.storageFB, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileUpload.file);

    uploadBytes(storageRef, fileUpload.file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          return downloadURL;
        });
      }
    );
  }
}
