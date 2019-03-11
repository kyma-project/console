import { Component, Input, ViewChild } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';
import { ModalService, ModalComponent } from 'fundamental-ngx';

@Component({
  selector: 'app-copy2clipboard-modal',
  styleUrls: ['./copy2clipboard-modal.component.scss'],
  templateUrl: './copy2clipboard-modal.component.html'
})
export class Copy2ClipboardModalComponent {
  @ViewChild('copyToClipboardModal') copyToClipboardModal: ModalComponent;

  public title: string;
  public isActive = false;
  public ngxClipboard: string;
  public content: string;
  public isCopied = false;
  public message: string;

  public constructor(public modalService: ModalService) {}

  public show(title: string, content: string, message?: string) {
    this.title = title;
    this.isActive = true;
    this.content = content;
    this.message = message;

    this.modalService.open(this.copyToClipboardModal).result.finally(() => {
      this.isActive = false;
      this.isCopied = false;
      event.stopPropagation();
    });
  }

  public cancel(event: Event) {
    this.modalService.close(this.copyToClipboardModal);
  }

  public removeSuccessClass() {
    setTimeout(_ => {
      this.isCopied = false;
    }, 2500);
  }
}
