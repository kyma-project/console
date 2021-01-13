import { ApplicationBindingService } from './content/settings/applications/application-details/application-binding-service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { EventService } from './content/settings/applications/application-details/services/event.service';
import { ApplicationsService } from './content/settings/applications/services/applications.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './navigation/app-routing.module';

import { TokenInterceptor } from './auth/token.interceptor';

import { SortablejsModule } from 'angular-sortablejs';
import { NamespacesContainerComponent } from './content/namespaces/namespaces-container/namespaces-container.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ListModule } from 'app/generic-list/list.module';

import { CurrentNamespaceService } from './content/namespaces/services/current-namespace.service';
import { NamespacesService } from './content/namespaces/services/namespaces.service';

import { TimeAgoPipe } from 'time-ago-pipe';
import { DeploymentEntryRendererComponent } from './content/namespaces/operation/deployments/deployment-entry-renderer/deployment-entry-renderer.component';
import { DeploymentHeaderRendererComponent } from './content/namespaces/operation/deployments/deployment-header-renderer/deployment-header-renderer.component';
import { DeploymentsComponent } from './content/namespaces/operation/deployments/deployments.component';
import { PodsEntryRendererComponent } from './content/namespaces/operation/pods/pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './content/namespaces/operation/pods/pods-header-renderer/pods-header-renderer.component';
import { PodsComponent } from './content/namespaces/operation/pods/pods.component';
import { ReplicaSetsEntryRendererComponent } from './content/namespaces/operation/replica-sets/replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './content/namespaces/operation/replica-sets/replica-sets-header-renderer/replica-sets-header-renderer.component';
import { ReplicaSetsComponent } from './content/namespaces/operation/replica-sets/replica-sets.component';
import { PreferencesComponent } from './content/settings/preferences/preferences.component';
import { EditBindingsModalComponent } from './content/settings/applications/application-details/edit-bindings-modal/edit-binding-modal.component';
import { BindingsDetailsModalComponent } from './content/settings/applications/application-details/bindings-details-modal/bindings-details-modal.component';
import { CreateBindingsModalComponent } from './content/settings/applications/application-details/create-bindings-modal/create-binding-modal.component';
import { ApplicationDetailsComponent } from './content/settings/applications/application-details/application-details.component';
import { ApplicationsEntryRendererComponent } from './content/settings/applications/applications-entry-renderer/applications-entry-renderer.component';
import { ApplicationsHeaderRendererComponent } from './content/settings/applications/applications-header-renderer/applications-header-renderer.component';
import { ApplicationsComponent } from './content/settings/applications/applications.component';
import { ServiceBrokersComponent } from './content/settings/service-brokers/service-brokers.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { EditResourceComponent } from './shared/components/edit-resource/edit-resource.component';
import { InformationModalComponent } from './shared/components/information-modal/information-modal.component';
import { JsonEditorModalComponent } from './shared/components/json-editor-modal/json-editor-modal.component';
import { JsonEditorComponent } from './shared/components/json-editor-modal/json-editor/json-editor.component';
import { K8sResourceEditorService } from './shared/components/json-editor-modal/services/k8s-resource-editor.service';
import { ComponentCommunicationService } from './shared/services/component-communication.service';
import { GraphQLClientService } from './shared/services/graphql-client-service';
import { LuigiClientService } from './shared/services/luigi-client.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AbstractKubernetesElementListComponent } from './content/namespaces/operation/abstract-kubernetes-element-list.component';
import { ServiceBrokerHeaderRendererComponent } from './content/settings/service-brokers/services-header-renderer/service-broker-header-renderer.component';
import { ServiceBrokerEntryRendererComponent } from './content/settings/service-brokers/services-entry-renderer/service-broker-entry-renderer.component';
import { Copy2ClipboardModalComponent } from './shared/components/copy2clipboard-modal/copy2clipboard-modal.component';
import { CreateApplicationModalComponent } from './content/settings/applications/create-application-modal/create-application-modal.component';
import { EditApplicationModalComponent } from './content/settings/applications/edit-application-modal/edit-application-modal.component';
import { LabelsInputComponent } from './shared/components/labels-input/labels-input.component';
import { ConfigMapsComponent } from './content/namespaces/operation/configmaps/configmaps.component';
import { ConfigMapsEntryRendererComponent } from './content/namespaces/operation/configmaps/configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './content/namespaces/operation/configmaps/configmaps-header-renderer/configmaps-header-renderer.component';
import { StatusLabelComponent } from './shared/components/status-label/status-label.component';
import { TooltipComponent } from './shared/components/tooltip/tooltip.component';
import { LuigiClientCommunicationDirective } from './shared/directives/luigi-client-communication/luigi-client-communication.directive';
import { FilterAllOnSelectedDirective } from './shared/directives/filter-all-on-selected/filter-all-on-selected.directive';

