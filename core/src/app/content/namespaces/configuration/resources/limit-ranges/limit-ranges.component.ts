import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from 'app/generic-list';
import { GraphQLDataProvider } from '../../../operation/graphql-data-provider';
import { AbstractKubernetesElementListComponent } from '../../../operation/abstract-kubernetes-element-list.component';
import { CurrentEnvironmentService } from '../../../services/current-namespace.service';
import { GraphQLClientService } from '../../../../../shared/services/graphql-client-service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../../app.config';
import { LimitRangeHeaderRendererComponent } from './limit-range-header-renderer/limit-range-header-renderer.component';
import { LimitRangeEntryRendererComponent } from './limit-range-entry-renderer/limit-range-entry-renderer.component';

@Component({
  selector: 'app-limit-ranges',
  templateUrl: 'limit-ranges.component.html'
})
export class LimitRangesComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Limit Ranges';
  public emptyListText =
    'It looks like you don’t have any limit ranges in your namespace yet.';
  public createNewElementText = 'Add Limit Range';
  public resourceKind = 'Limit Range';
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

    const query = `query LimitRanges($namespace: String!) {
      limitRanges(namespace: $namespace) {
        name
        limits {
          limitType
          max {
            memory
            cpu
          }
          default {
            memory
            cpu
          }
          defaultRequest {
            memory
            cpu
          }
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
            namespace: this.currentEnvironmentId
          },
          this.graphQLClientService
        );

        this.entryRenderer = LimitRangeEntryRendererComponent;
        this.headerRenderer = LimitRangeHeaderRendererComponent;
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
    }/limitranges/${entry.name}`;
  }
}
