import { FilteredApisHeaderRendererComponent } from './filtered-apis-header-renderer/filtered-apis-header-renderer.component';
import { FilteredApisEntryRendererComponent } from './filtered-apis-entry-renderer/filtered-apis-entry-renderer.component';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';

import { ActivatedRoute } from '@angular/router';
import { IEmptyListData } from 'shared/datamodel';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { AbstractGraphqlElementListComponent } from '../../../operation/abstract-graphql-element-list.component';

@Component({
  selector: 'app-filtered-apis',
  templateUrl: 'filtered-apis.component.html'
})
export class FilteredApisComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy {
  public resourceKind = 'Api';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('APIs', {
    headerTitle: false,
    namespaceSuffix: false
  });
  public createNewElementText = 'Add API';
  public baseUrl: string;

  public hideFilter = false;
  private serviceName: string;

  public entryRenderer = FilteredApisEntryRendererComponent;
  public headerRenderer = FilteredApisHeaderRendererComponent;

  constructor(
    currentNamespaceService: CurrentNamespaceService,
    commService: ComponentCommunicationService,
    graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super(
      currentNamespaceService,
      commService,
      graphQLClientService,
      changeDetector
    );

    this.route.params.subscribe(
      params => {
        this.serviceName = params['name'];
      },
      err => {
        console.log(err);
      }
    );
  }
  getGraphqlQueryForList() {
    return `query Api($namespace: String!, $serviceName: String) {
      apis(namespace: $namespace, serviceName: $serviceName) {
        name
        hostname
        service {
            name
            port
          }
        authenticationPolicies {
          type
        }
      }
    }`;
  }

  getGraphqlSubscriptionsForList() {
    return `subscription Api($namespace: String!, $serviceName: String) {
      apiEvent(namespace: $namespace, serviceName: $serviceName) {
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
}
