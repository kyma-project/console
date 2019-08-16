import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { map } from 'rxjs/operators';

import * as luigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements OnInit {
  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  public title = 'Permissions';
  public bindingsTabTitle: string;

  public bindingsTabExpanded: boolean;
  public rolesTabExpanded: boolean;
  public clusterRolesTabExpanded: boolean;

  public isGlobalMode = false;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(routeData => {
      this.isGlobalMode = routeData && routeData.global;

      this.bindingsTabTitle = this.isGlobalMode
        ? 'Cluster Role Bindings'
        : 'Role Bindings';
    });
  }

  public ngOnInit() {
    const selectedTab = luigiClient.getNodeParams().selectedTab;
    this.displaySelectedTab(selectedTab);
  }

  public displaySelectedTab(selectedTab) {
    switch (selectedTab) {
      case 'roles':
        this.bindingsTabExpanded = false;
        this.rolesTabExpanded = true;
        this.clusterRolesTabExpanded = false;
        break;
      case 'clusterRoles':
        this.bindingsTabExpanded = false;
        this.rolesTabExpanded = false;
        this.clusterRolesTabExpanded = true;
        break;
      default:
        this.bindingsTabExpanded = true;
        this.rolesTabExpanded = false;
        this.clusterRolesTabExpanded = false;
    }
  }

  public changeTab(tab) {
    luigiClient
      .linkManager()
      .withParams({ selectedTab: tab })
      .navigate('');
    this.displaySelectedTab(tab);
  }
}
