import { FantasyAPIService } from '../../../yahooapi/fantasy-api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.less']
})
export class TeamListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private yahooApi: FantasyAPIService) { }

  teams = [];

  ngOnInit() {
    this.route.parent.paramMap.subscribe(params => {
      const leagueId = params.get('id');
      this.yahooApi.getTeams(leagueId).subscribe(data => {
        let teams = data.fantasy_content.league[1].teams;
        this.teams = [];
        for (let team in teams) {
          if (teams[team[0]]) {
            let teamObj = teams[team[0]].team[0];
            let tObj = {};
            teamObj.forEach(element => {
              if (typeof element === 'object') {
                for (let prop in element) {
                  tObj[prop] = element[prop];
                }
              }
            });
            this.teams.push(tObj);
          }
        }
      });
    });
  }

}
