import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-copy2clipboard-modal',
  styleUrls: ['./copy2clipboard-modal.component.scss'],
  templateUrl: './copy2clipboard-modal.component.html'
})
export class Copy2ClipboardModalComponent {
  @ViewChild('copyToClipboardModal')
  copyToClipboardModal: TemplateRef<ModalRef>;

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

    this.modalService
      .open(this.copyToClipboardModal)
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        this.isCopied = false;
        event.stopPropagation();
      });
  }

  public cancel(event: Event) {
    this.modalService.dismissAll();
  }

  public removeSuccessClass() {
    setTimeout(_ => {
      this.isCopied = false;
    }, 2500);
  }
}
