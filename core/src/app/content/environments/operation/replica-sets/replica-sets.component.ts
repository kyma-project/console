import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './replica-sets-header-renderer/replica-sets-header-renderer.component';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  selector: 'app-replica-sets',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ReplicaSetsComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy {
  title = 'Replica Sets';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title)
  createNewElementText = 'Add Replica Set';
  resourceKind = 'ReplicaSet';

  entryRenderer = ReplicaSetsEntryRendererComponent;
  headerRenderer = ReplicaSetsHeaderRendererComponent;

  constructor(
    currentEnvironmentService: CurrentEnvironmentService,
    commService: ComponentCommunicationService,
    graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentEnvironmentService,
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
