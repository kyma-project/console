import { Component, ViewChild } from '@angular/core';
import { UploaderComponent } from '../uploader/uploader.component';
import { InformationModalComponent } from '../../information-modal/information-modal.component';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
@Component({
  selector: 'app-resource-uploader-modal',
  templateUrl: './resource-uploader-modal.component.html',
  styleUrls: ['./resource-uploader-modal.component.scss']
})
export class ResourceUploaderModalComponent {
  public isActive = false;
  private okPromise: any;

  @ViewChild('uploader') uploader: UploaderComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;

  constructor(private communicationService: ComponentCommunicationService) {}

  show(): Promise<boolean> {
    this.isActive = true;
    return new Promise((resolve, reject) => {
      this.okPromise = resolve;
    });
  }

  cancel(event: Event) {
    this.isActive = false;
    event.stopPropagation();
  }

  upload(event: Event) {
    this.uploader.upload().subscribe(
      () => {
        this.okPromise(true);
        this.isActive = false;
        this.communicationService.sendEvent({ type: 'createResource' });
        event.stopPropagation();
        this.infoModal.show(
          'Created',
          'New element has been created successfully'
        );
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
        this.infoModal.show('Error', `Cannot create a k8s resource due: ${er}`);
        this.okPromise(true);
        this.isActive = false;
        console.log(error);
      }
    );
  }
}
