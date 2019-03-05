import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import { LuigiClientService } from 'shared/services/luigi-client.service';

@Component({
  selector: 'app-deployment-entry-renderer',
  templateUrl: './deployment-entry-renderer.component.html',
  styleUrls: ['./deployment-entry-renderer.component.scss']
})
export class DeploymentEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  public currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public isSystemNamespace: boolean;

  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private luigiClientService: LuigiClientService
  ) {
    super(injector);

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
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
    this.showBoundServices = this.luigiClientService.hasBackendModule(
      'servicecatalogaddons'
    );
    this.isSystemNamespace = LuigiClient.getEventData().isSystemNamespace;
  }

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
    this.currentEnvironmentSubscription.unsubscribe();
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
        this.currentEnvironmentId
      }/cmf-instances/details/${serviceInstanceId}`
    );
  }
}
