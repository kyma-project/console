import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import * as luigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() message: string;
  @Input() title: string;
  isActive = false;
  private okPromise: any;
  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {}

  show(title?: string, message?: string): Promise<boolean> {
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
    this.isActive = true;
    luigiClient.uxManager().addBackdrop();
    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
      this.changeDetector.detectChanges();
    });
  }

  close(event: Event) {
    this.isActive = false;
    luigiClient.uxManager().removeBackdrop();
    event.stopPropagation();
    this.changeDetector.detectChanges();
  }

  ok(event: Event) {
    this.okPromise(true);
    this.close(event);
  }
}
