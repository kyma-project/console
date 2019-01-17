import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import { StatusLabelComponent } from '../../../../../shared/components/status-label/status-label.component';
import { LuigiClientService } from '../../../../../shared/services/luigi-client.service';

@Component({
  selector: 'app-deployment-entry-renderer',
  templateUrl: './deployment-entry-renderer.component.html',
  styleUrls: ['./deployment-entry-renderer.component.scss']
})
export class DeploymentEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService,
    private luigiClientService: LuigiClientService
  ) {
    super(injector);
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
  }

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
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
}
