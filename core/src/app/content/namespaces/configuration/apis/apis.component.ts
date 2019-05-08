import { ApiDefinitionHeaderRendererComponent } from './api-definition-header-renderer/api-definition-header-renderer.component';
import { ApiDefinitionEntryRendererComponent } from './api-definition-entry-renderer/api-definition-entry-renderer.component';
import {
  IApiDefinition,
  ApiDefinition
} from 'shared/datamodel/k8s/kyma-api/api-definition';
import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { AbstractKubernetesElementListComponent } from '../../operation/abstract-kubernetes-element-list.component';
import { HttpClient } from '@angular/common/http';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { AppConfig } from '../../../../app.config';
import { KubernetesDataProvider } from '../../operation/kubernetes-data-provider';
import { DataConverter, Filter } from 'app/generic-list';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  selector: 'app-apis',
  templateUrl: 'apis.component.html'
})
export class ApisComponent extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public resourceKind = 'Api';
  public title = 'APIs';
  public baseUrl: string;
  public currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title);

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);
    const converter: DataConverter<IApiDefinition, ApiDefinition> = {
      convert(entry: IApiDefinition) {
        return new ApiDefinition(entry);
      }
    };

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        this.baseUrl = `${
          AppConfig.k8sApiServerUrl_apimanagement
        }namespaces/${namespaceId}/apis`;

        this.source = new KubernetesDataProvider(
          this.baseUrl,
          converter,
          this.http
        );
        this.entryRenderer = ApiDefinitionEntryRendererComponent;
        this.headerRenderer = ApiDefinitionHeaderRendererComponent;

        this.filterState = {
          filters: [new Filter('metadata.name', '', false)]
        };
      });
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}/${entry.metadata.name}`;
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  public navigateToDetails(entry) {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate(`details/${entry.metadata.name}`);
  }

  public navigateToCreate() {
    LuigiClient.linkManager()
      .fromContext('apismicrofrontend')
      .navigate('create');
  }
}
