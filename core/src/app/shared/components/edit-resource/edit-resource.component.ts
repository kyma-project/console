import { Component, Input, HostBinding } from '@angular/core';
import { JsonEditorModalComponent } from '../json-editor-modal/json-editor-modal.component';

@Component({
  selector: 'app-edit-resource',
  templateUrl: './edit-resource.component.html',
  styleUrls: ['./edit-resource.component.scss'],
})
export class EditResourceComponent {
  @HostBinding('class') classes = 'json-editor';
  @Input() resourceData: any;
  constructor() { }

  showJsonEditorModal(jsonEditorModalComponent: JsonEditorModalComponent) {
    jsonEditorModalComponent.show();
  }
}
