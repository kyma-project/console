import {
  Component,
  Input,
  ViewChild,
  HostListener,
  TemplateRef,
} from '@angular/core';
import { Clipboard } from 'ts-clipboard';

import * as luigiClient from '@kyma-project/luigi-client';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-fetch-token-modal',
  styleUrls: ['./fetch-token-modal.component.scss'],
  templateUrl: './fetch-token-modal.component.html',
})
export class FetchTokenModalComponent {
  @Input() useLuigiBackdrop = true;
  @ViewChild('fetchTokenModal') fetchTokenModal: TemplateRef<ModalRef>;

  public title: string;
  public token: string;
  public isTokenCopied = false;
  private isActive = false;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.cancel(event);
  }

  constructor(private modalService: ModalService) {}

  public show() {
    this.title = 'Fetch token';

    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.token = `Bearer ${eventData.idToken}`;
    });

    if (this.useLuigiBackdrop !== false) {
      luigiClient.uxManager().addBackdrop();
    }

    this.isActive = true;

    this.modalService
      .open(this.fetchTokenModal, { height: '25em' })
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        this.isTokenCopied = false;
        event.stopPropagation();
        if (this.useLuigiBackdrop !== false) {
          luigiClient.uxManager().removeBackdrop();
        }
      });
  }

  public cancel(event: Event) {
    if (this.isActive) {
      event.preventDefault();
    }
  }

  public copyToken() {
    Clipboard.copy(this.token);
    this.isTokenCopied = true;
    this.removeSuccessClass();
  }

  public removeSuccessClass() {
    setTimeout(_ => {
      this.isTokenCopied = false;
    }, 2500);
  }
}
