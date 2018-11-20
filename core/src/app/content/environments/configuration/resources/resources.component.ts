import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceUploaderModalComponent } from '../../../../shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  host: { class: 'sf-content' }
})
export class ResourcesComponent implements OnInit {
  limitsTabExpanded = true;
  quotasTabExpanded = false;
  @ViewChild('uploaderModal')
  private uploaderModal: ResourceUploaderModalComponent;

  constructor() {}

  ngOnInit() {}

  openUploadResourceModal() {
    this.uploaderModal.show();
  }

  changeTab = tab => {
    this.limitsTabExpanded = tab === 'limits';
    this.quotasTabExpanded = !this.limitsTabExpanded;
  };
}
