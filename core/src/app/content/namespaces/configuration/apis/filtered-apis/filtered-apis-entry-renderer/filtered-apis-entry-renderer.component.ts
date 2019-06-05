import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { CurrentNamespaceService } from '../../../../services/current-namespace.service';
import { AbstractKubernetesEntryRendererComponent } from '../../../../operation/abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../../../app.config';
import LuigiClient from '@kyma-project/luigi-client';
import { EMPTY_TEXT } from 'shared/constants/constants';
import { GenericHelpersService } from '../../../../../../shared/services/generic-helpers.service';

@Component({
  selector: 'app-filtered-apis-entry-renderer',
  templateUrl: './filtered-apis-entry-renderer.component.html',
  providers: [GenericHelpersService]
})
export class FilteredApisEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnDestroy, OnInit {
  public currentNamespaceId: string;
  public emptyText = EMPTY_TEXT;
  private currentNamespaceSubscription: Subscription;
  public getHostnameURL = this.genericHelpers.getHostnameURL;

  constructor(
    protected injector: Injector,
    private currentNamespaceService: CurrentNamespaceService,
    private componentCommunicationService: ComponentCommunicationService,
    private genericHelpers: GenericHelpersService
  ) {
    super(injector);
    this.actions = [
      {
        function: 'delete',
        name: 'Delete'
      }
    ];

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
      });
  }
  public disabled = false;
  private communicationServiceSubscription: Subscription;

  ngOnInit() {
    this.communicationServiceSubscription = this.componentCommunicationService.observable$.subscribe(
      e => {
        const event: any = e;
        if ('disable' === event.type && this.entry.name === event.entry.name) {
          this.disabled = event.entry.disabled;
        }
      }
    );
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    this.communicationServiceSubscription.unsubscribe();
  }

  public isSecured(entry) {
    return (
      Array.isArray(entry.authenticationPolicies) &&
      entry.authenticationPolicies.length > 0
    );
  }

  public getIDP(entry) {
    return entry.authenticationPolicies[0].issuer === AppConfig.authIssuer &&
      AppConfig.authIssuer.toLowerCase().includes('dex')
      ? 'DEX'
      : 'Other';
  }

  public navigateToDetails(serviceName, apiName) {
    LuigiClient.linkManager()
      .fromContext('services')
      .navigate(`details/${serviceName}/apis/details/${apiName}`);
  }
}
