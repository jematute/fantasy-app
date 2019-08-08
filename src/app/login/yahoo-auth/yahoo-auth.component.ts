import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yahoo-auth',
  templateUrl: './yahoo-auth.component.html',
  styleUrls: ['./yahoo-auth.component.less']
})
export class YahooAuthComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(s => {
      console.log(s);
    });
  }

}
