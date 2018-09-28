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
  public wrongRemoteEnvName = false;
  public wrongLabels = false;
  public description: string;
  public labels: string[];
  public error: string;

  public constructor(
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private communicationService: ComponentCommunicationService
  ) {}

  private resetForm(): void {
    this.name = '';
    this.wrongRemoteEnvName = false;
    this.wrongLabels = false;
    this.description = '';
    this.labels = [];
    this.error = '';
  }

  public show(): void {
    this.resetForm();
    this.isActive = true;
  }

  public close(): void {
    this.isActive = false;
  }

  public validateRemoteEnvNameRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    this.wrongRemoteEnvName =
      this.name && !Boolean(regex.test(this.name || ''));
  }

  public isReadyToCreate(): boolean {
    return Boolean(this.name && !this.wrongRemoteEnvName && !this.wrongLabels);
  }

  public updateLabelsData({
    labels,
    wrongLabels
  }: {
    labels?: string[];
    wrongLabels?: boolean;
  }): void {
    this.labels = labels !== undefined ? labels : this.labels;
    this.wrongLabels =
      wrongLabels !== undefined ? wrongLabels : this.wrongLabels;
  }

  public save(): void {
    const data = {
      name: this.name,
      description: this.description,
      labels: (this.labels || []).reduce((acc, label) => {
        return { ...acc, [label.split(':')[0]]: label.split(':')[1] };
      }, {})
    };

    this.remoteEnvironmentsService.createRemoteEnvironment(data).subscribe(
      response => {
        this.close();
        this.communicationService.sendEvent({
          type: 'createResource',
          data: response
        });
      },
      err => {
        this.error = `Error: ${err.message}`;
      }
    );
  }
}
