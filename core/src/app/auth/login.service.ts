import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { AppConfig } from '../app.config';

@Injectable()
export class LoginService {
  private domain = '';
  private loggedIn = new ReplaySubject<boolean>(1);

  constructor(private oauthService: OAuthService, private router: Router) {
    this.domain = AppConfig.domain;
  }

  public isLoggedIn(): ReplaySubject<boolean> {
    this.loggedIn.next(this.oauthService.hasValidIdToken());
    return this.loggedIn;
  }

  public login() {
    this.oauthService.tryLogin().then(() => {
      if (this.oauthService.hasValidIdToken()) {
        let navigationPath = sessionStorage.getItem('consoleNavigationPath');
        sessionStorage.removeItem('consoleNavigationPath');
        navigationPath = navigationPath ? navigationPath : 'home';
        this.router.navigateByUrl(navigationPath);
        this.loggedIn.next(true);
      } else {
        this.oauthService.initImplicitFlow();
      }
    });
  }

  public logout() {
    if (AppConfig.idpLogoutUrl) {
      const logoutFrame = document.createElement('iframe');
      logoutFrame.setAttribute(
        'style',
        'position:absolute;top:0;visibility:hidden;'
      );
      logoutFrame.src = AppConfig.idpLogoutUrl;
      document.body.appendChild(logoutFrame);
      logoutFrame.addEventListener('load', () => {
        try {
          logoutFrame.parentNode.removeChild(logoutFrame);
        } finally {
          this.logoutInternal();
        }
      });
    } else {
      this.logoutInternal();
    }
  }

  private logoutInternal() {
    this.oauthService.logOut();
    this.loggedIn.next(false);
    this.router.navigateByUrl('/logout');
  }
}
