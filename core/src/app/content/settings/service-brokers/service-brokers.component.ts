import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { CurrentNamespaceService } from '../../namespaces/services/current-namespace.service';
import { ServiceBrokerEntryRendererComponent } from './services-entry-renderer/service-broker-entry-renderer.component';
import { ServiceBrokerHeaderRendererComponent } from './services-header-renderer/service-broker-header-renderer.component';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from 'namespaces/operation/abstract-graphql-element-list.component';
import { Apollo } from 'apollo-angular';

@Component({
  templateUrl:
    '../../namespaces/operation/kubernetes-element-list.component.html'
})
export class ServiceBrokersComponent extends AbstractGraphqlElementListComponent {
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
    apollo: Apollo,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentNamespaceService,
      commService,
      apollo,
      changeDetector
    );
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
