import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { ModalService, ModalComponent } from 'fundamental-ngx';
import { EnabledMappingServices } from '../../../../../shared/datamodel/enabled-mapping-services';

import { some as _some } from 'lodash';
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
    private modalService: ModalService
  ) {}

  get applicationHasAnyServices(): boolean {
    return (
      this.application &&
      this.application.services &&
      this.application.services.length > 0
    );
  }

  public show(initialNamespace) {
    this.namespaceName = initialNamespace;
    this.route.params.subscribe(params => {
      const applicationId = params['id'];
      const observables = [
        this.applicationService.getApplication(applicationId) as any
      ];

      forkJoin(observables).subscribe(
        (response: any) => {
          this.application = response[0].application;
          if (this.application && this.application.enabledMappingServices) {
            this.setInitialValues(this.application, initialNamespace);
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

  private getInitialNamespace(
    enabledServices: EnabledMappingServices[],
    initialNamespaceName: string
  ) {
    const initialNamespaceArray = enabledServices.filter(
      enabledService => enabledService.namespace === initialNamespaceName
    );
    if (!initialNamespaceArray || !initialNamespaceArray.length) {
      return;
    }
    return initialNamespaceArray[0];
  }

  private setInitialValues(application, initialNamespaceName) {
    const initialNamespace = this.getInitialNamespace(
      application.enabledMappingServices,
      initialNamespaceName
    );
    if (!initialNamespace) {
      return;
    }
    this.initialNamespaceName = initialNamespaceName;
    this.allServices = initialNamespace.allServices;
    this.selectedApplicationsState = initialNamespace.allServices
      ? application.services
      : initialNamespace.services;
  }

  public close() {
    this.allServices = true;
    this.selectedApplicationsState = [];
    this.modalService.close(this.bindingsDetailsModal);
  }

  applicationSelected(id) {
    return (
      this.selectedApplicationsState &&
      _some(this.selectedApplicationsState, { id })
    );
  }

  hasType(entries, type) {
    return _some(entries, { type });
  }
}
