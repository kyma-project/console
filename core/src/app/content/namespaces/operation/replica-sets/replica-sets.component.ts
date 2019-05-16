import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './replica-sets-header-renderer/replica-sets-header-renderer.component';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { IEmptyListData } from 'shared/datamodel';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-replica-sets',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ReplicaSetsComponent extends AbstractGraphqlElementListComponent
  implements OnInit, OnDestroy {
  title = 'Replica Sets';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title)
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

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  getGraphqlQueryForList() {
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
