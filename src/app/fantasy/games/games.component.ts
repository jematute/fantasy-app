import { FantasyAPIService } from 'src/app/yahooapi/fantasy-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.less']
})
export class GamesComponent implements OnInit {

  constructor(private yahooApi: FantasyAPIService) { }

  games: Array<any>;
  distinctGames: Array<any>;
  seasons: Array<any>;
  currentGame: string = "";
  currentLeagues: Array<any>;

  ngOnInit() {
    this.yahooApi.getGames().subscribe(resp => {
      const content = resp.fantasy_content;
      const users = content.users;
      const user = users[0];
      const games = user.user[1].games;
      this.games = [];
      for (let game in games) {
        let s: any = {};
        if (games[game].game)
           s = games[game].game[0];
        if (s) {
          if (s.season) {
            this.games.push(s);
          }
        }
      }

      this.distinctGames = [...new Set(this.games.map(x => x.name))];
    });
  }


  showSeasons(game: any) {
    this.currentGame = game;
    this.seasons = this.games.filter(s => s.name == game);
  }

  getLeagues(game: any) {
    this.yahooApi.getLeagues(game.game_key).subscribe(data => {
      console.log(data);
      const user = data.fantasy_content.users[0].user[0];
      const leagues = this.mapUserLeagues(data.fantasy_content.users[0].user[1].games);
      let theLeague = leagues.filter(s => s.game_key == game.game_key)[0];
      this.currentLeagues = theLeague.leagues;
      console.log(theLeague);
    });
  }

  getTeams(league: any) {
    console.log(league);
  }

  mapUserTeams(gs) {
    // TODO: clean this up?
    const count = gs.count;
    const games = [];

    for (let i = 0; i < count; i++) {
      let game = gs[i].game[0];

      const ts = gs[i].game[1].teams;
      const teamCount = ts.count;
      const teams = [];
      for (let j = 0; j < teamCount; j++) {
        const team = this.mapTeam(ts[j].team[0]);

        teams.push(team);
      }

      game.teams = teams;
      games.push(game);
    }

    return games;
  }

  mergeObjects(arrayOfObjects): any {
    const destinationObj = {};

    if (arrayOfObjects) {
      arrayOfObjects.forEach(obj => {
        Object.keys(obj).forEach(key => {
          if ("undefined" != typeof key) {
            destinationObj[key] = obj[key];
          }
        });
      });
    }

    return destinationObj;
  }

  mapTeam(t) {
    const team = this.mergeObjects(t);
    // clean up team_logos
    if (team.team_logos.length) {
      team.team_logos = team.team_logos.map(logo => logo.team_logo);
    } else {
      // fix issue #49 -- no team logo throwing error
      team.team_logos = [];
    }

    // clean up managers
    team.managers = team.managers.map(manager => manager.manager);

    return team;
  }

  mapUserLeagues(gs) {
    // TODO: clean this up?
    const count = gs.count;
    const games = [];

    for (let i = 0; i < count; i++) {
      let game = gs[i].game[0];
      if (!game)
        continue;
      const ls = gs[i].game[1].leagues;
      const leagueCount = ls.count;
      const leagues = [];

      for (let j = 0; j < leagueCount; j++) {
        if (ls[j])
          leagues.push(ls[j].league);
      }

      game.leagues = leagues;
      games.push(game);
    }

    return games;
  }

}
