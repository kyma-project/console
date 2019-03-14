import { ChangeDetectorRef, Component } from '@angular/core';
import { AppConfig } from '../../../app.config';
import {
  ServiceBroker,
  IServiceBroker
} from '../../../shared/datamodel/k8s/service-broker';
import { KubernetesDataProvider } from '../../namespaces/operation/kubernetes-data-provider';
import { DataConverter } from 'app/generic-list';
import { HttpClient } from '@angular/common/http';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { CurrentNamespaceService } from '../../namespaces/services/current-namespace.service';
import { ServiceBrokerEntryRendererComponent } from './services-entry-renderer/service-broker-entry-renderer.component';
import { ServiceBrokerHeaderRendererComponent } from './services-header-renderer/service-broker-header-renderer.component';
import { AbstractKubernetesElementListComponent } from '../../namespaces/operation/abstract-kubernetes-element-list.component';

@Component({
  selector: 'app-service-brokers',
  templateUrl:
    '../../namespaces/operation/kubernetes-element-list.component.html'
})
export class ServiceBrokersComponent extends AbstractKubernetesElementListComponent {
  public title = 'Service Brokers';
  public emptyListText =
    'It looks like you don’t have any service brokers yet.';
  public createNewElementText = 'Add Service Broker';
  public resourceKind = 'ServiceBroker';
  public hideFilter = true;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);
    const converter: DataConverter<IServiceBroker, ServiceBroker> = {
      convert(entry: IServiceBroker) {
        return new ServiceBroker(entry);
      }
    };

    const url = `${
      AppConfig.k8sApiServerUrl_servicecatalog
    }clusterservicebrokers`;
    this.source = new KubernetesDataProvider(url, converter, this.http);
    this.entryRenderer = ServiceBrokerEntryRendererComponent;
    this.headerRenderer = ServiceBrokerHeaderRendererComponent;
  }

  public createNewElement() {
    // TODO
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${
      AppConfig.k8sApiServerUrl_servicecatalog
    }clusterservicebrokers/${entry.getId()}`;
  }
}
