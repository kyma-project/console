import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ApplicationsService } from '../services/applications.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ModalRef, ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-create-application-modal',
  templateUrl: './create-application-modal.component.html',
  styleUrls: ['./create-application-modal.component.scss']
})
export class CreateApplicationModalComponent {
  @ViewChild('createApplicationModal')
  createApplicationModal: TemplateRef<ModalRef>;
  public isActive = false;
  public name: string;
  public wrongApplicationName: boolean;
  public wrongLabels: boolean;
  public description: string;
  public labels: string[];
  public error: string;

  public constructor(
    private applicationsService: ApplicationsService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  public show(): void {
    this.resetForm();
    this.isActive = true;
    this.modalService
      .open(this.createApplicationModal, { width: '30em' })
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
      });
  }

  public close(): void {
    this.isActive = false;
    this.modalService.dismissAll();
  }

  private resetForm(): void {
    this.name = '';
    this.description = '';
    this.labels = [];
    this.error = '';
    this.wrongApplicationName = false;
    this.wrongLabels = false;
  }

  public validateApplicationNameRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    this.wrongApplicationName =
      this.name &&
      (!Boolean(regex.test(this.name || '')) || this.name.length > 253);
  }

  public isReadyToCreate(): boolean {
    return Boolean(
      this.name &&
        !this.wrongApplicationName &&
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

    this.applicationsService.createApplication(data).subscribe(
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
