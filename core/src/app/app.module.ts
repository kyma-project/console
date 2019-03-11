import { RbacService } from './shared/services/rbac.service';
import { RemoteEnvironmentBindingService } from './content/settings/remote-environments/remote-environment-details/remote-environment-binding-service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { ApisComponent } from './content/environments/configuration/apis/apis.component';
import { FilteredApisComponent } from './content/environments/configuration/apis/filtered-apis/filtered-apis.component';
import { EventService } from './content/settings/remote-environments/remote-environment-details/services/event.service';
import { RemoteEnvironmentsService } from './content/settings/remote-environments/services/remote-environments.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './navigation/app-routing.module';

import { TokenInterceptor } from './auth/token.interceptor';

import { SortablejsModule } from 'angular-sortablejs';
import { EnvironmentsContainerComponent } from './content/environments/environments-container/environments-container.component';
import { WorkspaceOverviewComponent } from './content/workspace-overview/workspace-overview/workspace-overview.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ListModule } from 'app/generic-list/list.module';
import { EnvironmentCreateComponent } from './content/environments/environment-create/environment-create.component';
import { CurrentEnvironmentService } from './content/environments/services/current-environment.service';
import { EnvironmentsService } from './content/environments/services/environments.service';
import { EnvironmentCardComponent } from './content/workspace-overview/environment-card/environment-card.component';

