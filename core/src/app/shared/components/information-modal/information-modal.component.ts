import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss']
})
export class InformationModalComponent {
  @Input() private message: string;
  @Input() private title: string;
  public isActive = false;
  public redirectUrl: string;

  constructor(private router: Router) {}

  public show(title?: string, message?: string, redirectUrl?: string) {
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
    if (redirectUrl) {
      this.redirectUrl = redirectUrl;
    }
    this.isActive = true;
    LuigiClient.uxManager().addBackdrop();
  }

  public cancel(event: Event) {
    this.isActive = false;
    LuigiClient.uxManager().removeBackdrop();
    event.stopPropagation();
  }

  public hide() {
    this.isActive = false;
    LuigiClient.uxManager().removeBackdrop();
  }

  private redirect() {
    LuigiClient.uxManager().removeBackdrop();
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    }
  }
}
