import { LuigiClientService } from 'shared/services/luigi-client.service';
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { EMPTY_TEXT } from 'shared/constants/constants';

import * as luigiClient from '@luigi-project/client';

@Component({
  selector: 'app-pods-entry-renderer',
  templateUrl: './pods-entry-renderer.component.html'
})
export class PodsEntryRendererComponent
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
  public objectKeys = Object.keys;
  public emptyText = EMPTY_TEXT;
  private communicationServiceSubscription: Subscription;

  ngOnInit() {
    const lokiInstalled = this.luigiClientService.hasBackendModule(
      'logging-loki'
    );
    if (lokiInstalled) {
      {
        this.actions.push({
          function: 'showLogs',
          name: 'Show Logs'
        });
      }
    }

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
    if (this.communicationServiceSubscription) {
      this.communicationServiceSubscription.unsubscribe();
    }
  }

  getStatus(entry): [string, string?] {
    if (
      entry.status !== 'RUNNING' &&
      entry.containerStates &&
      entry.containerStates.length > 0
    ) {
      const containerNotRunning = entry.containerStates.find(
        c => c.state !== 'RUNNING'
      );
      return [containerNotRunning.state, containerNotRunning.reason];
    }
    return [entry.status];
  }

  hasErrors(entry) {
    return entry.containerStates.some(s => s.state !== 'RUNNING' && s.message);
  }
}