import { TimeAgoPipe } from 'time-ago-pipe';
import { ApiDefinitionEntryRendererComponent } from './content/environments/configuration/apis/api-definition-entry-renderer/api-definition-entry-renderer.component';
import { ApiDefinitionHeaderRendererComponent } from './content/environments/configuration/apis/api-definition-header-renderer/api-definition-header-renderer.component';
import { FilteredApisEntryRendererComponent } from './content/environments/configuration/apis/filtered-apis/filtered-apis-entry-renderer/filtered-apis-entry-renderer.component';
import { FilteredApisHeaderRendererComponent } from './content/environments/configuration/apis/filtered-apis/filtered-apis-header-renderer/filtered-apis-header-renderer.component';
import { EnvironmentDetailsComponent } from './content/environments/environment-details/environment-details.component';
import { DeploymentEntryRendererComponent } from './content/environments/operation/deployments/deployment-entry-renderer/deployment-entry-renderer.component';
import { DeploymentHeaderRendererComponent } from './content/environments/operation/deployments/deployment-header-renderer/deployment-header-renderer.component';
import { DeploymentsComponent } from './content/environments/operation/deployments/deployments.component';
import { PodsEntryRendererComponent } from './content/environments/operation/pods/pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './content/environments/operation/pods/pods-header-renderer/pods-header-renderer.component';
import { PodsComponent } from './content/environments/operation/pods/pods.component';
import { ReplicaSetsEntryRendererComponent } from './content/environments/operation/replica-sets/replica-sets-entry-renderer/replica-sets-entry-renderer.component';
import { ReplicaSetsHeaderRendererComponent } from './content/environments/operation/replica-sets/replica-sets-header-renderer/replica-sets-header-renderer.component';
import { ReplicaSetsComponent } from './content/environments/operation/replica-sets/replica-sets.component';
import { SecretDetailComponent } from './content/environments/operation/secrets/secret-detail/secret-detail.component';
import { SecretsEntryRendererComponent } from './content/environments/operation/secrets/secrets-entry-renderer/secrets-entry-renderer.component';
import { SecretsHeaderRendererComponent } from './content/environments/operation/secrets/secrets-header-renderer/secrets-header-renderer.component';
import { SecretsComponent } from './content/environments/operation/secrets/secrets.component';
import { ExposeApiComponent } from './content/environments/operation/services/service-details/expose-api/expose-api.component';
import { ExposeApiService } from './content/environments/operation/services/service-details/expose-api/expose-api.service';
import { ServiceDetailsComponent } from './content/environments/operation/services/service-details/service-details.component';
import { ServicesEntryRendererComponent } from './content/environments/operation/services/services-entry-renderer/services-entry-renderer.component';
import { ServicesHeaderRendererComponent } from './content/environments/operation/services/services-header-renderer/services-header-renderer.component';
import { ServicesComponent } from './content/environments/operation/services/services.component';
import { OrganisationComponent } from './content/settings/organisation/organisation.component';
import { EditBindingsModalComponent } from './content/settings/remote-environments/remote-environment-details/edit-bindings-modal/edit-binding-modal.component';
import { RemoteEnvironmentDetailsComponent } from './content/settings/remote-environments/remote-environment-details/remote-environment-details.component';
import { RemoteEnvironmentsEntryRendererComponent } from './content/settings/remote-environments/remote-environments-entry-renderer/remote-environments-entry-renderer.component';
import { RemoteEnvironmentsHeaderRendererComponent } from './content/settings/remote-environments/remote-environments-header-renderer/remote-environments-header-renderer.component';
import { RemoteEnvironmentsComponent } from './content/settings/remote-environments/remote-environments.component';
import { ServiceBrokersComponent } from './content/settings/service-brokers/service-brokers.component';
import { ConfirmationModalComponent } from './shared/components/confirmation-modal/confirmation-modal.component';
import { EditResourceComponent } from './shared/components/edit-resource/edit-resource.component';
import { InformationModalComponent } from './shared/components/information-modal/information-modal.component';
import { JsonEditorModalComponent } from './shared/components/json-editor-modal/json-editor-modal.component';
import { JsonEditorComponent } from './shared/components/json-editor-modal/json-editor/json-editor.component';
import { K8sResourceEditorService } from './shared/components/json-editor-modal/services/k8s-resource-editor.service';
import { ResourceUploaderComponent } from './shared/components/resource-uploader/resource-uploader-component/resource-uploader.component';
import { ResourceUploaderModalComponent } from './shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';
import { ResourceUploadService } from './shared/components/resource-uploader/services/resource-upload.service';
import { UploaderComponent } from './shared/components/resource-uploader/uploader/uploader.component';
import { ComponentCommunicationService } from './shared/services/component-communication.service';
import { RoleBindingModalComponent } from './shared/components/role-binding-modal/role-binding-modal.component';
import { GraphQLClientService } from './shared/services/graphql-client-service';
import { LuigiClientService } from './shared/services/luigi-client.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { PermissionsComponent } from './shared/components/permissions/permissions.component';
import { RolesComponent } from './shared/components/permissions/roles/roles.component';
import { RoleDetailsComponent } from './shared/components/permissions/role-details/role-details.component';
import { RolesEntryRendererComponent } from './shared/components/permissions/roles/roles-entry-renderer/roles-entry-renderer.component';
import { RolesHeaderRendererComponent } from './shared/components/permissions/roles/roles-header-renderer/roles-header-renderer.component';
import { BindingsComponent } from './shared/components/permissions/bindings/bindings.component';
import { BindingEntryRendererComponent } from './shared/components/permissions/bindings/binding-entry-renderer/binding-entry-renderer.component';
import { BindingHeaderRendererComponent } from './shared/components/permissions/bindings/binding-header-renderer/binding-header-renderer.component';
import { AbstractKubernetesElementListComponent } from './content/environments/operation/abstract-kubernetes-element-list.component';
import { ServiceBrokerHeaderRendererComponent } from './content/settings/service-brokers/services-header-renderer/service-broker-header-renderer.component';
import { ServiceBrokerEntryRendererComponent } from './content/settings/service-brokers/services-entry-renderer/service-broker-entry-renderer.component';
import { IdpPresetsComponent } from './content/settings/idp-presets/idp-presets.component';
import { IdpPresetsEntryRendererComponent } from './content/settings/idp-presets/idp-presets-entry-renderer/idp-presets-entry-renderer.component';
import { IdpPresetsHeaderRendererComponent } from './content/settings/idp-presets/idp-presets-header-renderer/idp-presets-header-renderer.component';
import { CreatePresetModalComponent } from './content/settings/idp-presets/create-preset-modal/create-preset-modal.component';
import { IdpPresetsService } from './content/settings/idp-presets/idp-presets.service';
import { ResourcesComponent } from './content/environments/configuration/resources/resources.component';
import { ResourceQuotasComponent } from './content/environments/configuration/resources/resource-quotas/resource-quotas.component';
import { ResourceQuotaEntryRendererComponent } from './content/environments/configuration/resources/resource-quotas/resource-quota-entry-renderer/resource-quota-entry-renderer.component';
import { ResourceQuotaHeaderRendererComponent } from './content/environments/configuration/resources/resource-quotas/resource-quota-header-renderer/resource-quota-header-renderer.component';
import { LimitRangesComponent } from './content/environments/configuration/resources/limit-ranges/limit-ranges.component';
import { LimitRangeEntryRendererComponent } from './content/environments/configuration/resources/limit-ranges/limit-range-entry-renderer/limit-range-entry-renderer.component';
import { LimitRangeHeaderRendererComponent } from './content/environments/configuration/resources/limit-ranges/limit-range-header-renderer/limit-range-header-renderer.component';
import { Copy2ClipboardModalComponent } from './shared/components/copy2clipboard-modal/copy2clipboard-modal.component';
import { CreateRemoteEnvironmentModalComponent } from './content/settings/remote-environments/create-remote-environment-modal/create-remote-environment-modal.component';
import { EditRemoteEnvironmentModalComponent } from './content/settings/remote-environments/edit-remote-environment-modal/edit-remote-environment-modal.component';
import { LabelsInputComponent } from './shared/components/labels-input/labels-input.component';
import { ConfigMapsComponent } from './content/environments/operation/configmaps/configmaps.component';
import { ConfigMapsEntryRendererComponent } from './content/environments/operation/configmaps/configmaps-entry-renderer/configmaps-entry-renderer.component';
import { ConfigMapsHeaderRendererComponent } from './content/environments/operation/configmaps/configmaps-header-renderer/configmaps-header-renderer.component';
import { StatusLabelComponent } from './shared/components/status-label/status-label.component';
import { TooltipComponent } from './shared/components/tooltip/tooltip.component';
import { LuigiClientCommunicationDirective } from './shared/directives/luigi-client-communication/luigi-client-communication.directive';

