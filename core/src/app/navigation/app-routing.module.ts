import { AppConfig } from './../app.config';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApisComponent } from '../content/environments/configuration/apis/apis.component';

import { EnvironmentDetailsComponent } from '../content/environments/environment-details/environment-details.component';
import { EnvironmentsContainerComponent } from '../content/environments/environments-container/environments-container.component';
import { DeploymentsComponent } from '../content/environments/operation/deployments/deployments.component';
import { PodsComponent } from '../content/environments/operation/pods/pods.component';
import { ReplicaSetsComponent } from '../content/environments/operation/replica-sets/replica-sets.component';
import { SecretDetailComponent } from '../content/environments/operation/secrets/secret-detail/secret-detail.component';
import { SecretsComponent } from '../content/environments/operation/secrets/secrets.component';
import { ServiceDetailsComponent } from '../content/environments/operation/services/service-details/service-details.component';
import { ServicesComponent } from '../content/environments/operation/services/services.component';
import { OrganisationComponent } from '../content/settings/organisation/organisation.component';
import { RemoteEnvironmentDetailsComponent } from '../content/settings/remote-environments/remote-environment-details/remote-environment-details.component';
import { RemoteEnvironmentsComponent } from '../content/settings/remote-environments/remote-environments.component';
import { ServiceBrokersComponent } from '../content/settings/service-brokers/service-brokers.component';
import { WorkspaceOverviewComponent } from '../content/workspace-overview/workspace-overview/workspace-overview.component';
import { ExposeApiComponent } from '../content/environments/operation/services/service-details/expose-api/expose-api.component';
import { PermissionsComponent } from '../shared/components/permissions/permissions.component';
import { RoleDetailsComponent } from '../shared/components/permissions/role-details/role-details.component';
import { IdpPresetsComponent } from '../content/settings/idp-presets/idp-presets.component';
import { ResourcesComponent } from '../content/environments/configuration/resources/resources.component';

import { ConfigMapsComponent } from '../content/environments/operation/configmaps/configmaps.component';

const appRoutes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: 'namespaces',
        component: EnvironmentsContainerComponent,
        data: { navCtx: 'environment' },
        children: [
          { path: 'yVirtual', component: WorkspaceOverviewComponent },
          { path: 'workspace', component: WorkspaceOverviewComponent },
          { path: '', redirectTo: 'workspace', pathMatch: 'full' }
        ]
      },
      {
        path: 'namespaces/:environmentId',
        component: EnvironmentsContainerComponent,
        data: { navCtx: 'environment' },
        children: [
          { path: 'yVirtual', component: EnvironmentDetailsComponent },
          { path: 'details', component: EnvironmentDetailsComponent },
          { path: 'workspace', component: WorkspaceOverviewComponent },
          { path: 'deployments', component: DeploymentsComponent },
          { path: 'replicaSets', component: ReplicaSetsComponent },
          { path: 'pods', component: PodsComponent },
          { path: 'services', component: ServicesComponent },
          { path: 'services/:name', component: ServiceDetailsComponent },
          {
            path: 'services/:name/apis/details/:apiName',
            component: ExposeApiComponent
          },
          { path: 'services/:name/apis/create', component: ExposeApiComponent },
          { path: 'apis', component: ApisComponent },
          { path: 'apis/details/:apiName', component: ExposeApiComponent },
          { path: 'apis/create', component: ExposeApiComponent },
          { path: 'secrets', component: SecretsComponent },
          { path: 'secrets/:name', component: SecretDetailComponent },
          { path: 'configmaps', component: ConfigMapsComponent },
          { path: 'resources', component: ResourcesComponent },
          {
            path: 'permissions',
            component: PermissionsComponent,
            data: { global: false }
          },
          {
            path: 'permissions/roles/:name',
            component: RoleDetailsComponent,
            data: { global: false }
          },
          {
            path: 'permissions/clusterRoles/:name',
            component: RoleDetailsComponent,
            data: { global: true }
          },
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: '**', redirectTo: 'details', pathMatch: 'full' }
        ]
      },
      {
        path: 'settings',
        component: EnvironmentsContainerComponent,
        data: { navCtx: 'settings' },
        children: [
          { path: 'yVirtual', component: OrganisationComponent },
          { path: 'organisation', component: OrganisationComponent },
          { path: 'apps', component: RemoteEnvironmentsComponent },
          {
            path: 'apps/:id',
            component: RemoteEnvironmentDetailsComponent
          },
          { path: 'idpPresets', component: IdpPresetsComponent },
          { path: 'serviceBrokers', component: ServiceBrokersComponent },
          {
            path: 'globalPermissions',
            component: PermissionsComponent,
            data: { global: true }
          },
          {
            path: 'globalPermissions/roles/:name',
            component: RoleDetailsComponent,
            data: { global: true }
          },
          { path: '', redirectTo: 'organisation', pathMatch: 'full' },
          { path: '**', redirectTo: 'organisation', pathMatch: 'full' }
        ]
      },
      { path: '', pathMatch: 'full', redirectTo: 'namespaces/workspace' },
      { path: '**', pathMatch: 'full', redirectTo: 'namespaces/workspace' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false,
      initialNavigation: true,
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
