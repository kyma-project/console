import { ApplicationBindingService } from './application-binding-service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { ApplicationsService } from '../services/applications.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditBindingsModalComponent } from './edit-bindings-modal/edit-binding-modal.component';

import * as _ from 'lodash';
import { InformationModalComponent } from '../../../../shared/components/information-modal/information-modal.component';
import { Copy2ClipboardModalComponent } from '../../../../shared/components/copy2clipboard-modal/copy2clipboard-modal.component';
import { EditApplicationModalComponent } from '../edit-application-modal/edit-application-modal.component';
import LuigiClient from '@kyma-project/luigi-client';
import { EMPTY_TEXT} from 'shared/constants/constants';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html'
})
export class ApplicationDetailsComponent implements OnInit, OnDestroy {
  public currentAppId = '';
  public transformedLabels: string[];
  public emptyText = EMPTY_TEXT;
  private sub: any;
  private prettyStatus = '';
  application: any;

  private actions = [
    {
      function: 'unbind',
      name: 'Unbind'
    }
  ];
  private boundNamespaces = [];
  private contextListenerId: string;

  public isReadOnly = false;

  entryEventHandler = this.getEntryEventHandler();
  @ViewChild('editbindingsmodal') editbindingsmodal: EditBindingsModalComponent;
  @ViewChild('fetchModal') fetchModal: Copy2ClipboardModalComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;
  @ViewChild('editApplicationModal')
  editApplicationModal: EditApplicationModalComponent;

  constructor(
    private route: ActivatedRoute,
    private applicationsService: ApplicationsService,
    private communication: ComponentCommunicationService,
    private applicationBindingService: ApplicationBindingService
  ) {
    this.applicationBindingService = applicationBindingService;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.currentAppId = params['id'];
      this.getApplication();
    });

    this.communication.observable$.subscribe(data => {
      const response: any = data;

      if (
        response.data &&
        !_.isEmpty(response.data) &&
        response.data.enableApplication &&
        response.data.enableApplication.namespace
      ) {
        this.boundNamespaces.push(
          response.data.enableApplication.namespace
        );
      }

      if (response.type === 'updateResource') {
        this.getApplication();
      }
    });
    if (LuigiClient) {
      this.contextListenerId = LuigiClient.addContextUpdateListener(context => {
        if (context.settings) {
          this.isReadOnly = context.settings.readOnly;
        }
      });
    }
  }

  public getApplication() {
    this.applicationsService
      .getApplication(this.currentAppId)
      .subscribe(
        data => {
          if (data && data.application) {
            this.application = data.application;
            this.transformedLabels = this.getTransformedLabels(
              this.application.labels
            );
            this.boundNamespaces = data.application.enabledInNamespaces;
            this.prettyStatus = this.applicationsService.printPrettyConnectionStatus(
              data.application.status
            );
          } else {
            this.navigateToList();
          }
        },
        err => {
          this.infoModal.show('Error', err);
        }
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    if (LuigiClient) {
      LuigiClient.removeContextUpdateListener(this.contextListenerId);
    }
  }

  openEditBindingsModal() {
    this.editbindingsmodal.show();
  }

  getEntryEventHandler() {
    return {
      unbind: (entry: any) => {
        this.applicationBindingService
          .unbind(entry, this.currentAppId)
          .subscribe(
            data => {
              const response: any = data;
              this.boundNamespaces = _.without(
                this.boundNamespaces,
                response.disableApplication.namespace
              );
            },
            err => {
              this.infoModal.show('Error', err);
            }
          );
      }
    };
  }

  public showUrl() {
    this.applicationsService
      .getConnectorServiceUrl(this.currentAppId)
      .subscribe(
        res => {
          res
            ? this.fetchModal.show(
                'URL to connect Application',
                res.connectorService.url,
                'Copy the following URL and use it at the external system that you would like to connect to:'
              )
            : this.infoModal.show(
                'Error',
                'There is no URL available to connect your external systems to the Application'
              );
        },
        err => {
          this.infoModal.show('Error', err);
        }
      );
  }

  hasType(entries, type) {
    return _.some(entries, { type });
  }

  public determineClass(entry) {
    return this.applicationsService.determineClass(entry);
  }

  public getTransformedLabels(labels): string[] {
    if (!labels) {
      return [];
    }
    return Object.entries(labels).map(([key, value]) => key + '=' + value);
  }

  public openEditApplicationModal() {
    this.editApplicationModal.show();
  }

  public navigateToList() {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('');
  }
}
