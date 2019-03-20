import { AppConfig } from './../app.config';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApisComponent } from '../content/namespaces/configuration/apis/apis.component';

import { NamespaceDetailsComponent } from '../content/namespaces/namespace-details/namespace-details.component';
import { NamespacesContainerComponent } from '../content/namespaces/namespaces-container/namespaces-container.component';
import { DeploymentsComponent } from '../content/namespaces/operation/deployments/deployments.component';
import { PodsComponent } from '../content/namespaces/operation/pods/pods.component';
import { ReplicaSetsComponent } from '../content/namespaces/operation/replica-sets/replica-sets.component';
import { SecretDetailComponent } from '../content/namespaces/operation/secrets/secret-detail/secret-detail.component';
import { SecretsComponent } from '../content/namespaces/operation/secrets/secrets.component';
import { ServiceDetailsComponent } from '../content/namespaces/operation/services/service-details/service-details.component';
import { ServicesComponent } from '../content/namespaces/operation/services/services.component';
import { OrganisationComponent } from '../content/settings/organisation/organisation.component';
import { ApplicationDetailsComponent } from '../content/settings/applications/application-details/application-details.component';
import { ApplicationsComponent } from '../content/settings/applications/applications.component';
import { ServiceBrokersComponent } from '../content/settings/service-brokers/service-brokers.component';
import { WorkspaceOverviewComponent } from '../content/workspace-overview/workspace-overview/workspace-overview.component';
import { ExposeApiComponent } from '../content/namespaces/operation/services/service-details/expose-api/expose-api.component';
import { PermissionsComponent } from '../shared/components/permissions/permissions.component';
import { RoleDetailsComponent } from '../shared/components/permissions/role-details/role-details.component';
import { IdpPresetsComponent } from '../content/settings/idp-presets/idp-presets.component';
import { ResourcesComponent } from '../content/namespaces/configuration/resources/resources.component';

import { ConfigMapsComponent } from '../content/namespaces/operation/configmaps/configmaps.component';

const appRoutes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: 'namespaces',
        component: NamespacesContainerComponent,
        data: { navCtx: 'namespace' },
        children: [
          { path: 'yVirtual', component: WorkspaceOverviewComponent },
          { path: 'workspace', component: WorkspaceOverviewComponent },
          { path: '', redirectTo: 'workspace', pathMatch: 'full' }
        ]
      },
      {
        path: 'namespaces/:namespaceId',
        component: NamespacesContainerComponent,
        data: { navCtx: 'namespace' },
        children: [
          { path: 'yVirtual', component: NamespaceDetailsComponent },
          { path: 'details', component: NamespaceDetailsComponent },
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
        component: NamespacesContainerComponent,
        data: { navCtx: 'settings' },
        children: [
          { path: 'yVirtual', component: OrganisationComponent },
          { path: 'organisation', component: OrganisationComponent },
          { path: 'apps', component: ApplicationsComponent },
          {
            path: 'apps/:id',
            component: ApplicationDetailsComponent
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
