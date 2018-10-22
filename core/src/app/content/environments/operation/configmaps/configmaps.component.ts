import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CurrentEnvironmentService } from '../../../environments/services/current-environment.service';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { DataConverter } from '@kyma-project/y-generic-list';
import { Subscription } from 'rxjs';
import { ConfigMapsEntryRendererComponent } from './configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './configmaps-header-renderer/configmaps-header-renderer.component';
import {
  IDashboardConfigMap,
  DashboardConfigMap
} from '../../../../shared/datamodel/k8s/dashboard-configmaps';

@Component({
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class ConfigMapsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Config Maps';
  public emptyListText =
    'It looks like you don’t have any config maps in your namespace yet.';
  public createNewElementText = 'Add Config Map';
  public resourceKind = 'ConfigMap';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private oAuthService: OAuthService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
    const converter: DataConverter<IDashboardConfigMap, DashboardConfigMap> = {
      convert(entry: IDashboardConfigMap) {
        return new DashboardConfigMap(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        const url = `${AppConfig.k8sDashboardApiUrl}configmap/${
          this.currentEnvironmentId
        }`;

        this.source = new KubernetesDataProvider(
          url,
          converter,
          this.http,
          'items'
        );

        this.entryRenderer = ConfigMapsEntryRendererComponent;
        this.headerRenderer = ConfigMapsHeaderRendererComponent;
      });
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentEnvironmentId
    }/configmaps/${entry.getId()}`;
  }

  public createNewElement() {
    // TODO
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
