import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

import { AppConfig } from '../../../../app.config';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ServicesHeaderRendererComponent } from './services-header-renderer/services-header-renderer.component';
import { ServicesEntryRendererComponent } from './services-entry-renderer/services-entry-renderer.component';
import { DataConverter } from 'app/generic-list';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { Service, IService } from 'shared/datamodel/k8s/service';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  selector: 'app-services',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ServicesComponent extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public title = 'Services';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title)
  public createNewElementText = 'Add Service';
  public resourceKind = 'Service';
  private currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);
    const converter: DataConverter<IService, Service> = {
      convert(entry: IService) {
        return new Service(entry);
      }
    };

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;

        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentNamespaceId
        }/services`;
        this.source = new KubernetesDataProvider(url, converter, this.http);
        this.entryRenderer = ServicesEntryRendererComponent;
        this.headerRenderer = ServicesHeaderRendererComponent;
        this.reloadResults();
      });
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();
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
      this.currentNamespaceId
    }/services/${entry.getId()}`;
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
