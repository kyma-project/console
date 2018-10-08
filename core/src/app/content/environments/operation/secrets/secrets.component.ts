import {
  DashboardSecret,
  IDashboardSecret
} from './../../../../shared/datamodel/k8s/dashboard-secrets';
import { OAuthService } from 'angular-oauth2-oidc';
import { CurrentEnvironmentService } from './../../../environments/services/current-environment.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { SecretsEntryRendererComponent } from './secrets-entry-renderer/secrets-entry-renderer.component';
import { SecretsHeaderRendererComponent } from './secrets-header-renderer/secrets-header-renderer.component';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { DataConverter } from '@kyma-project/y-generic-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secrets',
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class SecretsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  title = 'Secrets';
  emptyListText =
    'It looks like you don’t have any secrets in your namespace yet.';
  createNewElementText = 'Add Secret';
  resourceKind = 'Secret';
  private currentEnvironmentId;
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
    const converter: DataConverter<IDashboardSecret, DashboardSecret> = {
      convert(entry: IDashboardSecret) {
        return new DashboardSecret(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        const url = `${AppConfig.k8sDashboardApiUrl}secret/${
          this.currentEnvironmentId
        }`;
        this.source = new KubernetesDataProvider(
          url,
          converter,
          this.http,
          'secrets'
        );
        this.entryRenderer = SecretsEntryRendererComponent;
        this.headerRenderer = SecretsHeaderRendererComponent;
      });
  }

  createNewElement() {
    // TODO
  }

  getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentEnvironmentId
    }/secrets/${entry.getId()}`;
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
