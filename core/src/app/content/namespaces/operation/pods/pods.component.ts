import { AppConfig } from './../../../../app.config';
import { WindowTitleService } from 'shared/services/window-title.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractGraphqlElementListComponent } from '../abstract-graphql-element-list.component';
import { PodsEntryRendererComponent } from './pods-entry-renderer/pods-entry-renderer.component';
import { PodsHeaderRendererComponent } from './pods-header-renderer/pods-header-renderer.component';

import * as luigiClient from '@luigi-project/client';
import { GraphQLClientService } from 'shared/services/graphql-client-service';


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
    changeDetector: ChangeDetectorRef,
    titleService: WindowTitleService
  ) {
    super(
      currentNamespaceService,
      commService,
      graphQLClientService,
      changeDetector
    );
    titleService.set(this.title);
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
      const query = `{namespace="${this.currentNamespaceId}", pod="${entry.name}"}`;
      window.open(this.createGrafanaLink(query), '_blank');
    };
    return handler;
  }

  createGrafanaLink(query: any, options = {
    from: 'now-1h',
    to: 'now',
    dataSource: 'Loki',
    mode: 'Logs',
  }): string {
    const queryParameters = { expr: query };
    const { from, to, dataSource, mode } = options;
    const parameters = [
      from,
      to,
      dataSource,
      queryParameters,
      { mode },
      { ui: [true, true, true, 'none'] },
    ];
    return `https://grafana.${AppConfig.domain}/explore?left=${JSON.stringify(
      parameters,
    )}`;

  }
}
