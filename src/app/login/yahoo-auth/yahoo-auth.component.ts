import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-yahoo-auth',
  templateUrl: './yahoo-auth.component.html',
  styleUrls: ['./yahoo-auth.component.less']
})
export class YahooAuthComponent implements OnInit {

  constructor(private route: ActivatedRoute, private login: LoginService) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(s => {
      const code = s.get("code");
      if (code) {
        this.login.getToken(code);
      }
    });
  }

}
