import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../operation/abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';
import { GenericHelpersService } from '../../../../../shared/services/generic-helpers.service';
import { AppConfig } from '../../../../../app.config';

@Component({
  selector: 'app-api-definition-entry-renderer',
  templateUrl: './api-definition-entry-renderer.component.html',
  providers: [GenericHelpersService]
})
export class ApiDefinitionEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnDestroy, OnInit {
  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService,
    private genericHelpers: GenericHelpersService
  ) {
    super(injector);
    this.actions = [
      {
        function: 'details',
        name: 'Details'
      },
      {
        function: 'delete',
        name: 'Delete'
      }
    ];
  }
  public disabled = false;
  public url: string = this.genericHelpers.getURL({host: this.entry.hostname});
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
    if (this.communicationServiceSubscription) {
      this.communicationServiceSubscription.unsubscribe();
    }
  }

  public isSecured = (entry: { authenticationPolicies?: object[] }): boolean =>
    !!(
      Array.isArray(entry.authenticationPolicies) &&
      entry.authenticationPolicies.length
    );

  public navigateToDetails(apiName: string) {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate(`details/${apiName}`);
  }
}
