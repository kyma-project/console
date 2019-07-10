import { Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { ModalService, ModalRef } from 'fundamental-ngx';
import { cloneDeep } from 'lodash';

import { ComponentCommunicationService } from '../../services/component-communication.service';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { K8sResourceEditorService } from './services/k8s-resource-editor.service';
import { DEFAULT_MODAL_CONFIG } from 'shared/constants/constants';

@Component({
  selector: 'app-json-editor-modal',
  templateUrl: './json-editor-modal.component.html',
  styleUrls: ['./json-editor-modal.component.scss']
})
export class JsonEditorModalComponent {
  @Input() resourceData: any;
  @ViewChild('jsoneditor') jsonEditor: JsonEditorComponent;
  @ViewChild('jsonEditorModal') jsonEditorModal: TemplateRef<ModalRef>;

  public isActive = false;
  public error: any;
  public modalResourceData: any;

  constructor(
    private communicationService: ComponentCommunicationService,
    protected modalService: ModalService,
    private k8sResourceEditorService: K8sResourceEditorService
  ) {}

  show() {
    this.isActive = true;
    this.modalResourceData = cloneDeep(this.resourceData);

    this.modalService
      .open(this.jsonEditorModal, { ...DEFAULT_MODAL_CONFIG, width: '40em' })
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        this.error = false;
        this.modalResourceData = null;
        event.stopPropagation();
      });
  }

  cancel(event: Event) {
    this.isActive = false;
    this.modalService.dismissAll();
  }

  update(event: Event) {
    this.sendUpdateRequest().subscribe(
      data => {
        event.stopPropagation();
        this.isActive = false;
        this.communicationService.sendEvent({
          type: 'updateResource',
          data
        });
        this.cancel(event);
      },
      err => this.displayErrorMessage(err)
    );
  }

  sendUpdateRequest() {
    return this.k8sResourceEditorService.updateResource(
      this.jsonEditor.getCurrentValue()
    );
  }

  displayErrorMessage(httpErrorResponse) {
    this.error = httpErrorResponse.error;
  }
}
