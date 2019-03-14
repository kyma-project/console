import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { DataConverter } from 'app/generic-list';
import { AppConfig } from '../../../../app.config';
import { ComponentCommunicationService } from '../../../services/component-communication.service';
import { AbstractKubernetesElementListComponent } from '../../../../content/environments/operation/abstract-kubernetes-element-list.component';
import { KubernetesDataProvider } from '../../../../content/environments/operation/kubernetes-data-provider';
import { CurrentEnvironmentService } from '../../../../content/environments/services/current-environment.service';
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
  implements OnInit {
  public title = '';
  public emptyListData: IEmptyListData = {
    body: {
      text: 'It looks like you don’t have any Role Bindings yet.'
    }
  };
  public createNewElementText = 'Create Binding';
  public resourceKind = 'RoleBinding';
  private currentEnvironmentId: string;

  // tslint:disable-next-line:no-input-rename
  @Input('mode') private mode: string;
  public isGlobalMode: boolean;

  @ViewChild('createrolebindingsmodal')
  private createRoleBindingsModal: RoleBindingModalComponent;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);
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
      this.currentEnvironmentService
        .getCurrentEnvironmentId()
        .subscribe(envId => {
          this.currentEnvironmentId = envId;
          url = `${
            AppConfig.k8sApiServerUrl_rbac
          }namespaces/${envId}/rolebindings`;
          this.source = new KubernetesDataProvider(url, converter, this.http);
        });
    }

    super.ngOnInit();
  }

  public getResourceUrl(kind: string, entry: any): string {
    if (this.isGlobalMode) {
      return `${AppConfig.k8sApiServerUrl_rbac}clusterrolebindings/${
        entry.metadata.name
      }`;
    } else {
      return `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
        this.currentEnvironmentId
      }/rolebindings/${entry.metadata.name}`;
    }
  }

  public openModal() {
    this.createRoleBindingsModal.show();
  }
}
