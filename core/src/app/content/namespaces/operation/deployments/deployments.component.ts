import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from 'app/generic-list';
import { AppConfig } from '../../../../app.config';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { GraphQLDataProvider } from '../graphql-data-provider';
import { DeploymentEntryRendererComponent } from './deployment-entry-renderer/deployment-entry-renderer.component';
import { DeploymentHeaderRendererComponent } from './deployment-header-renderer/deployment-header-renderer.component';

@Component({
  selector: 'app-deployments',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class DeploymentsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Deployments';
  public emptyListText =
    'It looks like you don’t have any deployments in your namespace yet.';
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
          AppConfig.graphqlApiUrl,
          query,
          {
            namespace: this.currentNamespaceId
          },
          this.graphQLClientService
        );

        this.entryRenderer = DeploymentEntryRendererComponent;
        this.headerRenderer = DeploymentHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
      }
    );
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl_extensions}namespaces/${
      this.currentNamespaceId
    }/deployments/${entry.name}`;
  }
}
