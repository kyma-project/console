import { Component, Input } from '@angular/core';

import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';

@Component({
  selector: 'app-edit-remote-environment-modal',
  templateUrl: './edit-remote-environment-modal.component.html',
  styleUrls: ['./edit-remote-environment-modal.component.scss']
})
export class EditRemoteEnvironmentModalComponent {
  @Input() public description: string;
  @Input() public labels: string[];
  @Input() public name: string;

  public isActive = false;
  public wrongLabels: boolean;
  public error: string;

  public constructor(
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private communicationService: ComponentCommunicationService
  ) {
    this.labels = this.labels || [];
  }

  private resetForm(): void {
    this.wrongLabels = false;
    this.error = '';
  }

  public show(): void {
    this.resetForm();
    this.isActive = true;
  }

  public close(): void {
    this.isActive = false;
  }

  public isReadyToSave(): boolean {
    return Boolean(this.description && !this.wrongLabels);
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

    this.remoteEnvironmentsService.updateRemoteEnvironment(data).subscribe(
      response => {
        this.close();
        this.communicationService.sendEvent({
          type: 'updateResource',
          data: response
        });
      },
      err => {
        this.error = `Error: ${err.message}`;
      }
    );
  }
}
