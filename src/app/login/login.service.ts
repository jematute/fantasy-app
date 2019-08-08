import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthSettings } from '../classes/oauthsettings';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OAuthResponse } from '../classes/oauthresponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }


  loginToYahoo() {
    this.http.get('http://localhost:3001/getoauthdirectory').pipe(map(resp => resp as OAuthSettings)).subscribe(settings => {
      const clientId = 'dj0yJmk9ZDlZYWF2N2NMYXlpJmQ9WVdrOVZYZGxVa2gyTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wNw--';
      const authEndpoint = settings.authorization_endpoint;
      const redirectUrl = 'http://matute.remoteaccess.me:4200';
      const url = `${authEndpoint}?client_id=${clientId}&scope=openid&response_type=code&redirect_uri=${redirectUrl}`;

      window.location.href = url;
    });
  }

  getToken(code: string) {
    this.http.get(`http://localhost:3001/gettoken?code=${code}`).pipe(map(r => r as OAuthResponse)).subscribe(token => {
      localStorage.setItem("yahoo_token", JSON.stringify(token));
      this.router.navigate(['/home']);
    });
  }

  refreshToken() {
    const yahooToken: OAuthResponse = JSON.parse(localStorage.getItem("yahoo_token"));
    return this.http.get(`http://localhost:3001/refreshtoken?refresh_token=${yahooToken.refresh_token}`).pipe(map(resp => {
      localStorage.setItem("yahoo_token", JSON.stringify(resp));
      return resp;
    }));
  }

}
