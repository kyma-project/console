import { Application } from '../../../shared/datamodel/k8s/kyma-api/application';
import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { ApplicationsEntryRendererComponent } from './applications-entry-renderer/applications-entry-renderer.component';
import { ApplicationsHeaderRendererComponent } from './applications-header-renderer/applications-header-renderer.component';
import { CurrentNamespaceService } from '../../namespaces/services/current-namespace.service';
import { AbstractKubernetesElementListComponent } from '../../namespaces/operation/abstract-kubernetes-element-list.component';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Filter } from 'app/generic-list';
import { GraphQLDataProvider } from '../../namespaces/operation/graphql-data-provider';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';
import { CreateApplicationModalComponent } from './create-application-modal/create-application-modal.component';
import LuigiClient from '@kyma-project/luigi-client';
import { IEmptyListData } from 'shared/datamodel';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  title = 'Applications';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title, { headerTitle: true, namespaceSuffix: false });
  createNewElementText = 'Add Application';
  baseUrl = AppConfig.k8sApiServerUrl_applications;
  resourceKind = 'Application';
  namespaces = [];
  ariaExpanded = false;
  ariaHidden = true;
  public hideFilter = true;
  private contextListenerId: string;
  public isReadOnly = false;

  @ViewChild('createModal') createModal: CreateApplicationModalComponent;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);

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

    this.entryRenderer = ApplicationsEntryRendererComponent;
    this.headerRenderer = ApplicationsHeaderRendererComponent;
    this.filterState = { filters: [new Filter('name', '', false)] };

    this.contextListenerId = LuigiClient.addContextUpdateListener(context => {
      if (context.settings) {
        this.isReadOnly = context.settings.readOnly;
      }
    });
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

  ngOnDestroy() {
    LuigiClient.removeContextUpdateListener(this.contextListenerId);
  }
}
