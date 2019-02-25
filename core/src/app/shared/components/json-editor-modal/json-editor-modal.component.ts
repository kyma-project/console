import { Component, Input, ViewChild } from '@angular/core';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { K8sResourceEditorService } from './services/k8s-resource-editor.service';

@Component({
  selector: 'app-json-editor-modal',
  templateUrl: './json-editor-modal.component.html',
  styleUrls: ['./json-editor-modal.component.scss']
})
export class JsonEditorModalComponent {
  @Input() resourceData: any;
  @ViewChild('jsoneditor') jsonEditor: JsonEditorComponent;
  public isActive = false;
  public error: any;

  constructor(
    protected communicationService: ComponentCommunicationService,
    private k8sResourceEditorService: K8sResourceEditorService
  ) {}

  show() {
    this.isActive = true;
  }

  cancel(event: Event) {
    this.isActive = false;
    this.error = false;
    event.stopPropagation();
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
