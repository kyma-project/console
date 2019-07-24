import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { NamespacesService } from '../services/namespaces.service';
import LuigiClient from '@kyma-project/luigi-client';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { ModalService, ModalRef } from 'fundamental-ngx';
import { NamespaceInfo } from '../namespace-info';
import { DEFAULT_MODAL_CONFIG } from '../../../shared/constants/constants';

@Component({
  selector: 'app-namespace-edit',
  templateUrl: './namespace-edit.component.html',
  styleUrls: ['./namespace-edit.component.scss']
})
export class NamespaceEditComponent {
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('editNamespaceModal') editNamespaceModal: TemplateRef<ModalRef>;

  // default values
  public isActive: boolean;
  public namespaceName: string;
  public labels: string[];
  public labelKeys: string[] = [];

  // input errors
  public err: string;
  public labelsError: boolean;

  constructor(
    private namespacesService: NamespacesService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {}

  public editNamespace() {
    this.namespacesService
      .editNamespace(this.namespaceName, this.labelsArrayToObject())
      .subscribe(
        () => {
          this.isActive = false;
          this.communicationService.sendEvent({ type: 'editLabel' });
          this.cancel();
        },
        err => {
          this.err = err;
        }
      );
  }

  public show(namespace: NamespaceInfo) {
    this.setDefaultValues(namespace);
    this.modalService
      .open(this.editNamespaceModal, {
        ...DEFAULT_MODAL_CONFIG,
        height: '20em',
        width: '30em'
      })
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        this.cancelEvent.emit();
      });
  }

  setLabels(labels: NamespaceInfo['labels']): string[] {
    if (labels === null || labels === undefined) {
      return [];
    }
    const labelKeys = Object.keys(labels);
    const formatedLabels: string[] = labelKeys.map(
      label => `${label}=${labels[label]}`
    );
    return formatedLabels;
  }

  public setDefaultValues(namespace: NamespaceInfo) {
    // default values
    this.isActive = true;
    this.namespaceName = namespace.getLabel();
    this.labels = this.setLabels(namespace.getLabels());

    // input errors
    this.err = undefined;
    this.labelsError = false;
  }

  public cancel() {
    if (this.modalService) {
      this.removeError();
      this.isActive = false;
      this.modalService.dismissAll();
    }
  }

  public namespaceCanBeEdited(): boolean {
    const hasErrors = this.err || this.labelsError;
    return this.namespaceName && !hasErrors;
  }

  public removeError() {
    this.err = undefined;
  }

  public navigateToDetails(namespaceName: string) {
    LuigiClient.linkManager().navigate(
      `/home/namespaces/${namespaceName}/details`
    );
  }

  public updateLabels({
    labels,
    wrongLabels
  }: {
    labels?: string[];
    wrongLabels?: boolean;
  }): void {
    this.labels = labels !== undefined ? labels : this.labels;
    this.labelsError =
      wrongLabels !== undefined ? wrongLabels : this.labelsError;
  }

  public labelsArrayToObject(): object {
    const labelsObject = {};
    if (this.labels && this.labels.length > 0) {
      this.labels.forEach(label => {
        const [key, value] = label.split('=');
        labelsObject[key] = value;
      });
    }
    return labelsObject;
  }
}