import { FundamentalNgxModule } from 'fundamental-ngx';
import { GraphqlMutatorModalComponent } from 'shared/components/json-editor-modal/graphql-mutator-modal.component';
import { AbstractGraphqlElementListComponent } from 'namespaces/operation/abstract-graphql-element-list.component';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { AppConfig } from './app.config';
import { WebSocketLink } from './ws';
import { GenericHelpersService } from './shared/services/generic-helpers.service';
import { UrlLinkComponent } from 'shared/components/url-link/url-link.component';

import * as LuigiClient from '@luigi-project/client';
import { WindowTitleService } from 'shared/services/window-title.service';

@NgModule({
  declarations: [
    AppComponent,
    NamespacesContainerComponent,
    DeploymentsComponent,
    PodsComponent,
    TimeAgoPipe,
    ApplicationsComponent,
    ApplicationDetailsComponent,
    PreferencesComponent,
    ServiceBrokersComponent,
    ReplicaSetsComponent,
    ConfigMapsComponent,
    InformationModalComponent,
    ConfirmationModalComponent,
    ReplicaSetsEntryRendererComponent,
    ReplicaSetsHeaderRendererComponent,
    DeploymentHeaderRendererComponent,
    DeploymentEntryRendererComponent,
    PodsHeaderRendererComponent,
    PodsEntryRendererComponent,
    ConfigMapsEntryRendererComponent,
    ConfigMapsHeaderRendererComponent,
    EditBindingsModalComponent,
    BindingsDetailsModalComponent,
    CreateBindingsModalComponent,
    ApplicationsHeaderRendererComponent,
    ApplicationsEntryRendererComponent,
    JsonEditorModalComponent,
    GraphqlMutatorModalComponent,
    JsonEditorComponent,
    EditResourceComponent,
    Copy2ClipboardModalComponent,
    AbstractKubernetesElementListComponent,
    AbstractGraphqlElementListComponent,
    ServiceBrokerEntryRendererComponent,
    ServiceBrokerHeaderRendererComponent,

    CreateApplicationModalComponent,
    EditApplicationModalComponent,
    LabelsInputComponent,
    StatusLabelComponent,
    TooltipComponent,
    LuigiClientCommunicationDirective,
    FilterAllOnSelectedDirective,
    UrlLinkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SortablejsModule,
    ListModule,
    ClipboardModule,
    ClickOutsideModule,
    FundamentalNgxModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    NamespacesService,
    CurrentNamespaceService,
    ApplicationsService,
    EventService,
    K8sResourceEditorService,
    ComponentCommunicationService,
    ApplicationBindingService,
    GraphQLClientService,
    LuigiClientService,
    GenericHelpersService,
    WindowTitleService
  ],
  entryComponents: [
    ReplicaSetsEntryRendererComponent,
    ReplicaSetsHeaderRendererComponent,
    DeploymentEntryRendererComponent,
    DeploymentHeaderRendererComponent,
    PodsHeaderRendererComponent,
    PodsEntryRendererComponent,
    ConfigMapsEntryRendererComponent,
    ConfigMapsHeaderRendererComponent,
    ApplicationsHeaderRendererComponent,
    ApplicationsEntryRendererComponent,
    ServiceBrokerHeaderRendererComponent,
    ServiceBrokerEntryRendererComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    let apolloClientInitialized = false;

    LuigiClient.addContextUpdateListener(e => {
      if (e.idToken && !apolloClientInitialized) {
        // Create an http link:
        const http = httpLink.create({
          uri: AppConfig.graphqlApiUrl
        });

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          uri: AppConfig.subscriptionsApiUrl,
          options: {
            reconnect: true
          }
        });

        const link = split(
          // split based on operation type
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          ws,
          http
        );

        apollo.create({
          link,
          cache: new InMemoryCache()
        });

        apolloClientInitialized = true;
      }
    });
  }
}
