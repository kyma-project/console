import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class PodsComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy {
  public title = 'Pods';
  public emptyListText =
    'It looks like you don’t have any pods in your namespace yet.';
  public resourceKind = 'Pod';

  public entryRenderer = PodsEntryRendererComponent;
  public headerRenderer = PodsHeaderRendererComponent;

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
    return `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        nodeName
        restartCount
        creationTimestamp
        labels
        status
        containerStates {
          state
          reason
          message
        }
      }
    }`;
  }
  
}
