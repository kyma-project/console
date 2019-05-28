import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { CurrentNamespaceService } from '../../../services/current-namespace.service';
import { AbstractKubernetesEntryRendererComponent } from '../../../operation/abstract-kubernetes-entry-renderer.component';
import * as _ from 'lodash';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';
import { API_PORT_DESCRIPTION } from '../../../../../shared/constants/constants';

@Component({
  selector: 'app-api-definition-entry-renderer',
  templateUrl: './api-definition-entry-renderer.component.html'
})
export class ApiDefinitionEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnDestroy, OnInit {
  public currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  readonly API_PORT_DESCRIPTION = API_PORT_DESCRIPTION;

  constructor(
    protected injector: Injector,
    private currentNamespaceService: CurrentNamespaceService,
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
        if (
          'disable' === event.type &&
          this.entry.metadata.name === event.entry.metadata.name
        ) {
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

  public isSecured = entry => {
    return (
      _.isArray(entry.spec.authentication) &&
      entry.spec.authentication.length > 0
    );
  };

  public navigateToDetails(apiName) {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate(`details/${apiName}`);
  }

  public getHostnameURL(hostname: string): string {
    return `https://${hostname}`;
  }
}
