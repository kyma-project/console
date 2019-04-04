import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../../operation/abstract-kubernetes-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import { EMPTY_TEXT } from 'shared/constants/constants';

@Component({
  selector: 'app-limit-range-entry-renderer',
  templateUrl: './limit-range-entry-renderer.component.html'
})
export class LimitRangeEntryRendererComponent
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
  public containerLimits;
  public emptyText = EMPTY_TEXT;

  ngOnInit() {
    this.communicationServiceSubscription = this.componentCommunicationService.observable$.subscribe(
      e => {
        const event: any = e;
        if ('disable' === event.type && this.entry.name === event.entry.name) {
          this.disabled = event.entry.disabled;
        }
      }
    );
    this.findContainerLimits();
  }

  ngOnDestroy() {
    this.communicationServiceSubscription.unsubscribe();
  }

  findContainerLimits() {
    this.entry.limits.forEach(limit => {
      if (limit.limitType === 'Container') {
        this.containerLimits = limit;
      }
    });
  }

  listMaxMemoryLimits() {
    return this.entry.limits
      .map(limit => `${limit.max.memory} (${limit.limitType})`)
      .join(', ');
  }
}
