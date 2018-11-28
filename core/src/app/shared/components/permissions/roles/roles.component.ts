import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppConfig } from '../../../../app.config';
import { AbstractKubernetesElementListComponent } from '../../../../content/environments/operation/abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../../../../content/environments/operation/kubernetes-data-provider';
import { CurrentEnvironmentService } from '../../../../content/environments/services/current-environment.service';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { RolesEntryRendererComponent } from './roles-entry-renderer/roles-entry-renderer.component';
import { RolesHeaderRendererComponent } from './roles-header-renderer/roles-header-renderer.component';

@Component({
  host: { class: '' },
  selector: 'app-roles',
  styles: ['y-list-filter { display: none; }'],
  templateUrl:
    '../../../../content/environments/operation/kubernetes-element-list-compact.component.html'
})
export class RolesComponent extends AbstractKubernetesElementListComponent
  implements OnInit {
  public title = '';
  public emptyListText = 'It looks like you don’t have any Roles yet.';
  public resourceKind = 'Role';
  public createNewElementText = '';

  private currentEnvironmentId: string;
  private activeTab: string;

  // tslint:disable-next-line:no-input-rename
  @Input('mode') private mode: string;

  constructor(
    private http: HttpClient,
    private oAuthService: OAuthService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);

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
        this.currentEnvironmentService
          .getCurrentEnvironmentId()
          .subscribe(envId => {
            this.currentEnvironmentId = envId;
            const rolesUrl = `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
              this.currentEnvironmentId
            }/roles`;
            this.source = new KubernetesDataProvider(
              rolesUrl,
              converter,
              this.http
            );
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

    super.ngOnInit();
  }

  public getResourceUrl(entry: any): string {
    if (this.activeTab === 'roles') {
      return `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
        this.currentEnvironmentId
      }/roles/${entry.metadata.name}`;
    } else {
      return `${AppConfig.k8sApiServerUrl_rbac}clusterroles/${
        entry.metadata.name
      }`;
    }
  }
}
