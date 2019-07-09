import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from 'app/generic-list';
import { AppConfig } from '../../../../app.config';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { GraphQLDataProvider } from '../graphql-data-provider';
import { DeploymentEntryRendererComponent } from './deployment-entry-renderer/deployment-entry-renderer.component';
import { DeploymentHeaderRendererComponent } from './deployment-header-renderer/deployment-header-renderer.component';
import { IEmptyListData } from 'shared/datamodel';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-deployments',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class DeploymentsComponent extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public title = 'Deployments';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title);
  public createNewElementText = 'Add Deployment';
  public resourceKind = 'Deployment';
  private currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);

    const query = `query Deployments($namespace: String!) {
      deployments(namespace: $namespace) {
        name
        boundServiceInstanceNames
        labels
        creationTimestamp
        status {
          replicas
          updatedReplicas
          readyReplicas
          availableReplicas
          conditions {
            status
            type
            lastTransitionTimestamp
            lastUpdateTimestamp
            message
            reason
          }
        }
        containers {
          name
          image
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

        this.entryRenderer = DeploymentEntryRendererComponent;
        this.headerRenderer = DeploymentHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
        this.reloadResults();
      }
    );
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl_apps}namespaces/${
      this.currentNamespaceId
    }/deployments/${entry.name}`;
  }
}
