import { CurrentNamespaceService } from '../../services/current-namespace.service';
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
  private currentNamespaceId;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);
    const converter: DataConverter<ISecret, Secret> = {
      convert(entry: ISecret) {
        return new Secret(entry);
      }
    };

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentNamespaceId
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
      this.currentNamespaceId
    }/secrets/${entry.getId()}`;
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }
}
