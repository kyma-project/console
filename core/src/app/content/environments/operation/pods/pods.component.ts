import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { HttpClient } from '@angular/common/http';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { DataConverter } from '@kyma-project/y-generic-list';
import { Observable, Subscription } from 'rxjs';
import { IPod, Pod } from 'shared/datamodel/k8s/pod';

@Component({
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class PodsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Pods';
  public emptyListText =
    'It looks like you don’t have any pods in your namespace yet.';
  public createNewElementText = 'Add Pod';
  public resourceKind = 'Pod';
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
    const converter: DataConverter<IPod, Pod> = {
      convert(entry: IPod) {
        return new Pod(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentEnvironmentId
        }/pods`;

        this.source = new KubernetesDataProvider(url, converter, this.http);

        this.entryRenderer = PodsEntryRendererComponent;
        this.headerRenderer = PodsHeaderRendererComponent;
      });
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentEnvironmentId
    }/pods/${entry.getId()}`;
  }

  public createNewElement() {
    // TODO
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
