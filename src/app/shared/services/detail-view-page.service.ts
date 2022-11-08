import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DetailViewPageService {
showUserInfo: boolean = true;
showThread: boolean = false;
  constructor() { }
}
