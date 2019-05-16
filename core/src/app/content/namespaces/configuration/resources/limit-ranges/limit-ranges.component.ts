import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Filter } from 'app/generic-list';
import { GraphQLDataProvider } from '../../../operation/graphql-data-provider';
import { AbstractKubernetesElementListComponent } from '../../../operation/abstract-kubernetes-element-list.component';
import { CurrentNamespaceService } from '../../../services/current-namespace.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../../app.config';
import { LimitRangeHeaderRendererComponent } from './limit-range-header-renderer/limit-range-header-renderer.component';
import { LimitRangeEntryRendererComponent } from './limit-range-entry-renderer/limit-range-entry-renderer.component';
import { IEmptyListData } from 'shared/datamodel';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-limit-ranges',
  templateUrl: 'limit-ranges.component.html'
})
export class LimitRangesComponent extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('Limit Ranges')
  public createNewElementText = 'Add Limit Range';
  public resourceKind = 'Limit Range';
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

        this.entryRenderer = LimitRangeEntryRendererComponent;
        this.headerRenderer = LimitRangeHeaderRendererComponent;
        this.filterState = { filters: [new Filter('name', '', false)] };
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
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentNamespaceId
    }/limitranges/${entry.name}`;
  }
}
