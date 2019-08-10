import { Injectable } from '@angular/core';
import { OAuthResponse } from '../classes/oauthresponse';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FantasyAPIService {

  constructor(private http: HttpClient) { }


  getGames() {
    const url = "/fantasy/v2/users;use_login=1/games?format=json";
    return this.yahooRequest(url);
  }

  getLeagues(gameKey) {
    const url = `/fantasy/v2/users;use_login=1/games;game_keys$=${gameKey}/leagues?format=json`;
    return this.yahooRequest(url);
  }

  getLeagueMetaData(leagueKey) {
    const url = `fantasy/v2/league/${leagueKey}/metadata?format=json`;
    return this.yahooRequest(url);
  }

  getTeams(leagueKey) {
    const url = `/fantasy/v2/league/${leagueKey}/teams?format=json`;
    return this.yahooRequest(url);
  }

  getTeamMetaData(teamKey: string) {
    const url = `/fantasy/v2/team/${teamKey}/metadata?format=json`;
    return this.yahooRequest(url);
  }

  getTeamRoster(teamKey: string) {
    const url = `/fantasy/v2/team/${teamKey}/roster?format=json`;
    return this.yahooRequest(url);
  }

  getTransactions(leagueKey: string) {
    const url = `/fantasy/v2/league/${leagueKey}/transactions?format=json`;
    return this.yahooRequest(url);
  }



  yahooRequest(path: string): Observable<any> {
    path = path.startsWith('/') ? path : '/' + path;
    const yahooURL = "https://fantasysports.yahooapis.com" + path;
    let yahooToken: OAuthResponse = JSON.parse(localStorage.getItem("yahoo_token"));
    return this.http.get(`http://localhost:3001/makerequest?access_token=${yahooToken.access_token}&url=${yahooURL}&type=GET`).pipe(map(s => {
      return s;
    }, error => {
      console.log(error);
    }));
  }

}
