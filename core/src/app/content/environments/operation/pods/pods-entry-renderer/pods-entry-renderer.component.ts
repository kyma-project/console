import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Pod } from '../../../../../shared/datamodel/k8s/pod';
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
  public objectKeys = Object.keys;
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

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getRestartCount(containerStatuses) {
    return containerStatuses.reduce(
      (prev, curr) => prev + curr.restartCount,
      0
    );
  }

  getStatusesList(entry) {
    const containerStatuses = [];
    if (entry.status && entry.status.containerStatuses) {
      entry.status.containerStatuses.forEach(status => {
        for (const key in status.state) {
          if (status.state[key].reason) {
            containerStatuses.push(
              this.capitalize(key) + ': ' + status.state[key].reason
            );
          } else if (status.state[key].signal) {
            containerStatuses.push(
              this.capitalize(key) +
                ' (Signal: ' +
                status.state[key].signal +
                ')'
            );
          } else if (status.state[key].exitCode) {
            containerStatuses.push(
              this.capitalize(key) +
                ' (Exit code: ' +
                status.state[key].exitCode +
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
    return entry.status.phase === 'Pending';
  }

  isSucceeded(entry) {
    return (
      entry.status.phase === 'Succeeded' || entry.status.phase === 'Running'
    );
  }

  getStatus(entry) {
    const statuses = this.getStatusesList(entry);
    for (status of statuses) {
      if (status !== 'Running') {
        return status;
      }
    }
    return entry.status.phase;
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

  hasErrors(entry) {
    return entry.status.containerStatuses.some(
      status => status.state[Object.keys(status.state)[0]] === 'running'
    );
  }
}
