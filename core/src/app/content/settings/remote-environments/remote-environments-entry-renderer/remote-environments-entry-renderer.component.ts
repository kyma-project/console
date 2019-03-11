import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../environments/operation/abstract-kubernetes-entry-renderer.component';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-pods-entry-renderer',
  templateUrl: './remote-environments-entry-renderer.component.html'
})
export class RemoteEnvironmentsEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  constructor(
    protected injector: Injector,
    private remoteEnvironmentsService: RemoteEnvironmentsService,
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

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
  }

  public listConnectedEnvs(entry) {
    let result = '';
    if (entry.enabledInNamespaces) {
      result = entry.enabledInNamespaces.join(', ');
    }
    return result;
  }

  public determineClass(entry) {
    return this.remoteEnvironmentsService.determineClass(entry);
  }

  public navigateToDetails(renvName) {
    LuigiClient.linkManager().navigate(`details/${renvName}`);
  }

  getStatus(entry) {
    return entry.status;
  }

  getStatusType(entry) {
    if (this.getStatus(entry) === 'SERVING') {
      return 'ok';
    }
    return 'warning';
  }
}
