import { FilteredApisHeaderRendererComponent } from './filtered-apis-header-renderer/filtered-apis-header-renderer.component';
import { FilteredApisEntryRendererComponent } from './filtered-apis-entry-renderer/filtered-apis-entry-renderer.component';
import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';

import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';

import { ActivatedRoute } from '@angular/router';
import { IEmptyListData } from 'shared/datamodel';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { AbstractGraphqlElementListComponent } from '../../../operation/abstract-graphql-element-list.component';
import { Observable } from 'apollo-link';

@Component({
  selector: 'app-filtered-apis',
  templateUrl: 'filtered-apis.component.html'
})
export class FilteredApisComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy, OnInit {
  public resourceKind = 'Api';
  public deleteMutationName = 'API';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('APIs', {
    headerTitle: false,
    namespaceSuffix: false
  });
  public createNewElementText = 'Add API';
  public baseUrl: string;

  public hideFilter = false;
  private serviceName?: string = null;
  public gqlVariables$ = new Observable(subscriber => {
    subscriber.complete();
  });

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
        this.gqlVariables$ = new Observable(subscriber => {
          subscriber.next({ serviceName: this.serviceName });
        });
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
          issuer
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
            issuer
          }
        }
        type
      }
    }`;
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}/${entry.name}`;
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }
  public ngOnInit() {
    super.ngOnInit();
  }
}
