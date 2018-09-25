import { Component } from '@angular/core';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';

@Component({
  selector: 'app-create-remote-environment-modal',
  templateUrl: './create-remote-environment-modal.component.html',
  styleUrls: ['./create-remote-environment-modal.component.scss']
})
export class CreateRemoteEnvironmentModalComponent {
  public isActive = false;
  public name: string;
  public description: string;
  public labels: string[];
  public error: string;

  public constructor(
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private communicationService: ComponentCommunicationService
  ) {}

  public show() {
    this.resetForm();
    this.isActive = true;
  }

  private resetForm() {
    this.name = '';
    this.description = '';
    this.labels = [];
  }

  public close() {
    this.isActive = false;
  }

  public isReadyToCreate() {
    return this.name;
  }

  save() {
    const data = {
      name: this.name,
      description: this.description,
      labels: this.labels
    };

    return this.remoteEnvironmentsService
      .createRemoteEnvironment(data)
      .subscribe(
        res => {
          const response: any = res;

          this.close();
          this.communicationService.sendEvent({
            type: 'createResource',
            data: response.createRemoteEnvironment
          });
        },
        err => {
          this.error = `Error: ${err.message}`;
        }
      );
  }

  public updateLabelsData(labels) {
    this.labels = labels;
  }
}
