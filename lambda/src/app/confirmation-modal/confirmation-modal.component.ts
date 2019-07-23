import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import * as luigiClient from '@kyma-project/luigi-client';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() message: string;
  @Input() title: string;

  @ViewChild('confirmationModal') confirmationModal: TemplateRef<ModalRef>;

  isActive = false;
  private okPromise: any;
  constructor(
    private changeDetector: ChangeDetectorRef,
    private modalService: ModalService,
  ) {}

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

    this.modalService
      .open(this.confirmationModal)
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        luigiClient.uxManager().removeBackdrop();
        event.stopPropagation();
        this.changeDetector.detectChanges();
      });

    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
      this.changeDetector.detectChanges();
    });
  }

  closeModal() {
    if (this.confirmationModal && this.modalService) {
      this.isActive = false;
      this.modalService.dismissAll();
    }
  }

  cancel(event?: Event) {
    this.closeModal();
  }

  ok(event: Event) {
    this.okPromise(true);
    this.isActive = false;
    luigiClient.uxManager().removeBackdrop();
    event.stopPropagation();
    this.closeModal();
  }
}
