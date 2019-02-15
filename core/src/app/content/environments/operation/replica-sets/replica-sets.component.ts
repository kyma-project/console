import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
import { AppConfig } from '../../../../app.config';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './replica-sets-header-renderer/replica-sets-header-renderer.component';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { GraphQLDataProvider } from '../graphql-data-provider';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { Filter } from 'app/generic-list';

@Component({
  selector: 'app-replica-sets',
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class ReplicaSetsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  title = 'Replica Sets';
  emptyListText =
    'It looks like you don’t have any replica sets in your namespace yet.';
  createNewElementText = 'Add Replica Set';
  resourceKind = 'ReplicaSet';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  filterState = {
    filters: [new Filter('name', '', false)]
  };

  constructor(
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, null, commService);

    const query = `query ReplicaSets($namespace: String!) {
      replicaSets(namespace: $namespace) {
        name
        labels
        creationTimestamp
        images
        pods
        json
      }
    }`;

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        this.source = new GraphQLDataProvider(
          AppConfig.graphqlApiUrl,
          query,
          {
            namespace: this.currentEnvironmentId
          },
          this.graphQLClientService
        );
        this.entryRenderer = ReplicaSetsEntryRendererComponent;
        this.headerRenderer = ReplicaSetsHeaderRendererComponent;
      });
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  editEntryEventCallback(entry) {
    this.editResourceModal.resourceData = entry.json;
    this.editResourceModal.show();
  }
}
