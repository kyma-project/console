import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DataConverter } from 'app/generic-list';
import { AppConfig } from '../../../../app.config';
import { CurrentEnvironmentService } from '../../../environments/services/current-environment.service';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ConfigMapsEntryRendererComponent } from './configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './configmaps-header-renderer/configmaps-header-renderer.component';
import { ConfigMap, IConfigMap } from 'shared/datamodel/k8s/configmap';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class ConfigMapsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Config Maps';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title)
  public createNewElementText = 'Add Config Map';
  public resourceKind = 'ConfigMap';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
    const converter: DataConverter<IConfigMap, ConfigMap> = {
      convert(entry: IConfigMap) {
        return new ConfigMap(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentEnvironmentId
        }/configmaps`;

        this.source = new KubernetesDataProvider(url, converter, this.http);
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
