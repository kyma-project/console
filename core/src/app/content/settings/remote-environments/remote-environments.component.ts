import { RemoteEnvironment } from '../../../shared/datamodel/k8s/kyma-api/remote-environment';
import { Component, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-remote-environments',
  templateUrl:
    '../../environments/operation/kubernetes-element-list.component.html',
  styleUrls: ['./remote-environments.component.scss'],
  host: { class: 'sf-content' }
})
export class RemoteEnvironmentsComponent extends AbstractKubernetesElementListComponent {
  title = 'Remote Environments';
  emptyListText = 'It looks like you don’t have any remote environments yet.';
  createNewElementText = 'Add Remote Environment';
  baseUrl = AppConfig.k8sApiServerUrl_remoteenvs;
  resourceKind = 'RemoteEnvironment';
  environments = [];
  ariaExpanded = false;
  ariaHidden = true;
  public hideFilter = true;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, http, commService);

    // ToDo: add labels
    const query = `query {
      remoteEnvironments{
        name
        status
        enabledInEnvironments
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

  toggleDropDown() {
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }
}
