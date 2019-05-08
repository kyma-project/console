import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { DataConverter } from 'app/generic-list';
import { AppConfig } from '../../../../app.config';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { AbstractKubernetesElementListComponent } from '../../../../content/namespaces/operation/abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../../../../content/namespaces/operation/kubernetes-data-provider';
import { CurrentNamespaceService } from '../../../../content/namespaces/services/current-namespace.service';
import { BindingEntryRendererComponent } from './binding-entry-renderer/binding-entry-renderer.component';
import { BindingHeaderRendererComponent } from './binding-header-renderer/binding-header-renderer.component';
import { IRoleBinding, RoleBinding } from '../../../datamodel/k8s/role-binding';
import { RoleBindingModalComponent } from '../../role-binding-modal/role-binding-modal.component';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  selector: 'app-bindings',
  templateUrl: 'bindings.component.html'
})
export class BindingsComponent extends AbstractKubernetesElementListComponent
  implements OnInit, OnDestroy {
  public title = '';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData('Role Bindings', { headerTitle: false, namespaceSuffix: true });
  public createNewElementText = 'Create Binding';
  public resourceKind = 'RoleBinding';
  private currentNamespaceId: string;

  // tslint:disable-next-line:no-input-rename
  @Input('mode') private mode: string;
  public isGlobalMode: boolean;

  @ViewChild('createrolebindingsmodal')
  private createRoleBindingsModal: RoleBindingModalComponent;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);
    this.pagingState = { pageNumber: 1, pageSize: 20 };
    this.entryRenderer = BindingEntryRendererComponent;
    this.headerRenderer = BindingHeaderRendererComponent;
  }

  public ngOnInit() {
    this.isGlobalMode = this.mode === 'clusterRoles';

    const converter: DataConverter<IRoleBinding, RoleBinding> = {
      convert(entry: IRoleBinding) {
        return new RoleBinding(entry);
      }
    };

    let url = '';
    if (this.isGlobalMode) {
      this.title = 'Cluster Role Bindings';
      url = `${AppConfig.k8sApiServerUrl_rbac}clusterrolebindings`;
      this.source = new KubernetesDataProvider(url, converter, this.http);
    } else {
      this.title = 'Role Bindings';
      this.currentNamespaceService
        .getCurrentNamespaceId()
        .subscribe(namespaceId => {
          this.currentNamespaceId = namespaceId;
          url = `${
            AppConfig.k8sApiServerUrl_rbac
          }namespaces/${namespaceId}/rolebindings`;
          this.source = new KubernetesDataProvider(url, converter, this.http);
        });
    }
    this.subscribeToRefreshComponent();
    super.ngOnInit();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public getResourceUrl(kind: string, entry: any): string {
    if (this.isGlobalMode) {
      return `${AppConfig.k8sApiServerUrl_rbac}clusterrolebindings/${
        entry.metadata.name
      }`;
    } else {
      return `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
        this.currentNamespaceId
      }/rolebindings/${entry.metadata.name}`;
    }
  }

  public openModal() {
    this.createRoleBindingsModal.show();
  }
}
