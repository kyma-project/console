import { Component, OnInit, ViewChild } from '@angular/core';
import { ResourceUploaderModalComponent } from 'shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';
import { map } from 'rxjs/operators';

import * as luigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  @ViewChild('uploaderModal')
  private uploaderModal: ResourceUploaderModalComponent;
  public limitRangesTabExpanded: boolean;
  public resourceQuotasTabExpanded: boolean;

  constructor() {}

  ngOnInit() {
    const selectedTab = luigiClient.getNodeParams().selectedTab;
    this.displaySelectedTab(selectedTab);
  }

  openUploadResourceModal() {
    this.uploaderModal.show();
  }

  public displaySelectedTab(selectedTab) {
    switch (selectedTab) {
      case 'resourceQuotas':
        this.limitRangesTabExpanded = false;
        this.resourceQuotasTabExpanded = true;
        break;
      default:
        this.limitRangesTabExpanded = true;
        this.resourceQuotasTabExpanded = false;
    }
  }

  public changeTab(tab) {
    luigiClient
      .linkManager()
      .withParams({ selectedTab: tab })
      .navigate('');
    this.displaySelectedTab(tab);
  }
}
