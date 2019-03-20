import { ChangeDetectorRef, Component } from '@angular/core';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { ConfigMapsEntryRendererComponent } from './configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './configmaps-header-renderer/configmaps-header-renderer.component';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ConfigMapsComponent extends AbstractGraphqlElementListComponent {
  public title = 'Config Maps';
  public emptyListText =
    'It looks like you don’t have any config maps in your namespace yet.';
  public resourceKind = 'ConfigMap';

  public entryRenderer = ConfigMapsEntryRendererComponent;
  public headerRenderer = ConfigMapsHeaderRendererComponent;

  constructor(
    currentEnvironmentService: CurrentNamespaceService,
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
    return `query ConfigMaps($namespace: String!) {
      configMaps(namespace: $namespace) {
        name
        labels
        creationTimestamp
      }
    }`;
  }
}
