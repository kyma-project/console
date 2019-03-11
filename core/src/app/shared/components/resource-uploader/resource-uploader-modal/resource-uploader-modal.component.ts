import { Component, ViewChild } from '@angular/core';
import { UploaderComponent } from '../uploader/uploader.component';
import { InformationModalComponent } from '../../information-modal/information-modal.component';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { ModalComponent, ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-resource-uploader-modal',
  templateUrl: './resource-uploader-modal.component.html'
})
export class ResourceUploaderModalComponent {
  public isActive = false;
  private okPromise: any;

  @ViewChild('uploader') uploader: UploaderComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;
  @ViewChild('resourceUploader') resourceUploader: ModalComponent;

  constructor(
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  show(): Promise<boolean> {
    this.isActive = true;
    this.modalService.open(this.resourceUploader).result.then(
      () => {},
      reason => {
        this.handleModalClose();
      },
      () => {
        this.handleModalClose();
      }
    );
    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
    });
  }

  private handleModalClose() {
    this.isActive = false;
    this.uploader.reset();
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
        this.modalService.close(this.resourceUploader);
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
      error => {
        let er = error;
        if (error.error) {
          er = error.error;
        }
        if (error.error.message) {
          er = error.error.message;
        }
        this.handleModalClose();
        this.modalService.close(this.resourceUploader);
        this.infoModal.show('Error', `Cannot create a k8s resource due: ${er}`);
        this.okPromise(true);
        console.error(error);
      }
    );
  }
}
