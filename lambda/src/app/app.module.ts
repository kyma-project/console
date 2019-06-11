import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ListModule } from 'app/generic-list/list.module';
import { AppComponent } from './app.component';
import { LambdasComponent } from './lambdas/list/lambdas.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { LambdasEntryRendererComponent } from './lambdas/list/lambdas-entry-renderer/lambdas-entry-renderer.component';
import { LambdasHeaderRendererComponent } from './lambdas/list/lambdas-header-renderer/lambdas-header-renderer.component';
import { LambdaEnvComponent } from './lambdas/lambda-details/lambda-env/lambda-env.component';
import { LambdaInstanceBindingsComponent } from './lambdas/lambda-details/lambda-instance-bindings/lambda-instance-bindings.component';
import { LambdaInstanceBindingCreatorComponent } from './lambdas/lambda-details/lambda-instance-bindings/lambda-instance-binding-creator/lambda-instance-binding-creator.component';

import { TimeAgoPipe } from 'time-ago-pipe';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LambdaDetailsService } from './lambdas/lambda-details/lambda-details.service';
import { AceEditorModule } from 'ng2-ace-editor';
import { RouterModule, Routes } from '@angular/router';
import { LambdaDetailsComponent } from './lambdas/lambda-details/lambda-details.component';
import { DeploymentDetailsService } from './lambdas/list/deployment-details.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { ApisService } from './apis/apis.service';
import { FetchTokenModalComponent } from './fetch-token-modal/fetch-token-modal.component';
import { ServiceBindingUsagesService } from './service-binding-usages/service-binding-usages.service';
import { ServiceBindingsService } from './service-bindings/service-bindings.service';
import { CoreServicesService } from './core-services/core-services.service';

import { ServiceInstancesService } from './service-instances/service-instances.service';
import { EventActivationsService } from './event-activations/event-activations.service';
import { GraphqlClientService } from './graphql-client/graphql-client.service';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { EventTriggerChooserComponent } from './lambdas/lambda-details/event-trigger-chooser/event-trigger-chooser.component';
import { HttpTriggerComponent } from './lambdas/lambda-details/http-trigger/http-trigger.component';
import { LabelsInputComponent } from './shared/components/labels-input/labels-input.component';

import { FundamentalNgxModule } from 'fundamental-ngx';
import { EmptyComponent } from './shared/components/empty/empty.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

import { ContainerInstancesService } from './container-instances/container-instances.service';

const routes: Routes = [
  { path: '', redirectTo: 'lambdas', pathMatch: 'full' },
  { path: 'lambdas', component: LambdasComponent },
  { path: 'lambdas/:name', component: LambdaDetailsComponent },
  { path: 'create', component: LambdaDetailsComponent },
  { path: 'preload', component: EmptyComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LambdasHeaderRendererComponent,
    LambdasEntryRendererComponent,
    TimeAgoPipe,
    ConfirmationModalComponent,
    LambdasComponent,
    LambdaDetailsComponent,
    LambdaEnvComponent,
    FetchTokenModalComponent,
    LambdaInstanceBindingsComponent,
    LambdaInstanceBindingCreatorComponent,
    EventTriggerChooserComponent,
    HttpTriggerComponent,
    LabelsInputComponent,
    EmptyComponent,
    NotificationComponent,
  ],

  imports: [
    BrowserModule,
    ListModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
    AceEditorModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    FundamentalNgxModule,
  ],
  providers: [
    HttpClient,
    LambdaDetailsService,
    ServiceBindingUsagesService,
    DeploymentDetailsService,
    ApisService,
    ServiceBindingsService,
    ServiceInstancesService,
    CoreServicesService,
    EventActivationsService,
    GraphqlClientService,
    SubscriptionsService,
    ContainerInstancesService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LambdasHeaderRendererComponent,
    LambdasEntryRendererComponent,
  ],
})
export class AppModule {}
