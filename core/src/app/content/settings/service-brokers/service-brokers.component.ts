import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { CurrentNamespaceService } from '../../namespaces/services/current-namespace.service';
import { ServiceBrokerEntryRendererComponent } from './services-entry-renderer/service-broker-entry-renderer.component';
import { ServiceBrokerHeaderRendererComponent } from './services-header-renderer/service-broker-header-renderer.component';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from 'namespaces/operation/abstract-graphql-element-list.component';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  templateUrl:
    '../../namespaces/operation/kubernetes-element-list.component.html'
})
export class ServiceBrokersComponent extends AbstractGraphqlElementListComponent implements OnInit, OnDestroy {
  public title = 'Service Brokers';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title, { headerTitle: true, namespaceSuffix: false });
  public createNewElementText = 'Add Service Broker';
  public resourceKind = 'ServiceBroker';
  public hideFilter = true;

  public entryRenderer = ServiceBrokerEntryRendererComponent;
  public headerRenderer = ServiceBrokerHeaderRendererComponent;

  constructor(
    currentNamespaceService: CurrentNamespaceService,
    commService: ComponentCommunicationService,
    graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentNamespaceService,
      commService,
      graphQLClientService,
      changeDetector
    );
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  getGraphqlQueryForList() {
    return `query clusterServiceBrokers {
      clusterServiceBrokers {
        name
        status {
          ready
          reason
          message
        }
        creationTimestamp
        url
      }
    }`;
  }
}
