import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../../operation/abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../../../shared/services/component-communication.service';
// import { AppConfig } from '../../../../../../app.config';
import LuigiClient from '@luigi-project/client';
// import { EMPTY_TEXT } from 'shared/constants/constants';
import { GenericHelpersService } from '../../../../../../shared/services/generic-helpers.service';

const STATUS_OK = 'OK';

@Component({
  selector: 'app-filtered-apis-entry-renderer',
  templateUrl: './filtered-apis-entry-renderer.component.html',
  providers: [GenericHelpersService]
})
export class FilteredApisEntryRendererComponent extends AbstractKubernetesEntryRendererComponent {
  // public emptyText = EMPTY_TEXT;
  public disabled = false;
  public showStatusDescription = false;
  
  get showStatusTooltip() {
    return this.entry.status.apiRuleStatus.code !== STATUS_OK && this.showStatusDescription;
  }

  get statusBadgeType() {
    return this.entry.status.apiRuleStatus.code === STATUS_OK
      ? 'success'
      : 'error'
  }

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
    this.actions = [
      {
        function: 'delete',
        name: 'Delete'
      }
    ];
  }


  // public isSecured = (entry: { authenticationPolicies?: object[] }): boolean =>
  //   !!(
  //     Array.isArray(entry.authenticationPolicies) &&
  //     entry.authenticationPolicies.length
  //   );

  // public getIDP(entry) {
  //   return entry.authenticationPolicies[0].issuer === AppConfig.authIssuer &&
  //     AppConfig.authIssuer.toLowerCase().includes('dex')
  //     ? 'DEX'
  //     : 'Other';
  // }

  public navigateToDetails(apiName) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-apirules/details/${apiName}`);
  }
}
