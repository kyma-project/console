import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { ApplicationsService } from '../services/applications.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { NgForm } from '@angular/forms';
import { ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-edit-application-modal',
  templateUrl: './edit-application-modal.component.html',
  styleUrls: ['./edit-application-modal.component.scss']
})
export class EditApplicationModalComponent {
  @Input() public initialDescription: string;
  @Input() public initialLabels: string[];
  @Input() public name: string;

  @ViewChild('editApplicationsForm') editApplicationsForm: NgForm;
  @ViewChild('editApplicationModal') editApplicationModal: NgForm;

  public isActive = false;
  public wrongLabels: boolean;
  public updatedLabels: string[];
  public updatedDescription: string;
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
      .open(this.editApplicationModal)
      .result.finally(() => {
        this.isActive = false;
      });
  }

  public close(): void {
    this.modalService.close(this.editApplicationModal);
  }

  private resetForm(): void {
    this.updatedDescription = this.initialDescription;
    this.updatedLabels = this.initialLabels ? [...this.initialLabels] : [];
    this.wrongLabels = false;
    this.error = '';
  }

  public isReadyToSave(): boolean {
    return Boolean(
      this.editApplicationsForm &&
        this.editApplicationsForm.dirty &&
        this.updatedDescription &&
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
    this.updatedLabels = labels !== undefined ? labels : this.updatedLabels;
    this.wrongLabels =
      wrongLabels !== undefined ? wrongLabels : this.wrongLabels;
    // mark form as dirty when deleting an existing label
    this.editApplicationsForm.form.markAsDirty();
  }

  public save(): void {
    const data = {
      name: this.name,
      description: this.updatedDescription,
      labels: (this.updatedLabels || []).reduce((acc, label) => {
        return { ...acc, [label.split('=')[0]]: label.split('=')[1] };
      }, {})
    };

    this.applicationsService.updateApplication(data).subscribe(
      response => {
        this.close();
        this.communicationService.sendEvent({
          type: 'updateResource',
          data: response
        });
      },
      err => {
        this.error = `Error: ${err}`;
      }
    );
  }
}
