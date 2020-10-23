import { Component, ViewChild, TemplateRef } from '@angular/core';
import { UploaderComponent } from '../uploader/uploader.component';
import { InformationModalComponent } from '../../information-modal/information-modal.component';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { ModalService, ModalRef } from 'fundamental-ngx';

@Component({
  selector: 'app-resource-uploader-modal',
  templateUrl: './resource-uploader-modal.component.html'
})
export class ResourceUploaderModalComponent {
  public isActive = false;
  private okPromise: any;

  @ViewChild('uploader', { static: false }) uploader: UploaderComponent;
  @ViewChild('infoModal', { static: false }) infoModal: InformationModalComponent;
  @ViewChild('resourceUploader', { static: false }) resourceUploader: TemplateRef<ModalRef>;

  constructor(
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  show(): Promise<boolean> {
    this.isActive = true;
    this.modalService
      .open(this.resourceUploader, { width: '30em' })
      .afterClosed.toPromise()
      .finally(() => this.handleModalClose());
    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
    });
  }

  public handleModalClose() {
    this.isActive = false;
    this.uploader.reset();
    this.modalService.dismissAll();
  }
  cancel(event: Event) {
    this.isActive = false;
    event.stopPropagation();
  }

  upload(event: Event) {
    if (!this.uploader.upload()) {
      // nothing is selected = nothing can be uploaded
      return;
    }
    this.uploader.upload().subscribe(
      () => {
        this.communicationService.sendEvent({ type: 'createResource' });
        this.handleModalClose();

        this.infoModal.show(
          'Created',
          'New element has been created successfully'
        );
        event.stopPropagation();
        this.okPromise(true);
        setTimeout(() => {
          this.infoModal.hide();
        }, 3000);
      },
      (error: string) => {
        this.handleModalClose();

        this.infoModal.show('Error', `Cannot create a k8s resource due: ${error}`);
        this.okPromise(true);
        console.error(error);
      }
    );
  }
}
