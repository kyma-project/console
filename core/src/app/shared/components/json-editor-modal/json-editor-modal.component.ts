import { Component, Input, ViewChild } from '@angular/core';
import { JsonEditorComponent } from './json-editor/json-editor.component';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import LuigiClient from '@kyma-project/luigi-client';

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

  constructor(private communicationService: ComponentCommunicationService) {}

  show() {
    this.isActive = true;
    LuigiClient.uxManager().addBackdrop();
  }

  cancel(event: Event) {
    this.isActive = false;
    LuigiClient.uxManager().removeBackdrop();
    this.error = false;
    event.stopPropagation();
  }

  update(event: Event) {
    this.jsonEditor.updateYaml().subscribe(
      data => {
        event.stopPropagation();
        this.isActive = false;
        LuigiClient.uxManager().removeBackdrop();
        this.communicationService.sendEvent({
          type: 'updateResource',
          data
        });
      },
      err => this.displayErrorMessage(err)
    );
  }

  displayErrorMessage(httpErrorResponse) {
    this.error = httpErrorResponse.error;
  }
}
