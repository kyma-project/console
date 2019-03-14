import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

import { AppConfig } from '../../../../app.config';
import { CurrentEnvironmentService } from '../../services/current-environment.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ServicesHeaderRendererComponent } from './services-header-renderer/services-header-renderer.component';
import { ServicesEntryRendererComponent } from './services-entry-renderer/services-entry-renderer.component';
import { DataConverter } from 'app/generic-list';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { Service, IService } from 'shared/datamodel/k8s/service';

@Component({
  selector: 'app-services',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ServicesComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Services';
  public emptyListData = {
    header: {
      text: this.title
    },
    body: {
      text: 'It looks like you don’t have any services in your namespace yet.'
    }
  };
  public createNewElementText = 'Add Service';
  public resourceKind = 'Service';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
    const converter: DataConverter<IService, Service> = {
      convert(entry: IService) {
        return new Service(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentEnvironmentId
        }/services`;
        this.source = new KubernetesDataProvider(url, converter, this.http);
        this.entryRenderer = ServicesEntryRendererComponent;
        this.headerRenderer = ServicesHeaderRendererComponent;
      });
  }

  getEntryEventHandler() {
    const handler = super.getEntryEventHandler();
    handler.exposeApi = (entry: any) => {
      this.navigateToCreate(entry.metadata.name);
    };
    return handler;
  }

  public navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`details/${entry.metadata.name}`);
  }

  public navigateToCreate(serviceName) {
    LuigiClient.linkManager().navigate(`details/${serviceName}/apis/create`);
  }

  public createNewElement() {
    // TODO
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentEnvironmentId
    }/services/${entry.getId()}`;
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
