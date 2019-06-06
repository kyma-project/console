import { ApiDefinitionHeaderRendererComponent } from './api-definition-header-renderer/api-definition-header-renderer.component';
import { ApiDefinitionEntryRendererComponent } from './api-definition-entry-renderer/api-definition-entry-renderer.component';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractGraphqlElementListComponent } from '../../operation/abstract-graphql-element-list.component';

import { ComponentCommunicationService } from 'shared/services/component-communication.service';

import LuigiClient from '@kyma-project/luigi-client';
import { IEmptyListData } from 'shared/datamodel';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';

@Component({
  selector: 'app-apis',
  templateUrl: 'apis.component.html'
})
export class ApisComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy {
  public resourceKind = 'API';
  public title = 'APIs';
  public baseUrl: string;
  public hideFilter = false;
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title);
  public entryRenderer = ApiDefinitionEntryRendererComponent;
  public headerRenderer = ApiDefinitionHeaderRendererComponent;

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

  getGraphqlQueryForList() {
    return `query Api($namespace: String!) {
      apis(namespace: $namespace) {
        name
        hostname
        service {
            name
            port
          }
        authenticationPolicies {
          type
        }
        creationTimestamp
      }
    }`;
  }

  getGraphqlSubscriptionsForList() {
    return `subscription Api($namespace: String!) {
      apiEvent(namespace: $namespace) {
        api {
          name
          hostname
          service {
              name
              port
            }
          authenticationPolicies {
            type
          }
          creationTimestamp
        }
      }
    }`;
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}/${entry.name}`;
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public navigateToDetails(entry) {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate(`details/${entry.name}`);
  }

  public navigateToCreate() {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate('create');
  }
}
