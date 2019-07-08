import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @Input() message: string;
  @Input() title: string;

  @ViewChild('confirmationModal') confirmationModal: TemplateRef<ModalRef>;

  isActive = false;
  private okPromise: any;
  private cancelPromise: any;
  constructor(private modalService: ModalService) {}

  ngOnInit() {}

  show(title?: string, message?: string): Promise<boolean> {
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
    this.isActive = true;

    this.modalService
      .open(this.confirmationModal, {})
      .afterClosed.toPromise()
      .finally(() => {
        this.cancelPromise(false);
        this.isActive = false;
        event.stopPropagation();
      });

    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
      this.cancelPromise = reject;
    });
  }

  closeModal() {
    if (this.confirmationModal && this.modalService) {
      this.modalService.dismissAll();
    }
  }

  cancel(event?: Event) {
    this.closeModal();
  }

  ok(event: Event) {
    this.okPromise(true);
    this.isActive = false;
    event.stopPropagation();
    this.closeModal();
  }
}
