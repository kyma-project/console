import { Application } from '../../../shared/datamodel/k8s/kyma-api/application';
import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ApplicationsEntryRendererComponent } from './applications-entry-renderer/applications-entry-renderer.component';
import { ApplicationsHeaderRendererComponent } from './applications-header-renderer/applications-header-renderer.component';
import { CurrentNamespaceService } from '../../namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { CreateApplicationModalComponent } from './create-application-modal/create-application-modal.component';
import LuigiClient from '@luigi-project/client';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from 'namespaces/operation/abstract-graphql-element-list.component';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html'
})
export class ApplicationsComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy, OnInit {
  title = 'Applications/Systems';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(
    this.title,
    { headerTitle: true, namespaceSuffix: false }
  );
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
        enabledMappingServices {
          namespace
          allServices
          services {
            id
            displayName
            exist
          }
        }
        labels
      }
    }`;
  }

  getGraphqlSubscriptionsForList() {
    return `subscription Application {
      applicationEvent {
        application {
          name
          status
          enabledMappingServices {
            namespace
            allServices
            services {
              id
              displayName
              exist
            }
          }
          labels
        }
        type
      }
    }`;
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
  public ngOnInit() {
    super.ngOnInit();
  }
}
