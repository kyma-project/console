import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from '@kyma-project/y-generic-list';
import LuigiClient from '@kyma-project/luigi-client';
import { AppConfig } from '../../../../app.config';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { GraphQLClientService } from '../../../../shared/services/graphql-client-service';
import { CurrentEnvironmentService } from '../../services/current-environment.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { GraphQLDataProvider } from '../graphql-data-provider';
import { DeploymentEntryRendererComponent } from './deployment-entry-renderer/deployment-entry-renderer.component';
import { DeploymentHeaderRendererComponent } from './deployment-header-renderer/deployment-header-renderer.component';

@Component({
  selector: 'app-deployments',
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class DeploymentsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Deployments';
  public emptyListText =
    'It looks like you don’t have any deployments in your namespace yet.';
  public createNewElementText = 'Add Deployment';
  public resourceKind = 'Deployment';
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

    const query = `query Deployments($environment: String!) {
      deployments(environment: $environment) {
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

        this.entryRenderer = DeploymentEntryRendererComponent;
        this.headerRenderer = DeploymentHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
      }
    );

    LuigiClient.addInitListener(context => {
      console.log(context);
    });
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl_extensions}namespaces/${
      this.currentEnvironmentId
    }/deployments/${entry.name}`;
  }
}
