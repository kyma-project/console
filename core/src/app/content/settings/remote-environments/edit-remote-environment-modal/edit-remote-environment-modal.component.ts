import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-remote-environment-modal',
  templateUrl: './edit-remote-environment-modal.component.html',
  styleUrls: ['./edit-remote-environment-modal.component.scss']
})
export class EditRemoteEnvironmentModalComponent {
  @Input() public initialDescription: string;
  @Input() public initialLabels: string[];
  @Input() public name: string;

  @ViewChild('editRemoteEnvsForm') editRemoteEnvsForm: NgForm;

  public isActive = false;
  public wrongLabels: boolean;
  public updatedLabels: string[];
  public updatedDescription: string;
  public error: string;

  public constructor(
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private communicationService: ComponentCommunicationService
  ) {}

  public show(): void {
    this.resetForm();
    this.isActive = true;
  }

  public close(): void {
    this.isActive = false;
  }

  private resetForm(): void {
    this.updatedDescription = this.initialDescription;
    this.updatedLabels = this.initialLabels ? [...this.initialLabels] : [];
    this.wrongLabels = false;
    this.error = '';
  }

  public isReadyToSave(): boolean {
    return Boolean(
      this.editRemoteEnvsForm &&
        this.editRemoteEnvsForm.dirty &&
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
    this.editRemoteEnvsForm.form.markAsDirty();
  }

  public save(): void {
    const data = {
      name: this.name,
      description: this.updatedDescription,
      labels: (this.updatedLabels || []).reduce((acc, label) => {
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
        this.error = `Error: ${err}`;
      }
    );
  }
}
