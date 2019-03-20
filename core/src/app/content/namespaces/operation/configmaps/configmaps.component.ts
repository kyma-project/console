import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AppConfig } from '../../../../app.config';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ConfigMapsEntryRendererComponent } from './configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './configmaps-header-renderer/configmaps-header-renderer.component';
import { ConfigMap, IConfigMap } from 'shared/datamodel/k8s/configmap';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ConfigMapsComponent extends AbstractGraphqlElementListComponent implements OnDestroy {
  public title = 'Config Maps';
  public emptyListText =
    'It looks like you don’t have any config maps in your namespace yet.';
  public createNewElementText = 'Add Config Map';
  public resourceKind = 'ConfigMap';
  public hideFilter = false;

  public headerRenderer = ConfigMapsEntryRendererComponent;
  public entryRenderer = ConfigMapsHeaderRendererComponent;

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
        data
      }
    }`;
  }
}
