import { Component, Injector } from '@angular/core';
import { AbstractKubernetesEntryRendererComponent } from '../../../../../content/environments/operation/abstract-kubernetes-entry-renderer.component';
import { ActivatedRoute, Params } from '@angular/router';
import { map } from 'rxjs/operators';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  templateUrl: './roles-entry-renderer.component.html'
})
export class RolesEntryRendererComponent extends AbstractKubernetesEntryRendererComponent {
  public actions = [
    {
      function: 'details',
      name: 'Details'
    }
  ];

  private activeTab: string;

  constructor(protected injector: Injector, private route: ActivatedRoute) {
    super(injector);
    this.route.queryParamMap
      .pipe(map((params: Params) => params.params))
      .subscribe(paramsMap => {
        this.activeTab = paramsMap.tab;
      });
  }

  public navigateToDetails(roleName) {
    if (this.activeTab === 'roles') {
      LuigiClient.linkManager()
        .fromContext('permissions')
        .navigate(`roles/${roleName}`);
    } else {
      LuigiClient.linkManager().navigate(
        `/home/settings/global-permissions/roles/${roleName}`
      );
    }
  }
}
