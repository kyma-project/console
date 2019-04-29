import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import * as LuigiClient from '@kyma-project/luigi-client';

import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import { LuigiClientService } from 'shared/services/luigi-client.service';
import { EMPTY_TEXT } from 'shared/constants/constants';

@Component({
  selector: 'app-deployment-entry-renderer',
  templateUrl: './deployment-entry-renderer.component.html',
  styleUrls: ['./deployment-entry-renderer.component.scss']
})
export class DeploymentEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  public currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public isSystemNamespace: boolean;
  public emptyText = EMPTY_TEXT;

  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService,
    private currentNamespaceService: CurrentNamespaceService,
    private luigiClientService: LuigiClientService
  ) {
    super(injector);

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
      });
  }
  public disabled = false;
  public showBoundServices: boolean;
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
    this.showBoundServices =
      this.luigiClientService.hasBackendModule('servicecatalogaddons') &&
      !LuigiClient.getEventData().isSystemNamespace;
  }

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
  }

  isStatusOk(entry): boolean {
    return entry.status.readyReplicas === entry.status.replicas;
  }

  getStatus(entry) {
    return this.isStatusOk(entry) ? 'running' : 'error';
  }

  getStatusType(entry) {
    return this.isStatusOk(entry) ? 'ok' : 'error';
  }

  goToServiceInstanceDetails(serviceInstanceId: string) {
    LuigiClient.linkManager().navigate(
      `/home/namespaces/${
        this.currentNamespaceId
      }/cmf-instances/details/${serviceInstanceId}`
    );
  }
}
