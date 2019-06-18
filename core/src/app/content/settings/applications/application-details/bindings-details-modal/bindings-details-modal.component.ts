import { ApplicationBindingService } from '../application-binding-service';
import { ComponentCommunicationService } from './../../../../../shared/services/component-communication.service';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { ModalService, ModalComponent } from 'fundamental-ngx';

import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bindings-details-modal',
  templateUrl: './bindings-details-modal.component.html',
  styleUrls: ['./bindings-details-modal.component.scss']
})
export class BindingsDetailsModalComponent {
  @ViewChild('bindingsDetailsModal') bindingsDetailsModal: ModalComponent;

  public namespaces = [];
  private selectedApplicationsState = [];
  public application: any;
  public initialNamespaceName: string;
  public initialNamespace: any;
  public ariaExpanded = false;
  public ariaHidden = true;
  public isActive = false;
  public namespaceName;
  public allServices = true;

  constructor(
    private applicationService: ApplicationsService,
    private route: ActivatedRoute,
    private applicationBindingService: ApplicationBindingService,
    private communication: ComponentCommunicationService,
    private modalService: ModalService
  ) {
    this.applicationBindingService = applicationBindingService;
  }

  public show(initialNamespace) {
    this.namespaceName = initialNamespace;
    this.route.params.subscribe(params => {
      const applicationId = params['id'];
      const observables = [
        this.applicationService.getApplication(applicationId) as any,
      ];

      forkJoin(observables).subscribe(
        data => {
          const response: any = data;

          this.application = response[0].application;
          console.log('this.application',this.application);
          if (this.application && this.application.enabledMappingServices) {
            this.setInitialValues(
              this.application,
              initialNamespace
            );
          }
        },
        err => {
          console.log(err);
        }
      );
      this.isActive = true;
      this.modalService.open(this.bindingsDetailsModal).result.finally(() => {
        this.isActive = false;
        this.namespaceName = null;
        this.allServices = true;
      });
    });
  }

  private getInitialNamespace(usedNamespaces, initialNamespaceName) {
    const initialNamespaceArray = usedNamespaces.filter(
      usedNamespace => usedNamespace.namespace === initialNamespaceName
    );
    if(!initialNamespaceArray || !initialNamespaceArray.length){
      return;
    }
    return initialNamespaceArray[0];
  };

  private setInitialValues(application, initialNamespaceName) {
    const initialNamespace = this.getInitialNamespace(application.enabledMappingServices, initialNamespaceName);
    if(!initialNamespace) {
      return;
    }
    this.initialNamespaceName = initialNamespaceName;
    this.allServices = initialNamespace.allServices;
    this.selectedApplicationsState = initialNamespace.allServices ? application.services : initialNamespace.services;

    // initialNamespace.services.forEach(item => {
    //   if (item && item.id) {
    //     this.selectedApplicationsState.push(item);
    //   }
    // });
    console.log('initialNamespace',initialNamespace,'allServices',this.allServices,'selectedApplicationsState',this.selectedApplicationsState)
  }

  save() {
    if (this.application && this.application.name) {
      this.applicationBindingService
        .update(
          this.namespaceName,
          this.application.name,
          this.allServices,
          this.selectedApplicationsState
        ) // TODO unmock
        .subscribe(
          res => {
            this.communication.sendEvent({
              type: 'updateResource',
              data: res
            });
          },
          err => {
            console.log(err);
          }
        );

      this.close();
    }
  }

  public close() {
    this.allServices = true;
    this.selectedApplicationsState = [];
    this.modalService.close(this.bindingsDetailsModal);
  }

  applicationSelected(id) {
    return (
      this.selectedApplicationsState &&
      _.some(this.selectedApplicationsState, { id })
    );
  }

  toggleApplication(applicationId, event) {
    event.stopPropagation();
    if (this.applicationSelected(applicationId)) {
      const index = this.selectedApplicationsState.indexOf(applicationId);
      this.selectedApplicationsState = this.selectedApplicationsState.filter(
        item => item.id !== applicationId
      );
    } else {
      this.selectedApplicationsState.push({ id: applicationId });
    }
  }

  hasType(entries, type) {
    return _.some(entries, { type });
  }
}
