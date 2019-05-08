import { Application } from '../../../shared/datamodel/k8s/kyma-api/application';
import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { ApplicationsEntryRendererComponent } from './applications-entry-renderer/applications-entry-renderer.component';
import { ApplicationsHeaderRendererComponent } from './applications-header-renderer/applications-header-renderer.component';
import { CurrentNamespaceService } from '../../namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { CreateApplicationModalComponent } from './create-application-modal/create-application-modal.component';
import LuigiClient from '@kyma-project/luigi-client';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from 'namespaces/operation/abstract-graphql-element-list.component';	
import { AppConfig } from '../../../app.config';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent extends AbstractGraphqlElementListComponent 
  implements OnDestroy {
  title = 'Applications';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title, { headerTitle: true, namespaceSuffix: false });
  createNewElementText = 'Add Application';
  resourceKind = 'Application';
  namespaces = [];
  public hideFilter = true;
  private contextListenerId: string;
  public isReadOnly = false;


  public entryRenderer = ApplicationsEntryRendererComponent;
  public headerRenderer = ApplicationsHeaderRendererComponent;

  @ViewChild('createModal') createModal: CreateApplicationModalComponent;

  constructor(
    currentNamespaceService: CurrentNamespaceService,
    commService: ComponentCommunicationService,
    graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentNamespaceService,
      commService,
      graphQLClientService,
      changeDetector
    );

    this.contextListenerId = LuigiClient.addContextUpdateListener(context => {
      if (context.settings) {
        this.isReadOnly = context.settings.readOnly;
      }
    });
  }

  getGraphqlQueryForList() {
    return `query Applications{
      applications {
        name
        status
        enabledInNamespaces,
        labels
      }
    }`
  }
  
  getGraphqlSubscriptionsForList() {
    return `subscription Application {
      applicationEvent {
        application {
          name
          status
          enabledInNamespaces,
          labels
        }
        type
      }
    }`
  }

  navigateToDetails(entry) {
    LuigiClient.linkManager().navigate(`details/${entry.name}`);
  }

  public openModal() {
    this.createModal.show();
  }

  ngOnDestroy() {
    LuigiClient.removeContextUpdateListener(this.contextListenerId);
    super.ngOnDestroy();
  }
}
