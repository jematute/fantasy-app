import { Injectable } from '@angular/core';
import { OAuthResponse } from '../classes/oauthresponse';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
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
    return this.yahooRequest(url).pipe(map(data => {
      const team = data.fantasy_content.team[0];
      let teamObj = {};
      team.forEach(element => {
        if (typeof(element) === 'object') {
          for (let key in element) {
            teamObj[key] = element[key];
          }
        }
      });
      return teamObj;
    }));
  }

  getTeamRoster(teamKey: string) {
    const url = `/fantasy/v2/team/${teamKey}/roster?format=json`;
    return this.yahooRequest(url).pipe(map(data => {
      let roster = [];
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
        roster.push(player);
      }
      return roster;
    }));
  }

  getTransactions(leagueKey: string, team_key: string) {
    const url = `/fantasy/v2/league/${leagueKey}/transactions?format=json`;
    return this.yahooRequest(url).pipe(map(data => {
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
                  if (player['transaction_data'].destination_team_key === team_key)
                    relevant = true;
                }
                else {
                  if (player['transaction_data'].source_team_key === team_key)
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
      return trans;
    }));
  }

  getDraftResults(leagueId: string, teamKey: string) {
    const url = `/fantasy/v2/team/${teamKey}/draftresults?format=json`;
    return this.yahooRequest(url).pipe(map(data => {
      let dr = data.fantasy_content.team[1].draft_results;

      const draft_results = [];
      for (let d in dr) {
        if (dr[d].draft_result)
          draft_results.push(dr[d].draft_result);
      }
      return draft_results;
    })).pipe(switchMap(draftdata => {
      const playerKeys = [];
      draftdata.forEach(pick => {
        if (pick)
          playerKeys.push(pick.player_key);
      });
      return this.getPlayerInfo(leagueId, playerKeys).pipe(map(playerData => {
        let results = draftdata.map(s => {
          try {
            let playerInfo = playerData.filter(p => p.player_key === s.player_key)[0];
            s["player_info"] = playerInfo;
            return s;
          } catch (error) {
            console.log("error");
          }
        });
        return results;
      }));
    }));
  }

  getPlayerInfo(leagueKey: string, playerKeys: Array<string>) {
    const url = `/fantasy/v2/league/${leagueKey}/players;player_keys=${playerKeys.join(",")}?format=json`;
    return this.yahooRequest(url).pipe(map(data => {
        const pl = data.fantasy_content.league[1].players;
        const players = [];
        for (let p in pl) {
          //array
          let plArr: any;
          if (pl[p].player)
            plArr = pl[p].player[0];
          else
            continue;
          let plObj = {};
          plArr.forEach(p => {
            for (let prop in p) {
              plObj[prop] = p[prop];
            }
          });
          players.push(plObj);
        }
        return players;
    }));
  }

  getGameWeeks(gameKey: string) {
    const url = `/fantasy/v2/game/${gameKey}/game_weeks?format=json`;
    return this.yahooRequest(url).pipe(map(data => {
      const gw = data.fantasy_content.game[1].game_weeks;
      const game_weeks = [];
      for (let w in gw) {
        game_weeks.push(gw[w]);
      }
      return game_weeks;
    }));
  }

  calculateKeepers(leagueId: string, teamKey: string) {
    return this.getTeamRoster(teamKey).pipe(switchMap(roster => {
      return this.getGameWeeks(leagueId.split('.')[0]).pipe(switchMap(weeks => {
        return this.getDraftResults(leagueId, teamKey).pipe(switchMap(draftResults => {
          return this.getTransactions(leagueId, teamKey).pipe(map(tx => {
            //iterate each player in the roster
            roster.forEach(player => {
              //check if player was drafted
              if (this.isPlayerDrafted(player, draftResults)) {
                console.log("Player Drafted", player.name.full);
              }
              //check if player was dropped
              this.wasPlayerInTransaction(player, tx);
            });
            return "Some Object";
          }))
        }))
      }))
    }));
  }

  isPlayerDrafted(player, draftresults) {
    let drafted = false;
    draftresults.forEach(result => {
      if (result.player_key === player.player_key)
        drafted = true;
    });
    return drafted;
  }

  wasPlayerInTransaction(player, transactions) {
    let playerTrans;
    transactions.forEach(tr => {
      tr.players.forEach(pl => {
        if (player.player_key === pl.player_key) {
          console.log(pl, tr);
          playerTrans = { date: tr.data };
        }
      })
    });
    playerTrans;
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
