import { OAuth } from './oauth';
import {Request, Response} from "express";
import { DataService } from "./data-service";
import { ClientSettings  } from './client-settings';
import { OAuthSettings } from './oauthsettings';
export class Routes {
    clientSettings = ClientSettings.getInstance();
    public routes(app): void {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!11!'
            })
        });

        app.route('/getoauthdirectory')
        .get((req: Request, res: Response) => {
            const oauth = new OAuth();
            oauth.getOAuthDirectory().subscribe(data => {

              res.status(200).send(data);
            });
        });

        app.route('/gettoken')
        .get((req: Request, res: Response) => {
          const code = req.query.code;
          const oauth = new OAuth();
          const clientId = "dj0yJmk9ZDlZYWF2N2NMYXlpJmQ9WVdrOVZYZGxVa2gyTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wNw--";
          const redirectUri = "http://matute.remoteaccess.me:4200/yahoo_oauth";

          oauth.getToken(clientId,code, redirectUri, false).subscribe(s => {
            res.status(200).send(s);
          });
        });

        app.route('/refreshtoken')
        .get((req: Request, res: Response) => {
          const refresh_token = req.query.refresh_token;
          const oauth = new OAuth();
          const clientId = "dj0yJmk9ZDlZYWF2N2NMYXlpJmQ9WVdrOVZYZGxVa2gyTXpJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wNw--";
          const redirectUri = "http://matute.remoteaccess.me:4200/yahoo_oauth";
          oauth.refreshToken(clientId, refresh_token, redirectUri).subscribe(s => {
            res.status(200).send(s);
          });
        });

        app.route('/getuserinfo')
        .get((req: Request, res: Response) => {

        });

        app.route('/makerequest')
        .get((req: Request, res: Response) => {
          const token = req.query.access_token;
          const type = req.query.type;
          const url = req.query.url;
          const data = req.body;
          const oauth = new OAuth();

          oauth.makeRequest(token, url, type, "").subscribe(resp => {
            res.status(200).send(resp);
          }, error => {
            res.status(error.status).send(error.data);
          });
        });



      }
}
