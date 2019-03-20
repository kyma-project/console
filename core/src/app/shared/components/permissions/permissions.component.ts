import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentNamespaceService } from '../../../content/namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { map } from 'rxjs/operators';

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

  constructor(
    private currentNamespaceService: CurrentNamespaceService,
    private communicationService: ComponentCommunicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(routeData => {
      this.isGlobalMode = routeData && routeData.global;

      this.bindingsTabTitle = this.isGlobalMode
        ? 'Cluster Role Bindings'
        : 'Role Bindings';

      this.route.queryParamMap
        .pipe(map((params: Params) => params.params))
        .subscribe(paramsMap => {
          const activeTab = paramsMap.tab;

          switch (activeTab) {
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
        });
    });
  }

  public ngOnInit() {}

  public changeTab(tab) {
    switch (tab) {
      case 'bindings':
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { tab: 'bindings' }
        });
        break;
      case 'roles':
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { tab: 'roles' }
        });
        break;
      case 'clusterRoles':
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { tab: 'clusterRoles' }
        });
        break;
    }
  }
}
