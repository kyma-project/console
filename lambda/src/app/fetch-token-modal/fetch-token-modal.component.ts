import { Component, Input } from '@angular/core';
import { Clipboard } from 'ts-clipboard';

import * as luigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-fetch-token-modal',
  styleUrls: ['../app.component.scss', './fetch-token-modal.component.scss'],
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
    let sessionId;

    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      sessionId = eventData.sessionId;
      this.token = `Bearer ${eventData.idToken}`;
    });
  }

  public cancel(event: Event) {
    this.isActive = false;
    this.isTokenCopied = false;
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
