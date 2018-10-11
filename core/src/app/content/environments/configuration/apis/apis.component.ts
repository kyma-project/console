import { ApiDefinitionHeaderRendererComponent } from './api-definition-header-renderer/api-definition-header-renderer.component';
import { ApiDefinitionEntryRendererComponent } from './api-definition-entry-renderer/api-definition-entry-renderer.component';
import {
  IApiDefinition,
  ApiDefinition
} from './../../../../shared/datamodel/k8s/kyma-api/api-definition';
import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AbstractKubernetesElementListComponent } from '../../operation/abstract-kubernetes-element-list.component';
import { HttpClient } from '@angular/common/http';
import { CurrentEnvironmentService } from '../../services/current-environment.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { AppConfig } from '../../../../app.config';
import { KubernetesDataProvider } from '../../operation/kubernetes-data-provider';
import { DataConverter, Filter } from '@kyma-project/y-generic-list';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-apis',
  templateUrl: 'apis.component.html',
  host: { class: 'sf-content' }
})
export class ApisComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public resourceKind = 'Api';
  public title = 'APIs';
  public emptyListText =
    'It looks like you don’t have any APIs in your namespace yet.';
  public createNewElementText = 'Add API';
  public baseUrl: string;
  public currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
    const converter: DataConverter<IApiDefinition, ApiDefinition> = {
      convert(entry: IApiDefinition) {
        return new ApiDefinition(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        this.baseUrl = `${
          AppConfig.k8sApiServerUrl_apimanagement
        }namespaces/${envId}/apis`;

        this.source = new KubernetesDataProvider(
          this.baseUrl,
          converter,
          this.http,
          'items'
        );
        this.entryRenderer = ApiDefinitionEntryRendererComponent;
        this.headerRenderer = ApiDefinitionHeaderRendererComponent;

        this.filterState = {
          filters: [new Filter('metadata.name', '', false)]
        };
      });
  }

  navigateToDetails(entry: any) {
    this.router.navigate(['details/' + entry.metadata.name], {
      relativeTo: this.activatedRoute
    });
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}/${entry.metadata.name}`;
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
