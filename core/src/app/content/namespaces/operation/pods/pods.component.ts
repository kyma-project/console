import { ChangeDetectorRef, Component } from '@angular/core';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';

import * as luigiClient from '@kyma-project/luigi-client';
import { Apollo } from 'apollo-angular';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class PodsComponent extends AbstractGraphqlElementListComponent {
  public title = 'Pods';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title);
  public resourceKind = 'Pod';

  public entryRenderer = PodsEntryRendererComponent;
  public headerRenderer = PodsHeaderRendererComponent;

  constructor(
    currentNamespaceService: CurrentNamespaceService,
    commService: ComponentCommunicationService,
    apollo: Apollo,
    changeDetector: ChangeDetectorRef
  ) {
    super(
      currentNamespaceService,
      commService,
      apollo,
      changeDetector
    );
  }

  getGraphqlQueryForList() {
    return `query Pod($namespace: String!) {
      pods(namespace: $namespace) {
        name
        nodeName
        restartCount
        creationTimestamp
        labels
        status
        containerStates {
          state
          reason
          message
        }
      }
    }`;
  }

  getGraphqlSubscriptionsForList() {
    return `subscription Pod($namespace: String!) {
      podEvent(namespace: $namespace) {
        pod {
          name
          nodeName
          restartCount
          creationTimestamp
          labels
          status
          containerStates {
            state
            reason
            message
          }
        }
        type
      }
    }`;
  }

  getEntryEventHandler(): any {
    const handler = super.getEntryEventHandler();
    handler.showLogs = (entry: any) => {
      luigiClient.linkManager().withParams({pod: entry.name, namespace: this.currentNamespaceId}).openAsModal('/home/cmf-logs');
    };
    return handler;
  }

}
