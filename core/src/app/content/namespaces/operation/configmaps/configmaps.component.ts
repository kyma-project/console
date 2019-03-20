import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DataConverter } from 'app/generic-list';
import { AppConfig } from '../../../../app.config';
import { CurrentNamespaceService } from '../../services/current-namespace.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ConfigMapsEntryRendererComponent } from './configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './configmaps-header-renderer/configmaps-header-renderer.component';
import { ConfigMap, IConfigMap } from 'shared/datamodel/k8s/configmap';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ConfigMapsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Config Maps';
  public emptyListText =
    'It looks like you don’t have any config maps in your namespace yet.';
  public createNewElementText = 'Add Config Map';
  public resourceKind = 'ConfigMap';
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
    const converter: DataConverter<IConfigMap, ConfigMap> = {
      convert(entry: IConfigMap) {
        return new ConfigMap(entry);
      }
    };

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;

        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentNamespaceId
        }/configmaps`;

        this.source = new KubernetesDataProvider(url, converter, this.http);
        this.entryRenderer = ConfigMapsEntryRendererComponent;
        this.headerRenderer = ConfigMapsHeaderRendererComponent;
      });
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentNamespaceId
    }/configmaps/${entry.getId()}`;
  }

  public createNewElement() {
    // TODO
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }
}
