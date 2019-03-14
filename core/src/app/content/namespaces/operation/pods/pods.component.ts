import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { DataConverter } from 'app/generic-list';
import { IPod, Pod } from 'shared/datamodel/k8s/pod';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class PodsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public title = 'Pods';
  public emptyListText =
    'It looks like you don’t have any pods in your namespace yet.';
  public createNewElementText = 'Add Pod';
  public resourceKind = 'Pod';
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
    const converter: DataConverter<IPod, Pod> = {
      convert(entry: IPod) {
        return new Pod(entry);
      }
    };

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;

        const url = `${AppConfig.k8sApiServerUrl}namespaces/${
          this.currentNamespaceId
        }/pods`;

        this.source = new KubernetesDataProvider(url, converter, this.http);

        this.entryRenderer = PodsEntryRendererComponent;
        this.headerRenderer = PodsHeaderRendererComponent;
      });
  }

  public getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentNamespaceId
    }/pods/${entry.getId()}`;
  }

  public createNewElement() {
    // TODO
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }
}
