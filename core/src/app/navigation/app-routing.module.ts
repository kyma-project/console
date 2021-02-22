import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NamespacesContainerComponent } from '../content/namespaces/namespaces-container/namespaces-container.component';
import { DeploymentsComponent } from '../content/namespaces/operation/deployments/deployments.component';
import { ReplicaSetsComponent } from '../content/namespaces/operation/replica-sets/replica-sets.component';
import { ServiceBrokersComponent } from '../content/settings/service-brokers/service-brokers.component';

import { ConfigMapsComponent } from '../content/namespaces/operation/configmaps/configmaps.component';
import { StatusLabelComponent } from 'shared/components/status-label/status-label.component';

const appRoutes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: 'preload',
        component: StatusLabelComponent
      },
      {
        path: 'namespaces',
        component: NamespacesContainerComponent,
        data: { navCtx: 'namespace' },
        children: [{ path: '', redirectTo: 'workspace', pathMatch: 'full' }]
      },
      {
        path: 'namespaces/:namespaceId',
        component: NamespacesContainerComponent,
        data: { navCtx: 'namespace' },
        children: [
          { path: 'deployments', component: DeploymentsComponent },
          { path: 'replicaSets', component: ReplicaSetsComponent },
          { path: 'configmaps', component: ConfigMapsComponent },
          { path: '', redirectTo: 'details', pathMatch: 'full' },
          { path: '**', redirectTo: 'details', pathMatch: 'full' }
        ]
      },
      {
        path: 'settings',
        component: NamespacesContainerComponent,
        data: { navCtx: 'settings' },
        children: [
<<<<<<< HEAD
          { path: 'yVirtual', component: PreferencesComponent },
          { path: 'preferences', component: PreferencesComponent },
=======
          { path: 'apps', component: ApplicationsComponent },
          {
            path: 'apps/:id',
            component: ApplicationDetailsComponent
          },
>>>>>>> a6818c13a4ac2be0e67742de286bba4122903f42
          { path: 'serviceBrokers', component: ServiceBrokersComponent },
        ]
      },
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
