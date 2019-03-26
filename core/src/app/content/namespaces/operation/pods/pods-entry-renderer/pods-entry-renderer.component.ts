import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';

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
    this.actions.push({
      function: 'showLogs',
      name: 'Show Logs'
    });
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
          this.entry.name === event.entry.name
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

  isPending(entry) {
    return entry.status === 'PENDING';
  }

  isSucceeded(entry) {
    return (
      entry.status === 'SUCCEEDED' || entry.status === 'RUNNING'
    );
  }

  getStatus(entry) {
    if (entry.status !== 'RUNNING' && entry.containerStates && entry.containerStates.length > 0) {
      const containerNotRunning = entry.containerStates.find((c) => c.state !== 'RUNNING');
      return `${containerNotRunning.state}: ${containerNotRunning.reason}`;
      
    }
    return entry.status;
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
    return entry.containerStates.some(
      s => s.state !== 'RUNNING' && s.message
    );
  }
}
