import { Component, Input } from '@angular/core';
import { ClipboardModule } from 'ngx-clipboard';

@Component({
  selector: 'app-copy2clipboard-modal',
  styleUrls: ['./copy2clipboard-modal.component.scss'],
  templateUrl: './copy2clipboard-modal.component.html'
})
export class Copy2ClipboardModalComponent {
  private title: string;
  public isActive = false;
  private ngxClipboard: string;
  private content: string;
  private isCopied: false;
  private message: string;

  public show(title: string, content: string, message?: string) {
    this.title = title;
    this.isActive = true;
    this.content = content;
    this.message = message;
  }

  public cancel(event: Event) {
    this.isActive = false;
    this.isCopied = false;
    event.stopPropagation();
  }

  public removeSuccessClass() {
    setTimeout(_ => {
      this.isCopied = false;
    }, 2500);
  }
}
