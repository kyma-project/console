import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { StatusLabelComponent } from '../../../../../shared/components/status-label/status-label.component';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-services-entry-renderer',
  templateUrl: './services-entry-renderer.component.html'
})
export class ServicesEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    super(injector);
  }
  public disabled = false;
  private communicationServiceSubscription: Subscription;

  ngOnInit() {
    this.actions = [
      {
        function: 'exposeApi',
        name: 'Expose API'
      },
      {
        function: 'details',
        name: 'Details'
      },
      ...this.actions
    ];
    this.communicationServiceSubscription = this.componentCommunicationService.observable$.subscribe(
      e => {
        const event: any = e;
        if (
          'disable' === event.type &&
          this.entry.objectMeta.name === event.entry.objectMeta.name
        ) {
          this.disabled = event.entry.disabled;
        }
      }
    );
  }

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
  }

  isStatusOk(entry) {
    if (
      entry.clusterIP === null ||
      (entry.type === 'LoadBalancer' && entry.externalEndpoints === null)
    ) {
      return false;
    }
    return true;
  }

  getStatus(entry) {
    if (this.isStatusOk(entry)) {
      return 'running';
    } else {
      return 'error';
    }
  }

  getStatusType(entry) {
    if (this.isStatusOk(entry)) {
      return 'ok';
    } else {
      return 'error';
    }
  }

  public navigateToDetails(serviceName) {
    LuigiClient.linkManager()
      .fromContext('services')
      .navigate(`details/${serviceName}`);
  }
}
