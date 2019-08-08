import { Injectable } from '@angular/core';
import { OAuthResponse } from '../classes/oauthresponse';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FantasyAPIService {

  constructor(private http: HttpClient) { }

  yahooRequest(path: string) {
    path = path.endsWith('/') ? path : path + '/';
    const yahooURL = "https://fantasysports.yahooapis.com" + path;
    let yahooToken: OAuthResponse = JSON.parse(localStorage.getItem("yahoo_token"));
    return this.http.get(`http://localhost:3001/makerequest?access_token=${yahooToken.access_token}&url=${yahooURL}&type=GET`).pipe(map(s => {
      console.log(s);
    }, error => {
      console.log(error);
    }));
  }

}
