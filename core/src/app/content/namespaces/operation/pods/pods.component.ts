import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';

import * as luigiClient from '@kyma-project/luigi-client';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  templateUrl: '../kubernetes-element-list.component.html'
})
export class PodsComponent extends AbstractGraphqlElementListComponent
  implements OnDestroy, OnInit {
  public title = 'Pods';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title);
  public resourceKind = 'Pod';

  public entryRenderer = PodsEntryRendererComponent;
  public headerRenderer = PodsHeaderRendererComponent;

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
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public ngOnInit() {
    super.ngOnInit();
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
      const nodeParams = { namespace: this.currentNamespaceId, splitViewMode: 'true', instance: entry.name };
      luigiClient
        .linkManager()
        .withParams(nodeParams)
        .openAsModal('/home/cmf-logs', {title: `Logs from ${entry.name}`});
    };
    return handler;
  }
}
