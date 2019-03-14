import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './replica-sets-header-renderer/replica-sets-header-renderer.component';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';

@Component({
  selector: 'app-replica-sets',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ReplicaSetsComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy {
  title = 'Replica Sets';
  emptyListText =
    'It looks like you don’t have any replica sets in your namespace yet.';
  createNewElementText = 'Add Replica Set';
  resourceKind = 'ReplicaSet';

  entryRenderer = ReplicaSetsEntryRendererComponent;
  headerRenderer = ReplicaSetsHeaderRendererComponent;

  constructor(
    currentNamespaceService: CurrentNamespaceService,
    commService: ComponentCommunicationService,
    graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentNamespaceService,
      commService,
      graphQLClientService,
      changeDetector
    );
  }

  getGraphglQueryForList() {
    return `query ReplicaSets($namespace: String!) {
      replicaSets(namespace: $namespace) {
        name
        labels
        creationTimestamp
        images
        pods
      }
    }`;
  }
}
