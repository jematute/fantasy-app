import { OAuthResponse } from '../../classes/oauthresponse';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
import { map } from 'rxjs/operators';
import { FantasyAPIService } from 'src/app/yahooapi/fantasy-api.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less']
})
export class HomepageComponent implements OnInit {

  constructor(private fantasyApi: FantasyAPIService, private login: LoginService) { }

  ngOnInit() {
  }

  getGames() {
    let yahooURL = "/fantasy/v2/game/nfl?format=json";
    this.fantasyApi.yahooRequest("/fantasy/v2/users;use_login=1/games?format=json");
  }


}
