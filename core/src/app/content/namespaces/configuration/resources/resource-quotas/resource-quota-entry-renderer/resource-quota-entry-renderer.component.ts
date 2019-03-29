import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../../operation/abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import { EMPTY_TEXT} from 'shared/constants/constants';

@Component({
  selector: 'app-resource-quota-entry-renderer',
  templateUrl: './resource-quota-entry-renderer.component.html'
})
export class ResourceQuotaEntryRendererComponent
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
}
