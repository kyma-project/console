import { Component, Injector, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import LuigiClient from '@kyma-project/luigi-client';
import { EMPTY_TEXT } from 'shared/constants/constants';

@Component({
  selector: 'app-secrets-entry-renderer',
  templateUrl: './secrets-entry-renderer.component.html'
})
export class SecretsEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    super(injector);
  }
  public disabled = false;
  public emptyText = EMPTY_TEXT;
  private communicationServiceSubscription: Subscription;

  ngOnInit() {
    this.actions = [
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
          this.entry.metadata.name === event.entry.metadata.name
        ) {
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

  public navigateToDetails(secretName) {
    LuigiClient.linkManager()
      .fromContext('secrets')
      .navigate(`details/${secretName}`);
  }
}
