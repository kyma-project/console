import { GraphqlMutatorModalComponent } from './../../../../shared/components/json-editor-modal/graphql-mutator-modal.component';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
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

  @ViewChild('mutateResourceModal')
  mutateResourceModal: GraphqlMutatorModalComponent;

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
    const query = `query ReplicaSet($name: String! $namespace: String!) {
      replicaSet(name: $name, namespace: $namespace) {
        json
      }
    }`;
    this.graphQLClientService
      .request(AppConfig.graphqlApiUrl, query, {
        name: entry.name,
        namespace: this.currentEnvironmentId
      })
      .subscribe(data => {
        this.mutateResourceModal.resourceData = data.replicaSet.json;
        this.mutateResourceModal.show();
      });
  }

  sendDeleteRequest(entry) {
    const name = entry.name;
    const namespace = this.currentEnvironmentId;
    const mutation = `mutation deleteReplicaSet($name: String!, $namespace: String!) {
      deleteReplicaSet(name: $name, namespace: $namespace) {
        name
      }
    }`;

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      mutation,
      { name, namespace }
    );
  }
}
