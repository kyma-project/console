import { ApiDefinitionHeaderRendererComponent } from './api-definition-header-renderer/api-definition-header-renderer.component';
import { ApiDefinitionEntryRendererComponent } from './api-definition-entry-renderer/api-definition-entry-renderer.component';
import {
  IApiDefinition,
  ApiDefinition
} from 'shared/datamodel/k8s/kyma-api/api-definition';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractKubernetesElementListComponent } from '../../operation/abstract-kubernetes-element-list.component';
import { HttpClient } from '@angular/common/http';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { AppConfig } from '../../../../app.config';
import { KubernetesDataProvider } from '../../operation/kubernetes-data-provider';
import { DataConverter, Filter } from 'app/generic-list';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-apis',
  templateUrl: 'apis.component.html'
})
export class ApisComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public resourceKind = 'Api';
  public title = 'APIs';
  public emptyListText =
    'It looks like you don’t have any APIs in your namespace yet.';
  public createNewElementText = 'Add API';
  public baseUrl: string;
  public currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;

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

  public getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}/${entry.metadata.name}`;
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
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
