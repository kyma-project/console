import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { UploaderComponent } from '../uploader/uploader.component';

@Component({
  selector: 'app-resource-uploader-component',
  templateUrl: './resource-uploader.component.html',
  styleUrls: ['./resource-uploader.component.scss']
})
export class ResourceUploaderComponent {
  constructor() {}

  @ViewChild('uploader', { static: false }) uploader: UploaderComponent;
  @Output() cancelChanges = new EventEmitter<boolean>();
  @Output() createResource = new EventEmitter<boolean>();

  cancel() {
    this.cancelChanges.emit(true);
  }

  createNewElement() {
    this.createResource.emit(true);
  }
}
