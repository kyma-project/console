import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() message: string;
  @Input() title: string;
  isActive = false;
  private okPromise: any;
  private cancelPromise: any;
  constructor() {}

  ngOnInit() {}

  show(title?: string, message?: string): Promise<boolean> {
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
    this.isActive = true;
    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
      this.cancelPromise = reject;
    });
  }

  cancel(event: Event) {
    this.cancelPromise(false);
    this.isActive = false;
    event.stopPropagation();
  }

  ok(event: Event) {
    this.okPromise(true);
    this.isActive = false;
    event.stopPropagation();
  }
}
