import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class AuthGuard implements CanActivateChild {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    requestedState: RouterStateSnapshot
  ) {
    const luigiAuth = JSON.parse(localStorage.getItem('luigi.auth'));
    sessionStorage.setItem('id_token', luigiAuth.idToken);
    sessionStorage.setItem('access_token', luigiAuth.accessToken);
    sessionStorage.setItem('expires_at', luigiAuth.accessTokenExpirationDate);

    if (!this.oauthService.hasValidIdToken()) {
      sessionStorage.setItem('consoleNavigationPath', requestedState.url);
      this.router.navigate(['']);
      return false;
    }

    return true;
  }
}
