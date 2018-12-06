import { Component, Input } from '@angular/core';
import { Clipboard } from 'ts-clipboard';

import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-fetch-token-modal',
  styleUrls: ['./fetch-token-modal.component.scss'],
  templateUrl: './fetch-token-modal.component.html',
})
export class FetchTokenModalComponent {
  private title: string;
  public isActive = false;
  private token: string;
  private isTokenCopied: false;

  public show() {
    this.title = 'Fetch token';
    this.isActive = true;
    LuigiClient.uxManager().addBackdrop();

    LuigiClient.addInitListener(() => {
      const eventData = LuigiClient.getEventData();
      this.token = `Bearer ${eventData.idToken}`;
    });
  }

  public cancel(event: Event) {
    this.isActive = false;
    this.isTokenCopied = false;
    LuigiClient.uxManager().removeBackdrop();
    event.stopPropagation();
  }

  public copyToken() {
    Clipboard.copy(this.token);
  }

  public removeSuccessClass() {
    setTimeout(_ => {
      this.isTokenCopied = false;
    }, 2500);
  }
}
