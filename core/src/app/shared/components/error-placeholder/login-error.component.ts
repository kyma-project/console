import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent implements OnInit {
  constructor(private router: Router) {}

  private errorMsg = '';
  private possiblyMissingCert = false;

  ngOnInit() {
    const loginError = sessionStorage.getItem('loginError');
    if (!loginError) {
      this.router.navigate(['']);
    }
    else {
        const parsedError = JSON.parse(loginError);
        this.errorMsg = parsedError.type;
      if (window.location.protocol === 'http:' && parsedError.type === 'discovery_document_load_error' && parsedError.reason.status === 0) {
          this.possiblyMissingCert = true;
        }
    }
    sessionStorage.removeItem('loginError');
  }
}
