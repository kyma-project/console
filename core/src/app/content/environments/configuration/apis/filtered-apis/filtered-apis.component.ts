import { FilteredApisHeaderRendererComponent } from './filtered-apis-header-renderer/filtered-apis-header-renderer.component';
import { FilteredApisEntryRendererComponent } from './filtered-apis-entry-renderer/filtered-apis-entry-renderer.component';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractKubernetesElementListComponent } from '../../../operation/abstract-kubernetes-element-list.component';
import { HttpClient } from '@angular/common/http';
import { CurrentEnvironmentService } from '../../../services/current-environment.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../../app.config';
import { Filter } from 'app/generic-list';
import { Subscription } from 'rxjs';
import { GraphQLClientService } from '../../../../../shared/services/graphql-client-service';
import { GraphQLDataProvider } from '../../../operation/graphql-data-provider';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filtered-apis',
  templateUrl: 'filtered-apis.component.html'
})
export class FilteredApisComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public resourceKind = 'api';
  public emptyListData = {
    body: {
      text: 'It looks like you don’t have any APIs for this service yet.'
    }
  };
  public createNewElementText = 'Add API';
  public baseUrl: string;
  public currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;
  private serviceName: string;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);

    const query = `query API($namespace: String!, $serviceName: String!) {
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
          jwksURI
        }
      }
    }`;

    this.route.params.subscribe(
      params => {
        this.serviceName = params['name'];
      },
      err => {
        console.log(err);
      }
    );

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        this.baseUrl = `${
          AppConfig.k8sApiServerUrl_apimanagement
        }namespaces/${envId}/apis`;

        this.source = new GraphQLDataProvider(
          `${AppConfig.graphqlApiUrl}`,
          query,
          {
            namespace: this.currentEnvironmentId,
            serviceName: this.serviceName
          },
          this.graphQLClientService
        );
        this.entryRenderer = FilteredApisEntryRendererComponent;
        this.headerRenderer = FilteredApisHeaderRendererComponent;

        this.filterState = {
          filters: [new Filter('name', '', false)]
        };
      });
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}/${entry.name}`;
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
