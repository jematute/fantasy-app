import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { FantasyAPIService } from './../../yahooapi/fantasy-api.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.less']
})
export class TeamComponent implements OnInit {

  constructor(private yahooApi: FantasyAPIService, private route: ActivatedRoute) { }

  team: any = {};
  logo: string;
  roster: Array<any> = [];
  leagueId: string;
  transactions: Array<any> = [];
  loading = false;
  draftResults: Array<any> = [];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const teamId = params.get("id");
      if (teamId) {
        this.yahooApi.getTeamMetaData(teamId).subscribe(teamObj => {
          this.team = teamObj;
          if (this.team.team_logos.length > 0 ) {
            this.logo = this.team.team_logos[0].team_logo.url;
          }
        });
      }
    });

    this.route.parent.paramMap.subscribe(params => {
      const leagueId = params.get("id");
      this.leagueId = leagueId;
    });

  }

  getRoster() {
    this.loading = true;
    this.yahooApi.getTeamRoster(this.team.team_key).subscribe(roster => {
      this.roster = roster;
      this.loading = false;
    });

  }

  getTransactions() {
    this.loading = true;
    this.yahooApi.getTransactions(this.leagueId, this.team.team_key).subscribe(trans => {
      this.transactions = trans;
      this.loading = false;
    });
  }

  getDraftResults() {
    this.loading = true;
    this.yahooApi.getDraftResults(this.leagueId, this.team.team_key).subscribe(data => {
      this.loading = false;
      this.draftResults = data;
    });
  }

  getKeepers() {
    //we get the game weeks
    this.yahooApi.calculateKeepers(this.leagueId, this.team.team_key).subscribe(keepers => {
      console.log(keepers);
    });
  }

  ucfirst(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }


  handleChange(event) {
    switch (event.index) {
      case 1:
        if (this.roster.length === 0) {
          this.getRoster();
        }
        break;
      case 2:
        if (this.transactions.length === 0) {
          this.getTransactions();
        }
        break;
      case 3:
        if (this.draftResults.length === 0) {
          this.getDraftResults();
        }
        break;
      case 4:
        this.getKeepers();
        break;
      default:
        break;
    }
  }

}
