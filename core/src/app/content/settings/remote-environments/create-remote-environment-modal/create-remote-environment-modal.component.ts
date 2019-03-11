import { Component, ViewChild } from '@angular/core';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ModalComponent, ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-create-remote-environment-modal',
  templateUrl: './create-remote-environment-modal.component.html',
  styleUrls: ['./create-remote-environment-modal.component.scss']
})
export class CreateRemoteEnvironmentModalComponent {
  @ViewChild('createApplicationModal') createApplicationModal: ModalComponent;
  public isActive = false;
  public name: string;
  public wrongRemoteEnvName: boolean;
  public wrongLabels: boolean;
  public description: string;
  public labels: string[];
  public error: string;

  public constructor(
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  public show(): void {
    this.resetForm();
    this.isActive = true;
    this.modalService.open(this.createApplicationModal).result.finally(() => {
      this.isActive = false;
    });
  }

  public close(): void {
    this.isActive = false;
    this.modalService.close(this.createApplicationModal);
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.labels = [];
    this.error = '';
    this.wrongRemoteEnvName = false;
    this.wrongLabels = false;
  }

  public validateRemoteEnvNameRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    this.wrongRemoteEnvName =
      this.name &&
      (!Boolean(regex.test(this.name || '')) || this.name.length > 253);
  }

  public isReadyToCreate(): boolean {
    return Boolean(
      this.name &&
        this.description &&
        !this.wrongRemoteEnvName &&
        !this.wrongLabels
    );
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
        return { ...acc, [label.split('=')[0]]: label.split('=')[1] };
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
        this.error = `Error: ${err}`;
      }
    );
  }
}
