import * as https from "https";
import { Observable } from 'rxjs';
import { ClientSettings } from "./client-settings";
import { OAuthSettings } from "./oauthsettings";

export class OAuth {
  getOAuthDirectory(): Observable<any> {
    return Observable.create((observer:any) => {
      https.get("https://login.yahoo.com/.well-known/openid-configuration", (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          observer.next(JSON.parse(data));
          ClientSettings.getInstance().oAuthSettings = JSON.parse(data);
        });
      });
    });
  }

  getToken(clientId: string, code: string, redirecturi: string, refresh: boolean) {
    return Observable.create((observer:any) => {
      const secret = '10d341a4ccc4a7601ec2c6a347608ff63a3d952e';
      let data = `${clientId}:${secret}`;
      let buff = new Buffer(data);
      let encodedData = buff.toString('base64');
      let grantType = "authorization_code";
      let postData = "";

      this.getOAuthDirectory().subscribe(s => {
        let settings = ClientSettings.getInstance().oAuthSettings;
        if (settings) {

          if (refresh) {
            grantType = "refresh_token";
            postData = `grant_type=${grantType}&redirect_uri=${encodeURIComponent(redirecturi)}&refresh_token=${code}`;
          }
          else {
            postData = `grant_type=${grantType}&code=${code}&redirect_uri=${encodeURIComponent(redirecturi)}&client_id=${clientId}&scope=openid`;
          }

          let urlArr = settings.token_endpoint.split('/');

          const options = {
            method: 'POST',
            hostname: 'api.login.yahoo.com',
            path: `/${urlArr[3]}/${urlArr[4]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${encodedData}`,
              'Content-Length': Buffer.byteLength(postData)
            }
          };
          const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              console.log(data);
              observer.next(data);
            });
          });

          req.write(postData);
          req.end();
        }
      });
    });
  }

  refreshToken(clientId: string, refresh_token: string, redirectUri: string) {
    return this.getToken(clientId, refresh_token, redirectUri, true);
  }


  makeRequest(token: string, url: string, type: string, data: string) {
    return Observable.create((observer: any) => {
      let urlArr = url.split('/');

      const host = urlArr[2];
      let path = '/';
      let buff = new Buffer(token);
      let encodedData = buff.toString('base64');

      urlArr.forEach((val, idx) => {
        if (idx > 2) {
          path += val;
          if (idx != urlArr.length - 1) {
            path = path + '/';
          }
        }
      });

      if (!data) {
        data = "";
      }

      const options = {
        method: type,
        hostname: host,
        path: path,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(data);
          if (res.statusCode == 200) {
            observer.next(data);
          }
          else {
            observer.error({ status: res.statusCode, data: data });
          }

        });
      });

      if (type != "GET") {
        req.write(data);
      }

      req.end();

    });
  }



}
