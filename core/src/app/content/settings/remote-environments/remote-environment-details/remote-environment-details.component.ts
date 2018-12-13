import { RemoteEnvironmentBindingService } from './remote-environment-binding-service';
import { ComponentCommunicationService } from './../../../../shared/services/component-communication.service';
import { RemoteEnvironmentsService } from './../services/remote-environments.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditBindingsModalComponent } from './edit-bindings-modal/edit-binding-modal.component';

import * as _ from 'lodash';
import { InformationModalComponent } from '../../../../shared/components/information-modal/information-modal.component';
import { Copy2ClipboardModalComponent } from '../../../../shared/components/copy2clipboard-modal/copy2clipboard-modal.component';
import { EditRemoteEnvironmentModalComponent } from '../edit-remote-environment-modal/edit-remote-environment-modal.component';

@Component({
  selector: 'app-remote-environment-details',
  templateUrl: './remote-environment-details.component.html',
  styleUrls: ['./remote-environment-details.component.scss']
})
export class RemoteEnvironmentDetailsComponent implements OnInit, OnDestroy {
  public currentREnvId = '';
  public transformedLabels: string[];
  private sub: any;
  private prettyStatus = '';
  remoteEnvironment: any;
  connectorServiceUrl: string;
  connectorServiceError: string;

  private actions = [
    {
      function: 'unbind',
      name: 'Unbind'
    }
  ];
  private boundEnvironments = [];

  entryEventHandler = this.getEntryEventHandler();
  @ViewChild('editbindingsmodal') editbindingsmodal: EditBindingsModalComponent;
  @ViewChild('fetchModal') fetchModal: Copy2ClipboardModalComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;
  @ViewChild('editRemoteEnvModal')
  editRemoteEnvModal: EditRemoteEnvironmentModalComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private communication: ComponentCommunicationService,
    private remoteEnvironmentBindingService: RemoteEnvironmentBindingService
  ) {
    this.remoteEnvironmentBindingService = remoteEnvironmentBindingService;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.currentREnvId = params['id'];
      this.getRemoteEnv();
    });

    this.communication.observable$.subscribe(data => {
      const response: any = data;

      if (
        response.data &&
        !_.isEmpty(response.data) &&
        response.data.enableRemoteEnvironment &&
        response.data.enableRemoteEnvironment.environment
      ) {
        this.boundEnvironments.push(
          response.data.enableRemoteEnvironment.environment
        );
      }

      if (response.type === 'updateResource') {
        this.getRemoteEnv();
      }
    });

    this.remoteEnvironmentsService
      .getConnectorServiceUrl(this.currentREnvId)
      .subscribe(
        res => {
          res
            ? (this.connectorServiceUrl = res.connectorService.url)
            : (this.connectorServiceError =
                'There is no URL available to connect your external systems to the Application');
        },
        err => {
          this.connectorServiceError = err;
        }
      );
  }

  public getRemoteEnv() {
    this.remoteEnvironmentsService
      .getRemoteEnvironment(this.currentREnvId)
      .subscribe(
        data => {
          if (data && data.remoteEnvironment) {
            this.remoteEnvironment = data.remoteEnvironment;
            this.transformedLabels = this.getTransformedLabels(
              this.remoteEnvironment.labels
            );
            this.boundEnvironments =
              data.remoteEnvironment.enabledInEnvironments;
            this.prettyStatus = this.remoteEnvironmentsService.printPrettyConnectionStatus(
              data.remoteEnvironment.status
            );
          } else {
            this.goBack();
          }
        },
        err => {
          this.infoModal.show('Error', err);
        }
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openEditBindingsModal() {
    this.editbindingsmodal.show();
  }

  getEntryEventHandler() {
    return {
      unbind: (entry: any) => {
        this.remoteEnvironmentBindingService
          .unbind(entry, this.currentREnvId)
          .subscribe(
            data => {
              const response: any = data;
              this.boundEnvironments = _.without(
                this.boundEnvironments,
                response.disableRemoteEnvironment.environment
              );
            },
            err => {
              this.infoModal.show('Error', err);
            }
          );
      }
    };
  }

  private fetchUrl() {
    this.connectorServiceUrl
      ? this.fetchModal.show(
          'URL to connect Application',
          this.connectorServiceUrl,
          `Copy the following URL and use it at the external system that you would like to connect to:`
        )
      : this.infoModal.show('Error', this.connectorServiceError);
  }

  goBack() {
    this.router.navigate(['home/settings/remoteEnvs']);
  }

  hasType(entries, type) {
    return _.some(entries, { type });
  }

  public determineClass(entry) {
    return this.remoteEnvironmentsService.determineClass(entry);
  }

  public getTransformedLabels(labels): string[] {
    if (!labels) {
      return [];
    }
    return Object.entries(labels).map(([key, value]) => key + ':' + value);
  }

  public openEditRemoteEnvModal() {
    this.editRemoteEnvModal.show();
  }
}
