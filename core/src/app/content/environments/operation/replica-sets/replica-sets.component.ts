import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CurrentEnvironmentService } from 'environments/services/current-environment.service';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../../app.config';
import { KubernetesDataProvider } from '../kubernetes-data-provider';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './replica-sets-header-renderer/replica-sets-header-renderer.component';
import { AbstractKubernetesElementListComponent } from '../abstract-kubernetes-element-list.component';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { DataConverter } from '@kyma-project/y-generic-list';
import { Subscription } from 'rxjs';
import { IReplicaSet, ReplicaSet } from 'shared/datamodel/k8s/replica-set';

@Component({
  selector: 'app-replica-sets',
  templateUrl: '../kubernetes-element-list.component.html',
  host: { class: 'sf-content' }
})
export class ReplicaSetsComponent extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  title = 'Replica Sets';
  emptyListText =
    'It looks like you don’t have any replica sets in your namespace yet.';
  createNewElementText = 'Add Replica Set';
  resourceKind = 'ReplicaSet';
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
    const converter: DataConverter<IReplicaSet, ReplicaSet> = {
      convert(entry: IReplicaSet) {
        return new ReplicaSet(entry);
      }
    };

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        const url = `${AppConfig.k8sApiServerUrl_extensions}namespaces/${
          this.currentEnvironmentId
        }/replicasets`;
        this.source = new KubernetesDataProvider(url, converter, this.http);
        this.entryRenderer = ReplicaSetsEntryRendererComponent;
        this.headerRenderer = ReplicaSetsHeaderRendererComponent;
      });
  }

  createNewElement() {
    // TODO
  }

  getResourceUrl(kind: string, entry: any): string {
    return `${AppConfig.k8sApiServerUrl_extensions}namespaces/${
      this.currentEnvironmentId
    }/replicasets/${entry.getId()}`;
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
