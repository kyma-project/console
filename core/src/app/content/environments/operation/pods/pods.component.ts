import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
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
  title = 'Pods';
  emptyListText =
    'It looks like you don’t have any pods in your namespace yet.';
  resourceKind = 'Pod';

  entryRenderer = PodsEntryRendererComponent;
  headerRenderer = PodsHeaderRendererComponent;

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
    return `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        nodeName
        namespace
        restartCount
        creationTimestamp
        labels
        status
        containerStates {
          state
          reason
          message
        }
        json
      }
    }`;
  }
  
}
