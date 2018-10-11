import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Pod } from '../../../../../shared/datamodel/k8s/pods';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { StatusLabelComponent } from '../../../../../shared/components/status-label/status-label.component';

@Component({
  selector: 'app-pods-entry-renderer',
  templateUrl: './pods-entry-renderer.component.html'
})
export class PodsEntryRendererComponent
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

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getStatusesList(entry) {
    const containerStatuses = [];
    if (entry.podStatus && entry.podStatus.containerStates) {
      entry.podStatus.containerStates.forEach(status => {
        for (const key in status) {
          if (status[key].reason) {
            containerStatuses.push(
              this.capitalize(key) + ': ' + status[key].reason
            );
          } else if (status[key].signal) {
            containerStatuses.push(
              this.capitalize(key) + ' (Signal: ' + status[key].signal + ')'
            );
          } else if (status[key].exitCode) {
            containerStatuses.push(
              this.capitalize(key) +
                ' (Exit code: ' +
                status[key].exitCode +
                ')'
            );
          } else {
            containerStatuses.push(this.capitalize(key));
          }
        }
      });
    }
    return containerStatuses;
  }

  isPending(entry) {
    return entry.podStatus.status === 'Pending';
  }
  isSucceeded(entry) {
    return (
      entry.podStatus.status === 'Succeeded' ||
      entry.podStatus.status === 'Running'
    );
  }

  getStatus(entry) {
    const statuses = this.getStatusesList(entry);
    for (status of statuses) {
      if (status !== 'Running') {
        return status;
      }
    }
    return entry.podStatus.podPhase;
  }

  getStatusType(entry) {
    if (this.isPending(entry)) {
      return 'warning';
    } else if (this.isSucceeded(entry)) {
      return 'ok';
    } else {
      return 'error';
    }
  }
}
