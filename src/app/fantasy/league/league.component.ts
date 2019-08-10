import { FantasyAPIService } from 'src/app/yahooapi/fantasy-api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.less']
})
export class LeagueComponent implements OnInit {

  constructor(private route: ActivatedRoute, private yahooApi: FantasyAPIService) { }

  league: any;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const leagueId = params.get('id');
      this.yahooApi.getLeagueMetaData(leagueId).subscribe(data => {
        this.league = data.fantasy_content.league[0];
      });
    });
  }
}
