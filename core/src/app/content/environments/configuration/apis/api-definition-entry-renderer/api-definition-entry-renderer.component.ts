import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { CurrentEnvironmentService } from '../../../../environments/services/current-environment.service';
import { AbstractKubernetesEntryRendererComponent } from '../../../operation/abstract-kubernetes-entry-renderer.component';
import * as _ from 'lodash';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-api-definition-entry-renderer',
  templateUrl: './api-definition-entry-renderer.component.html'
})
export class ApiDefinitionEntryRendererComponent
  extends AbstractKubernetesEntryRendererComponent
  implements OnDestroy, OnInit {
  public currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;

  constructor(
    protected injector: Injector,
    private currentEnvironmentService: CurrentEnvironmentService,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    super(injector);
    this.actions = [
      {
        function: 'delete',
        name: 'Delete'
      }
    ];

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });
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

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
    this.communicationServiceSubscription.unsubscribe();
  }

  public isSecured = entry => {
    return (
      _.isArray(entry.spec.authentication) &&
      entry.spec.authentication.length > 0
    );
  };
}
