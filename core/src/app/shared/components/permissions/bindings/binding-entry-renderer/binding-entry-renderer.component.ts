import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../../../content/namespaces/operation/abstract-kubernetes-entry-renderer.component';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../../../services/component-communication.service';

@Component({
  templateUrl: './binding-entry-renderer.component.html'
})
export class BindingEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnInit, OnDestroy {
  public actions = [
    {
      function: 'delete',
      name: 'Delete'
    }
  ];

  public groupName: string;

  constructor(
    protected injector: Injector,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    super(injector);
    this.groupName = this.entry.metadata.name;
    if (
      this.entry.subjects &&
      this.entry.subjects.length > 0 &&
      (this.entry.subjects[0].kind === 'Group' || this.entry.subjects[0].kind === 'User')
    ) {
      this.groupName = this.entry.subjects[0].name;
    }
  }
  public disabled = false;
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
}
