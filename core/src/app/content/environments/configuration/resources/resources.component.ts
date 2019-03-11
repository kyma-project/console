import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceUploaderModalComponent } from '../../../../shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  @ViewChild('uploaderModal')
  private uploaderModal: ResourceUploaderModalComponent;

  constructor() {}

  ngOnInit() {}

  openUploadResourceModal() {
    this.uploaderModal.show();
  }
}
