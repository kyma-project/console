import { RemoteEnvironment } from '../../../shared/datamodel/k8s/kyma-api/remote-environment';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { RemoteEnvironmentsEntryRendererComponent } from './remote-environments-entry-renderer/remote-environments-entry-renderer.component';
import { RemoteEnvironmentsHeaderRendererComponent } from './remote-environments-header-renderer/remote-environments-header-renderer.component';
import { CurrentEnvironmentService } from '../../environments/services/current-environment.service';
import { AbstractKubernetesElementListComponent } from '../../environments/operation/abstract-kubernetes-element-list.component';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Filter } from '@kyma-project/y-generic-list';
import { GraphQLDataProvider } from '../../environments/operation/graphql-data-provider';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';
import { CreateRemoteEnvironmentModalComponent } from './create-remote-environment-modal/create-remote-environment-modal.component';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-remote-environments',
  templateUrl: './remote-environments.component.html',
  styleUrls: ['./remote-environments.component.scss'],
  host: { class: 'sf-content' }
})
export class RemoteEnvironmentsComponent extends AbstractKubernetesElementListComponent {
  title = 'Applications';
  emptyListText = 'It looks like you don’t have any Applications yet.';
  createNewElementText = 'Add Application';
  baseUrl = AppConfig.k8sApiServerUrl_remoteenvs;
  resourceKind = 'Application';
  environments = [];
  ariaExpanded = false;
  ariaHidden = true;
  public hideFilter = true;

  @ViewChild('createModal') createModal: CreateRemoteEnvironmentModalComponent;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);

    const query = `query {
      applications{
        name
        status
        enabledInNamespaces,
        labels
      }
    }`;

    this.source = new GraphQLDataProvider(
      AppConfig.graphqlApiUrl,
      query,
      undefined,
      this.graphQLClientService
    );

    this.entryRenderer = RemoteEnvironmentsEntryRendererComponent;
    this.headerRenderer = RemoteEnvironmentsHeaderRendererComponent;
    this.filterState = { filters: [new Filter('name', '', false)] };
  }

  getResourceUrl(kind: string, entry: any): string {
    return `${this.baseUrl}${entry.name}`;
  }

  navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`details/${entry.name}`);
  }

  toggleDropDown() {
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  public openModal() {
    this.createModal.show();
  }
}
