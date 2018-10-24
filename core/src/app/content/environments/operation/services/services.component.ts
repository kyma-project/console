import { AppConfig } from '../../../../app.config';
import {
  DashboardServices,
  IDashboardServices
} from '../../../../shared/datamodel/k8s/dashboard-services';
import { CurrentEnvironmentService } from '../../services/current-environment.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ServicesHeaderRendererComponent } from './services-header-renderer/services-header-renderer.component';
import { ServicesEntryRendererComponent } from './services-entry-renderer/services-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { DataConverter } from '@kyma-project/y-generic-list';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class ServicesComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Services';
  public emptyListText =
    'It looks like you don’t have any services in your namespace yet.';
  public createNewElementText = 'Add Service';
  public resourceKind = 'Service';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private oAuthService: OAuthService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
    const converter: DataConverter<IDashboardServices, DashboardServices> = {
      convert(entry: IDashboardServices) {
        return new DashboardServices(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        const url = `${AppConfig.k8sDashboardApiUrl}service/${
          this.currentEnvironmentId
        }`;
        this.source = new KubernetesDataProvider(
          url,
          converter,
          this.http,
          'services'
        );
        this.entryRenderer = ServicesEntryRendererComponent;
        this.headerRenderer = ServicesHeaderRendererComponent;
      });
  }

  getEntryEventHandler() {
    const handler = super.getEntryEventHandler();
    handler.exposeApi = (entry: any) => {
      this.router.navigate([entry.objectMeta.name + '/apis/create'], {
        relativeTo: this.activatedRoute
      });
    };
    return handler;
  }

  navigateToDetails(entry: any) {
    this.router.navigate([entry.objectMeta.name], {
      relativeTo: this.activatedRoute
    });
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
