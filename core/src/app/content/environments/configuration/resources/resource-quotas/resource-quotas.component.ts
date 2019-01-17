import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from '@kyma-project/y-generic-list';
import { GraphQLDataProvider } from '../../../operation/graphql-data-provider';
import { AbstractKubernetesElementListComponent } from '../../../operation/abstract-kubernetes-element-list.component';
import { CurrentEnvironmentService } from '../../../services/current-environment.service';
import { GraphQLClientService } from '../../../../../shared/services/graphql-client-service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../../app.config';
import { ResourceQuotaHeaderRendererComponent } from './resource-quota-header-renderer/resource-quota-header-renderer.component';
import { ResourceQuotaEntryRendererComponent } from './resource-quota-entry-renderer/resource-quota-entry-renderer.component';

@Component({
  selector: 'app-resource-quotas',
  templateUrl: 'resource-quotas.component.html'
})
export class ResourceQuotasComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Resource Quotas';
  public emptyListText =
    'It looks like you don’t have any resource quotas in your namespace yet.';
  public createNewElementText = 'Add Resource Quota';
  public resourceKind = 'Resource Quota';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);

    const query = `query ResourceQuota($environment: String!) {
      resourceQuotas(environment: $environment) {
        name
        pods
        limits {
          memory
          cpu
        }
        requests {
          memory
          cpu
        }
      }
    }`;

    this.currentEnvironmentSubscription = this.getCurrentEnvironmentId().subscribe(
      envId => {
        this.currentEnvironmentId = envId;
        this.source = new GraphQLDataProvider(
          AppConfig.graphqlApiUrl,
          query,
          {
            environment: this.currentEnvironmentId
          },
          this.graphQLClientService
        );

        this.entryRenderer = ResourceQuotaEntryRendererComponent;
        this.headerRenderer = ResourceQuotaHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
      }
    );
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentEnvironmentId
    }/resourcequotas/${entry.name}`;
  }
}