import { FundamentalNgxModule } from 'fundamental-ngx';
import { GraphqlMutatorModalComponent } from 'shared/components/json-editor-modal/graphql-mutator-modal.component';
import { AbstractGraphqlElementListComponent } from 'environments/operation/abstract-graphql-element-list.component';

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentsContainerComponent,
    WorkspaceOverviewComponent,
    EnvironmentCreateComponent,
    EnvironmentCardComponent,
    DeploymentsComponent,
    PodsComponent,
    TimeAgoPipe,
    RemoteEnvironmentsComponent,
    RemoteEnvironmentDetailsComponent,
    OrganisationComponent,
    EnvironmentDetailsComponent,
    ServiceBrokersComponent,
    ReplicaSetsComponent,
    ServicesComponent,
    SecretsComponent,
    SecretDetailComponent,
    ConfigMapsComponent,
    InformationModalComponent,
    ConfirmationModalComponent,
    ReplicaSetsEntryRendererComponent,
    ReplicaSetsHeaderRendererComponent,
    DeploymentHeaderRendererComponent,
    DeploymentEntryRendererComponent,
    PodsHeaderRendererComponent,
    PodsEntryRendererComponent,
    SecretsEntryRendererComponent,
    SecretsHeaderRendererComponent,
    ConfigMapsEntryRendererComponent,
    ConfigMapsHeaderRendererComponent,
    ServicesHeaderRendererComponent,
    ServicesEntryRendererComponent,
    EditBindingsModalComponent,
    RemoteEnvironmentsHeaderRendererComponent,
    RemoteEnvironmentsEntryRendererComponent,
    JsonEditorModalComponent,
    GraphqlMutatorModalComponent,
    JsonEditorComponent,
    EditResourceComponent,
    ServiceDetailsComponent,
    UploaderComponent,
    ResourceUploaderModalComponent,
    ResourceUploaderComponent,
    ExposeApiComponent,
    ApisComponent,
    FilteredApisComponent,
    ApiDefinitionEntryRendererComponent,
    ApiDefinitionHeaderRendererComponent,
    FilteredApisEntryRendererComponent,
    FilteredApisHeaderRendererComponent,
    Copy2ClipboardModalComponent,
    PermissionsComponent,
    RoleDetailsComponent,
    RoleBindingModalComponent,
    RolesComponent,
    BindingsComponent,
    RolesEntryRendererComponent,
    RolesHeaderRendererComponent,
    BindingHeaderRendererComponent,
    BindingEntryRendererComponent,
    AbstractKubernetesElementListComponent,
    AbstractGraphqlElementListComponent,
    ServiceBrokerEntryRendererComponent,
    ServiceBrokerHeaderRendererComponent,
    IdpPresetsComponent,
    IdpPresetsEntryRendererComponent,
    IdpPresetsHeaderRendererComponent,
    CreatePresetModalComponent,
    ResourcesComponent,
    ResourceQuotasComponent,
    ResourceQuotaEntryRendererComponent,
    ResourceQuotaHeaderRendererComponent,
    LimitRangesComponent,
    LimitRangeEntryRendererComponent,
    LimitRangeHeaderRendererComponent,
    CreateRemoteEnvironmentModalComponent,
    EditRemoteEnvironmentModalComponent,
    LabelsInputComponent,
    StatusLabelComponent,
    TooltipComponent,
    LuigiClientCommunicationDirective
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
    FundamentalNgxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    EnvironmentsService,
    CurrentEnvironmentService,
    RemoteEnvironmentsService,
    EventService,
    K8sResourceEditorService,
    ComponentCommunicationService,
    ResourceUploadService,
    ExposeApiService,
    RemoteEnvironmentBindingService,
    RbacService,
    GraphQLClientService,
    IdpPresetsService,
    LuigiClientService
  ],
  entryComponents: [
    EnvironmentCardComponent,
    ReplicaSetsEntryRendererComponent,
    ReplicaSetsHeaderRendererComponent,
    DeploymentEntryRendererComponent,
    DeploymentHeaderRendererComponent,
    PodsHeaderRendererComponent,
    PodsEntryRendererComponent,
    SecretsHeaderRendererComponent,
    SecretsEntryRendererComponent,
    ConfigMapsEntryRendererComponent,
    ConfigMapsHeaderRendererComponent,
    ServicesHeaderRendererComponent,
    ServicesEntryRendererComponent,
    RemoteEnvironmentsHeaderRendererComponent,
    RemoteEnvironmentsEntryRendererComponent,
    ApiDefinitionEntryRendererComponent,
    ApiDefinitionHeaderRendererComponent,
    FilteredApisEntryRendererComponent,
    FilteredApisHeaderRendererComponent,
    BindingHeaderRendererComponent,
    BindingEntryRendererComponent,
    RolesHeaderRendererComponent,
    RolesEntryRendererComponent,
    ServiceBrokerHeaderRendererComponent,
    ServiceBrokerEntryRendererComponent,
    IdpPresetsHeaderRendererComponent,
    IdpPresetsEntryRendererComponent,
    ResourceQuotaEntryRendererComponent,
    ResourceQuotaHeaderRendererComponent,
    LimitRangeEntryRendererComponent,
    LimitRangeHeaderRendererComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
