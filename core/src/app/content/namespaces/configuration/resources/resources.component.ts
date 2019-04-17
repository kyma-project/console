import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResourceUploaderModalComponent } from '../../../../shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';
import { map } from 'rxjs/operators';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(routeData => {

      this.route.queryParamMap
        .pipe(map((params: Params) => params.params))
        .subscribe(paramsMap => {
          const activeTab = paramsMap.tab;

          switch (activeTab) {
            case 'resourceQuotas':
              this.limitRangesTabExpanded = false;
              this.resourceQuotasTabExpanded = true;
              break;
            default:
              this.limitRangesTabExpanded = true;
              this.resourceQuotasTabExpanded = false;
          }
        });
    });
  }

  ngOnInit() {}

  openUploadResourceModal() {
    this.uploaderModal.show();
  }

  public changeTab(tab) {
    switch (tab) {
      case 'limitRanges':
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { tab: 'limitRanges' }
        });
        break;
      case 'resourceQuotas':
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { tab: 'resourceQuotas' }
        });
        break;
    }
  }
}
