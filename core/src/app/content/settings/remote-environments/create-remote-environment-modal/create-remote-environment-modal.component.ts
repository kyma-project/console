import { Component } from '@angular/core';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { Observable } from 'rxjs';

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

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.labels = [];
  }

  public show(): void {
    this.resetForm();
    this.isActive = true;
  }

  public close(): void {
    this.isActive = false;
  }

  public isReadyToCreate(): boolean {
    return Boolean(this.name);
  }

  public updateLabelsData(labels: string[]): void {
    this.labels = labels;
  }

  public save(): void {
    const data = {
      name: this.name,
      description: this.description,
      labels: this.labels
    };

    this.remoteEnvironmentsService.createRemoteEnvironment(data).subscribe(
      response => {
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
}
