import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../operation/abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-api-definition-entry-renderer',
  templateUrl: './api-definition-entry-renderer.component.html'
})
export class ApiDefinitionEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnDestroy, OnInit {
  public currentNamespaceId: string;

  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService
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

  public isSecured = (entry): 'Yes' | 'No' => {
    return Array.isArray(entry.authenticationPolicies) &&
      entry.authenticationPolicies.length
      ? 'Yes'
      : 'No';
  };

  public navigateToDetails(apiName: String) {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate(`details/${apiName}`);
  }
}
