import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
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
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-resource-quotas',
  templateUrl: 'resource-quotas.component.html'
})
export class ResourceQuotasComponent
  extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('Resource Quotas')
  public createNewElementText = 'Add Resource Quota';
  public resourceKind = 'Resource Quota';
  private currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  private namespaceRefreshSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
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
          query,
          {
            namespace: this.currentNamespaceId
          },
          this.graphQLClientService
        );

        this.entryRenderer = ResourceQuotaEntryRendererComponent;
        this.headerRenderer = ResourceQuotaHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
      }
    );
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();

    this.namespaceRefreshSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(_ => {
        this.reload();
      });
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    if (this.namespaceRefreshSubscription) {
      this.namespaceRefreshSubscription.unsubscribe();
    }
    super.ngOnDestroy();
 }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentNamespaceId
    }/resourcequotas/${entry.name}`;
  }
}
