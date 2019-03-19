import { CurrentEnvironmentService } from './../../../environments/services/current-environment.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { SecretsEntryRendererComponent } from './secrets-entry-renderer/secrets-entry-renderer.component';
import { SecretsHeaderRendererComponent } from './secrets-header-renderer/secrets-header-renderer.component';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { DataConverter } from 'app/generic-list';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';
import { ISecret, Secret } from 'shared/datamodel/k8s/secret';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  selector: 'app-secrets',
  templateUrl: '../kubernetes-element-list.component.html'
})
export class SecretsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  title = 'Secrets';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title)
  createNewElementText = 'Add Secret';
  resourceKind = 'Secret';
  private currentEnvironmentId;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
    const converter: DataConverter<ISecret, Secret> = {
      convert(entry: ISecret) {
        return new Secret(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentEnvironmentId
        }/secrets`;
        this.source = new KubernetesDataProvider(url, converter, this.http);
        this.entryRenderer = SecretsEntryRendererComponent;
        this.headerRenderer = SecretsHeaderRendererComponent;
      });
  }

  public navigateToDetails(entry) {
    LuigiClient.linkManager()
      .fromContext('secrets')
      .navigate(`details/${entry.metadata.name}`);
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
