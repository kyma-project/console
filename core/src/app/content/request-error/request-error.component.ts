import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './request-error.component.html',
  styleUrls: ['./request-error.component.scss']
})
export class RequestErrorComponent implements OnInit {
  public sourcePath: string;
  public data: HttpErrorResponse;

  constructor(private router: Router) {}

  ngOnInit() {
    const requestError = sessionStorage.getItem('requestError');
    if (requestError) {
      const re = JSON.parse(requestError);
      this.sourcePath = re.sourcePath;
      this.data = re.data;
      sessionStorage.removeItem('requestError');
    } else {
      this.goTo();
    }
  }

  goTo(path?: string) {
    this.router.navigateByUrl(path || '/');
  }
}
