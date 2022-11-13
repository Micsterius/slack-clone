import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  getTransformedTimeStampToDate(timeStamp) {
    let date = new Date(timeStamp);
    return date;
  }
}
