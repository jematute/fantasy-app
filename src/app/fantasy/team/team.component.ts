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
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const teamId = params.get("id");
      if (teamId) {
        this.yahooApi.getTeamMetaData(teamId).subscribe(data => {
          const team = data.fantasy_content.team[0];
          let teamObj = {};
          team.forEach(element => {
            if (typeof(element) === 'object') {
              for (let key in element) {
                teamObj[key] = element[key];
              }
            }
          });

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
    this.yahooApi.getTeamRoster(this.team.team_key).subscribe(data => {
      const pl = data.fantasy_content.team[1].roster[0].players;
      for (let p in pl) {
        let player = {};
        const plArr = pl[p].player;
        if (plArr instanceof Array) {
          plArr.forEach(s => {
            if (s instanceof Array) {
              s.forEach(p => {
                if (typeof(p) === 'object') {
                  for (let prop in p) {
                    player[prop] = p[prop];
                  }
                }
              });
            }

          });
        }
        this.roster.push(player);
      }
      this.loading = false;
    });

  }

  getTransactions() {
    this.loading = true;
    this.yahooApi.getTransactions(this.leagueId).subscribe(data => {
      const t = data.fantasy_content.league[1].transactions;
      const trans = [];
      for (let i in t) {
        let relevant = false;
        const trx = t[i].transaction;

        let tr;
        let pl;
        if (trx) {
          tr = trx[0];
          pl = trx[1].players;
        }

        const pl2 = [];
        for (let p in pl) {
          pl2.push(pl[p]);
        }

        const players = [];
        pl2.forEach(p2 => {
          if (typeof(p2) === 'object') {
            let p3 = p2.player;

            let player = {};
            p3.forEach(pa => {
              if (pa.constructor !== Array) {
                if (pa.transaction_data.constructor === Array) {
                  player['transaction_data'] = pa.transaction_data[0];
                  if (pa.transaction_data.length > 1) {
                    alert("More than 1 item for transanction");
                  }
                }
                else
                  player['transaction_data'] = pa.transaction_data;

                if (player['transaction_data'].destination_type === "team") {
                  if (player['transaction_data'].destination_team_key === this.team.team_key)
                    relevant = true;
                }
                else {
                  if (player['transaction_data'].source_team_key === this.team.team_key)
                    relevant = true;
                }

              }
              else {
                pa.forEach(pp => {
                  for (let pp2 in pp) {
                    player[pp2] = pp[pp2];
                  }
                });
              }
            });
            players.push(player);
          }
        });
        if (tr) {
          tr["date"] = new Date(tr.timestamp * 1000).toLocaleDateString();
          tr["time"] = new Date(tr.timestamp * 1000).toLocaleTimeString();
        }

        if (relevant)
          trans.push({ transaction: tr, players: players });
      }
      this.transactions = trans;
      this.loading = false;
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
      default:
        break;
    }
  }

}
