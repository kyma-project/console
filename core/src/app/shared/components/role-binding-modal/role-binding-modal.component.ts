import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { RbacService } from '../../services/rbac.service';
import * as _ from 'lodash';
import { CurrentEnvironmentService } from '../../../content/environments/services/current-environment.service';
import { Subscription } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { ModalComponent, ModalService } from 'fundamental-ngx';

@Component({
  selector: 'app-role-binding-modal',
  templateUrl: './role-binding-modal.component.html',
  styleUrls: ['./role-binding-modal.component.scss']
})
export class RoleBindingModalComponent implements OnDestroy {
  @ViewChild('createBindingModal') createBindingModal: ModalComponent;
  public isActive = false;
  public roles = [];
  public userOrGroup = '';
  private selectedRole = '';
  private selectedKind = '';
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public ariaExpandedRole = false;
  private ariaExpandedKind = false;
  public error = '';
  public filteredRoles = [];
  public filteredKinds = ['Role', 'ClusterRole'];
  private kinds = ['Role', 'ClusterRole'];
  private userGroupError: string;
  public isUserGroupMode: boolean;

  @Input() isGlobalPermissionsView: boolean;

  constructor(
    private rbacService: RbacService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private communicationService: ComponentCommunicationService,
    private modalService: ModalService
  ) {
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });
  }

  getClusterRoles() {
    this.rbacService.getClusterRoles().subscribe(
      res => {
        const response: any = res;
        if (response && response.items && _.isArray(response.items)) {
          this.roles = response.items.map(entry => entry.metadata.name).sort();
          this.filteredRoles = response.items
            .map(entry => entry.metadata.name)
            .sort();
        }
      },
      err => console.log(err)
    );
  }

  getRoles() {
    this.rbacService.getRoles(this.currentEnvironmentId).subscribe(
      res => {
        const response: any = res;
        if (response && response.items && _.isArray(response.items)) {
          this.roles = response.items.map(entry => entry.metadata.name).sort();
          this.filteredRoles = response.items
            .map(entry => entry.metadata.name)
            .sort();
        }
      },
      err => console.log(err)
    );
  }

  selectRole(role) {
    this.selectedRole = role;
    this.error = '';
  }

  setUserGroupMode() {
    this.isUserGroupMode = true;
  }
  setUserMode() {
    this.isUserGroupMode = false;
  }

  selectKind(kind) {
    this.error = '';
    if (this.selectedKind !== kind) {
      this.selectedRole = '';
    }
    this.selectedKind = kind;
    if ('ClusterRole' === this.selectedKind) {
      return this.getClusterRoles();
    }
    return this.getRoles();
  }

  public show() {
    this.isActive = true;
    if (this.isGlobalPermissionsView) {
      this.selectKind('ClusterRole');
    }
    this.modalService.open(this.createBindingModal).result.finally(() => {
      this.isActive = false;
    });
    this.isUserGroupMode = true;
  }

  public close() {
    this.isActive = false;
    this.modalService.close(this.createBindingModal);
    this.userOrGroup = '';
    this.selectedRole = '';
    this.selectedKind = '';
    this.error = '';
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
      data['namespace'] = this.currentEnvironmentId;
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

  public toggleDropDown(dropdown) {
    switch (dropdown) {
      case 'Kind':
        this.ariaExpandedRole = false;
        return (this.ariaExpandedKind = !this.ariaExpandedKind);
      case 'Role':
        this.ariaExpandedKind = false;
        return (this.ariaExpandedRole = !this.ariaExpandedRole);
    }
  }

  public closeDropDown(dropdown) {
    switch (dropdown) {
      case 'Kind':
        return (this.ariaExpandedKind = false);
      case 'Role':
        return (this.ariaExpandedRole = false);
      default:
        this.ariaExpandedRole = false;
        this.ariaExpandedKind = false;
    }
  }

  public openDropDown(dropdown: any, event: Event) {
    event.stopPropagation();
    switch (dropdown) {
      case 'Kind':
        return (this.ariaExpandedKind = true);
      case 'Role':
        return (this.ariaExpandedRole = true);
      default:
        this.ariaExpandedRole = true;
        this.ariaExpandedKind = true;
    }
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  filterEnvironments(field) {
    this.error = '';
    switch (field) {
      case 'Kind':
        return (this.filteredKinds = this.filter(
          this.kinds,
          this.selectedKind
        ));
      case 'Role':
        return (this.filteredRoles = this.filter(
          this.roles,
          this.selectedRole
        ));
    }
  }

  filter(array, name) {
    const envs = [];
    array.forEach(element => {
      if (element.toLowerCase().includes(name.toLowerCase())) {
        envs.push(element);
      }
    });
    return envs;
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

  validateUserGroupInput() {
    // it must consist of lower case alphanumeric characters, '-' or '.', and must start and end with an alphanumeric character (e.g. 'example.com')
    const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    this.userGroupError = regex.test(this.userOrGroup)
      ? ''
      : `The user group name has the wrong format. The name must consist of lower case alphanumeric characters, dashes or dots, and must start and end with an alphanumeric character (e.g. 'my-name').`;
    return regex.test(this.userOrGroup);
  }
}
