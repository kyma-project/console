import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppConfig } from './../app.config';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface ITokens {
  id_token_stored_at?: string;
  id_token_expired_at?: string;
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public oAuthService: OAuthService, private router: Router) {}

  private isNewToken(): boolean {
    const now = Date.now();
    const maximumAgeInSeconds = 10;
    return (
      parseInt(sessionStorage.getItem('id_token_stored_at')) >
      now - 1000 * maximumAgeInSeconds
    );
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(AppConfig.authIssuer)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.oAuthService.getIdToken()}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err.status === 401) {
            if (this.isNewToken()) {
              sessionStorage.setItem(
                'requestError',
                JSON.stringify({
                  sourceUrl: window.location.pathname,
                  data: err
                })
              );
              this.router.navigateByUrl('/requestError');
            } else {
              Object.keys(sessionStorage).forEach(k =>
                sessionStorage.removeItem(k)
              );
              this.oAuthService.initImplicitFlow();
              this.router.navigateByUrl('/');
            }
          }
        }
      )
    );
  }
}
