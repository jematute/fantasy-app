import { throwError as observableThrowError, Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, map, catchError, finalize, tap, filter, take, timeout } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse,
    HttpSentEvent,
    HttpHeaderResponse,
    HttpProgressEvent,
    HttpUserEvent
} from '@angular/common/http';

import { Router } from '@angular/router';
import { OAuthResponse } from '../classes/oauthresponse';
import { LoginService } from './login.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private auth: LoginService;
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    errorSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private inj: Injector, private router: Router) {
        this.auth = this.inj.get(LoginService);
    }

    // tslint:disable-next-line:max-line-length
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        return next.handle(req).pipe(catchError(err => {
          return this.handle401(req, next);
        }));
    }

    handle401(req: HttpRequest<any>, next: HttpHandler) {
      if (!this.isRefreshingToken) {
        this.isRefreshingToken = true;
        return this.auth.refreshToken().pipe(switchMap(s => {
          this.isRefreshingToken = false;
          this.tokenSubject.next("token refreshed");
          const newReq = this.replaceToken(req);
          return next.handle(newReq);
        }));
      }
      else {
        return this.tokenSubject.pipe(filter(token => token != null), take(1), switchMap(token => {
          return next.handle(req);
      }));
      }
    }

    replaceToken(req: HttpRequest<any>) {
      const yahooToken: OAuthResponse = JSON.parse(localStorage.getItem("yahoo_token"));
      let paramsArr = req.url.substring(req.url.indexOf('?') + 1, req.url.length).split('&');
      paramsArr.forEach((item, idx) => {
        if (item.startsWith("access_token"))
          paramsArr[idx] = `access_token=${yahooToken.access_token}`
      });

      let url = req.url.substring(0, req.url.indexOf('?') + 1) + paramsArr.join('&');
      return req.clone({ url: url });
    }

}
