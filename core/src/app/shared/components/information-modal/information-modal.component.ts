import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss']
})
export class InformationModalComponent {
  @Input() public message: string;
  @Input() public title: string;

  @ViewChild('informationModal') informationModal: TemplateRef<ModalRef>;

  public isActive = false;
  public redirectUrl: string;

  public constructor(
    private router: Router,
    private modalService: ModalService
  ) {}

  public show(title?: string, message?: string, redirectUrl?: string) {
    if (title) {
      this.title = title;
    }
    if (message) {
      this.message = message;
    }
    if (redirectUrl) {
      this.redirectUrl = redirectUrl;
    }
    this.isActive = true;

    this.modalService
      .open(this.informationModal)
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        event.stopPropagation();
      });
  }

  public cancel(event: Event) {
    this.modalService.dismissAll();
  }

  public hide() {
    this.isActive = false;
  }

  public redirect() {
    this.isActive = false;
    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl]);
    }
  }
}
