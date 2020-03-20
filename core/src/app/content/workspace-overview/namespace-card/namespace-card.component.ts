import { Component, Input, Injector, OnInit, OnDestroy } from '@angular/core';
import { Namespace } from '../../../shared/datamodel/k8s/namespace';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@luigi-project/client';

@Component({
  selector: 'namespace-card',
  templateUrl: './namespace-card.component.html'
})
export class NamespaceCardComponent implements OnInit, OnDestroy {
  @Input() entry: Namespace;

  entryEventHandler;

  actions = [
    {
      function: 'delete',
      name: 'Delete'
    }
  ];

  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    this.entry = this.injector.get<any>('entry' as any);
    this.entryEventHandler = this.injector.get<any>('entryEventHandler' as any);
  }
  public disabled = false;
  private communicationServiceSubscription: Subscription;
  public isSystemNamespace = false;

  ngOnInit() {
    LuigiClient.addInitListener(eventData => {
      const systemNamespaces = eventData && eventData.systemNamespaces ? eventData.systemNamespaces : [];
      this.isSystemNamespace = systemNamespaces.some((systemNamespace) => {
        return systemNamespace === this.entry.metadata.name;
      });
    })

    this.communicationServiceSubscription = this.componentCommunicationService.observable$.subscribe(
      e => {
        const event: any = e;
        if ('disable' === event.type && this.entry.spec === event.entry.spec) {
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

  public navigateToDetails(namespaceName) {
    LuigiClient.linkManager().navigate(`/home/namespaces/${namespaceName}/details`);
  }
}
