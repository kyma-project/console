import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  OAuthService,
  JwksValidationHandler,
  OAuthErrorEvent
} from 'angular-oauth2-oidc';

import { authConfig } from './auth.config';
import { LoginService } from './login.service';

@Component({
  template: ''
})
export class LoginComponent {
  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.configureAuthService();
  }

  private configureAuthService() {
    const oauthEvents = this.oauthService.events.subscribe(event => {
      if (event instanceof OAuthErrorEvent) {
        sessionStorage.setItem('loginError', JSON.stringify(event));
        oauthEvents.unsubscribe();
        this.router.navigate(['/loginError']);
      }
    });

    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService
      .loadDiscoveryDocument()
      .then(() => {
        this.loginService.login();
      })
      .catch(err => {
        const error =
          err === 'issuer must use Https. Also check property requireHttps.'
            ? "Auth issuer doesn't use TLS"
            : err;
        sessionStorage.setItem('loginError', JSON.stringify(error));
        this.router.navigate(['/loginError']);
      });
  }
}
