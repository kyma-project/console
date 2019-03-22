import { Component, Injector, ApplicationRef } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

import { AbstractTableEntryRendererComponent } from 'app/generic-list';
import { AppConfig } from '../../../app.config';
import { IDeploymentStatus } from '../../../shared/datamodel/k8s/deployment';

@Component({
  selector: 'app-lambdas-entry-renderer',
  templateUrl: './lambdas-entry-renderer.component.html',
  styleUrls: ['./lambdas-entry-renderer.component.scss'],
})
export class LambdasEntryRendererComponent extends AbstractTableEntryRendererComponent {
  public statusText: string;
  public status: boolean;
  public functionMetrics: string;

  actions = [
    {
      function: 'delete',
      name: 'Delete',
    },
    {
      function: 'showLogs',
      name: 'Show Logs',
    },
  ];

  constructor(private appRef: ApplicationRef, protected injector: Injector) {
    super(injector);
    this.entry.functionStatus.subscribe(status => {
      this.statusText = this.getStatus(status);
      this.status = this.isStatusOk(status);
      appRef.tick();
    });
    this.functionMetrics = this.getFunctionMetricsUrl(this.entry);
  }

  getTrigger(entry) {
    if (entry.spec.topic) {
      return entry.spec.topic;
    } else if (entry.spec.type && entry.spec.type.toUpperCase() === 'HTTP') {
      return entry.spec.type;
    }
    return '-';
  }

  isStatusOk(functionStatus: IDeploymentStatus) {
    if (
      functionStatus != null &&
      functionStatus.readyReplicas !== undefined &&
      functionStatus.readyReplicas > 0
    ) {
      return true;
    }
    return false;
  }

  getStatus(functionStatus: IDeploymentStatus) {
    if (functionStatus != null) {
      if (functionStatus.readyReplicas !== undefined) {
        return `${functionStatus.readyReplicas}/${functionStatus.replicas}`;
      }
      return `0/${functionStatus.replicas ? functionStatus.replicas : 0}`;
    }
    return;
  }

  goToDetails(entry) {
    LuigiClient.linkManager().navigate(`details/${entry}`);
  }

  getFunctionMetricsUrl(entry) {
    const url = `${
      AppConfig.metricsUrl
    }d/opc3b8Tyik/lambda-dashboard?refresh=30s&orgId=1&var-source=All&var-environment=${
      entry.metadata.namespace
    }&var-lambda_service=${entry.metadata.name}`;

    return url;
  }
}
