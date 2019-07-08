import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from 'namespaces/operation/abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from 'namespaces/operation/kubernetes-data-provider';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { RolesEntryRendererComponent } from './roles-entry-renderer/roles-entry-renderer.component';
import { RolesHeaderRendererComponent } from './roles-header-renderer/roles-header-renderer.component';
import LuigiClient from '@kyma-project/luigi-client';
import { IEmptyListData } from 'shared/datamodel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-roles',
  styles: ['y-list-filter { display: none; }'],
  templateUrl:
    '../../../../content/namespaces/operation/kubernetes-element-list-compact.component.html'
})
export class RolesComponent extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public title = '';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('Roles', { headerTitle: false, namespaceSuffix: true });

  public resourceKind = 'Role';
  public createNewElementText = '';

  private currentNamespaceId: string;
  private activeTab: string;

  // tslint:disable-next-line:no-input-rename
  @Input('mode') private mode: string;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);

    this.pagingState = { pageNumber: 1, pageSize: 20 };
    this.entryRenderer = RolesEntryRendererComponent;
    this.headerRenderer = RolesHeaderRendererComponent;
  }

  public ngOnInit() {
    const converter = {
      convert(entry) {
        return entry;
      }
    };
    switch (this.mode) {
      case 'roles':
        this.title = 'Roles';
        this.currentNamespaceService
          .getCurrentNamespaceId()
          .subscribe(namespaceId => {
            this.currentNamespaceId = namespaceId;
            const rolesUrl = `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
              this.currentNamespaceId
            }/roles`;
            this.source = new KubernetesDataProvider(
              rolesUrl,
              converter,
              this.http
            );
            //#this.reload();
          });
        break;
      case 'clusterRoles':
        this.title = 'Cluster Roles';
        const clusterrolesUrl = `${AppConfig.k8sApiServerUrl_rbac}clusterroles`;
        this.source = new KubernetesDataProvider(
          clusterrolesUrl,
          converter,
          this.http
        );
        break;
    }
    this.subscribeToRefreshComponent();
    super.ngOnInit();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public getResourceUrl(entry: any): string {
    if (this.activeTab === 'roles') {
      return `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
        this.currentNamespaceId
      }/roles/${entry.metadata.name}`;
    } else {
      return `${AppConfig.k8sApiServerUrl_rbac}clusterroles/${
        entry.metadata.name
      }`;
    }
  }

  public navigateToDetails(entry: any) {
    if (this.mode === 'roles') {
      LuigiClient.linkManager()
        .fromContext('permissions')
        .navigate(`roles/${entry.metadata.name}`);
    } else {
      LuigiClient.linkManager().navigate(
        `/home/global-permissions/roles/${entry.metadata.name}`
      );
    }
  }
}
