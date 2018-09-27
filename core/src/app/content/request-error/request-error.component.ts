import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  templateUrl: './request-error.component.html',
  styleUrls: ['./request-error.component.scss']
})
export class RequestErrorComponent implements OnInit {
  public data: HttpErrorResponse;

  constructor(private router: Router) {}

  ngOnInit() {
    const requestError = sessionStorage.getItem('requestError');
    if (requestError) {
      const re = JSON.parse(requestError);
      this.data = re.data;
      sessionStorage.removeItem('requestError');
    } else {
      this.goToHome();
    }
  }

  goToHome() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }
}
