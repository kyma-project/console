import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from 'app/generic-list';
import { GraphQLDataProvider } from '../../../operation/graphql-data-provider';
import { AbstractKubernetesElementListComponent } from '../../../operation/abstract-kubernetes-element-list.component';
import { CurrentNamespaceService } from '../../../services/current-namespace.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../../app.config';
import { ResourceQuotaHeaderRendererComponent } from './resource-quota-header-renderer/resource-quota-header-renderer.component';
import { ResourceQuotaEntryRendererComponent } from './resource-quota-entry-renderer/resource-quota-entry-renderer.component';
import { IEmptyListData } from 'shared/datamodel';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-resource-quotas',
  templateUrl: 'resource-quotas.component.html'
})
export class ResourceQuotasComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('Resource Quotas')
  public createNewElementText = 'Add Resource Quota';
  public resourceKind = 'Resource Quota';
  private currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    private apollo: Apollo,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);

    const query = `query ResourceQuota($namespace: String!) {
      resourceQuotas(namespace: $namespace) {
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

    this.currentNamespaceSubscription = this.getCurrentNamespaceId().subscribe(
      namespaceId => {
        this.currentNamespaceId = namespaceId;
        this.source = new GraphQLDataProvider(
          AppConfig.graphqlApiUrl,
          query,
          {
            namespace: this.currentNamespaceId
          },
          this.apollo
        );

        this.entryRenderer = ResourceQuotaEntryRendererComponent;
        this.headerRenderer = ResourceQuotaHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
      }
    );
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentNamespaceId
    }/resourcequotas/${entry.name}`;
  }
}
