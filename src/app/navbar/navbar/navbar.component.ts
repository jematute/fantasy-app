import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login/login.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  constructor(private login: LoginService) { }

  ngOnInit() {
  }

  loginToYahoo() {
    this.login.loginToYahoo();
  }

}
