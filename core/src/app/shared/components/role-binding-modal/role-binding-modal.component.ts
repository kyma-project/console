import {
  Component,
  Input,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { RbacService } from '../../services/rbac.service';
import * as _ from 'lodash';
import { CurrentNamespaceService } from '../../../content/namespaces/services/current-namespace.service';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { ModalService, ModalRef } from 'fundamental-ngx';
import { DEFAULT_MODAL_CONFIG } from 'shared/constants/constants';

@Component({
  selector: 'app-role-binding-modal',
  templateUrl: './role-binding-modal.component.html',
  styleUrls: ['./role-binding-modal.component.scss']
})
export class RoleBindingModalComponent implements OnDestroy {
  @ViewChild('createBindingModal') createBindingModal: TemplateRef<ModalRef>;
  public isActive = false;
  public roles = [];
  public userOrGroup = '';
  public selectedRole = '';
  public selectedKind = '';
  private currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public error = '';
  private kinds = ['Role', 'ClusterRole'];
  public userGroupError: string;
  public isUserGroupMode: boolean;

  @Input() isGlobalPermissionsView: boolean;

  constructor(
    private rbacService: RbacService,
    private currentNamespaceService: CurrentNamespaceService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
      });
  }

  getClusterRoles() {
    this.rbacService.getClusterRoles().subscribe(
      res => {
        const response: any = res;
        if (response && response.items && _.isArray(response.items)) {
          this.roles = response.items.map(entry => entry.metadata.name).sort();
        }
      },
      err => console.log(err)
    );
  }

  getRoles() {
    this.rbacService.getRoles(this.currentNamespaceId).subscribe(
      res => {
        const response: any = res;
        if (response && response.items && _.isArray(response.items)) {
          this.roles = response.items.map(entry => entry.metadata.name).sort();
        }
      },
      err => console.log(err)
    );
  }

  setUserGroupMode() {
    this.isUserGroupMode = true;
    this.validateUserOrGroupInput();
  }

  setUserMode() {
    this.isUserGroupMode = false;
    this.validateUserOrGroupInput();
  }

  isSelectedKindCorrect() {
    return this.selectedKind === 'Role' || this.selectedKind === 'ClusterRole'
  }

  selectKind() {
    if (this.isSelectedKindCorrect()) {
      if ('ClusterRole' === this.selectedKind) {
        return this.getClusterRoles();
      }
      return this.getRoles();
    }
  }

  public show() {
    this.isActive = true;
    if (this.isGlobalPermissionsView) {
      this.selectedKind = 'ClusterRole';
    }
    this.selectKind();
    this.modalService
      .open(this.createBindingModal, {
        ...DEFAULT_MODAL_CONFIG,
        width: '28em'
      })
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        this.clearData();
      });
    this.isUserGroupMode = true;
  }

  public close() {
    this.isActive = false;
    this.clearData();
    this.modalService.dismissAll();
  }

  public clearData() {
    this.userOrGroup = '';
    this.selectedRole = '';
    this.selectedKind = '';
    this.error = '';
    this.userGroupError = '';
  }

  prepareData() {
    const data = {
      roleKind: this.selectedKind,
      roleName: this.selectedRole,
      name: this.userOrGroup
    };

    if (this.isGlobalPermissionsView) {
      data['kind'] = 'ClusterRoleBinding';
    } else {
      data['namespace'] = this.currentNamespaceId;
      data['kind'] = 'RoleBinding';
    }
    data['isUserGroupMode'] = this.isUserGroupMode;

    return data;
  }

  public save() {
    const data = this.prepareData();
    if (this.isGlobalPermissionsView) {
      return this.rbacService.createClusterRoleBinding(data).subscribe(
        res => {
          this.close();
          this.communicationService.sendEvent({
            type: 'updateData',
            data: res
          });
        },
        err => {
          this.error = `Error: ${err.error.message}`;
          console.log(err);
        }
      );
    }
    return this.rbacService.createRoleBinding(data).subscribe(
      res => {
        this.close();
        this.communicationService.sendEvent({ type: 'updateData', data: res });
      },
      err => {
        this.error = `Error: ${err.error.message}`;
        console.log(err);
      }
    );
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
  }

  isReadyToCreate() {
    if (this.isGlobalPermissionsView) {
      return this.areValuesForGlobalPermissionsCorrect();
    }
    return this.areValuesForLocalPermissionsCorrect();
  }

  areValuesForGlobalPermissionsCorrect() {
    return (
      _.includes(this.roles, this.selectedRole) &&
      this.userOrGroup &&
      !this.userGroupError
    );
  }

  areValuesForLocalPermissionsCorrect() {
    return (
      _.includes(this.roles, this.selectedRole) &&
      this.userOrGroup &&
      !this.userGroupError &&
      _.includes(this.kinds, this.selectedKind)
    );
  }

  validateUserOrGroupInput() {
    // it must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character (e.g. 'example.com')
    const regex = this.isUserGroupMode
      ? /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/
      : /^.*$/;
    this.userGroupError = regex.test(this.userOrGroup)
      ? ''
      : `The user group name has the wrong format. The name must consist of lower case alphanumeric characters, dashes or dots, and must start and end with an alphanumeric character (e.g. 'my-name').`;
    return regex.test(this.userOrGroup);
  }

  public filterKind = (content: string[], searchTerm: string): string[] => {
    const searchTermLower = searchTerm.toLocaleLowerCase();
    return this.isSelectedKindCorrect() ? content : content.filter(term => term.toLocaleLowerCase().includes(searchTermLower));
  };
}
