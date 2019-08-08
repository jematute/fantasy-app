import { Component, OnInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthSettings } from './classes/oauthsettings';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'fantasy-app';

  constructor(private http: HttpClient, private route: ActivatedRoute, private login: LoginService) {
  }

  ngOnInit() {

  }
}
