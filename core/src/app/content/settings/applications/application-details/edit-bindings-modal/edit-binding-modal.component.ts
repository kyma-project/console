import { ApplicationBindingService } from '../application-binding-service';
import { ComponentCommunicationService } from './../../../../../shared/services/component-communication.service';
import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { ModalService, ModalComponent } from 'fundamental-ngx';
import { NamespaceInfo } from '../../../../../content/namespaces/namespace-info';
import { EnabledMappingServices } from '../../../../../shared/datamodel/enabled-mapping-services';
import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-bindings-modal',
  templateUrl: './edit-binding-modal.component.html',
  styleUrls: ['./edit-binding-modal.component.scss']
})
export class EditBindingsModalComponent {
  @ViewChild('editBindingModal') editBindingModal: ModalComponent;

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
        data => {
          const response: any = data;

          this.application = response[0].application;

          if (this.application && this.application.enabledMappingServices) {
            this.setInitialValues(
              this.application.enabledMappingServices,
              initialNamespace
            );
          }
        },
        err => {
          console.log(err);
        }
      );
      this.isActive = true;
      this.modalService.open(this.editBindingModal).result.finally(() => {
        this.isActive = false;
        this.namespaceName = null;
        this.allServices = true;
      });
    });
  }

  private getInitialNamespace(usedNamespaces: EnabledMappingServices[], initialNamespaceName: string) {
    const initialNamespaceArray = usedNamespaces.filter(
      usedNamespace => usedNamespace.namespace === initialNamespaceName
    );
    if (!initialNamespaceArray || !initialNamespaceArray.length) {
      return;
    }
    return initialNamespaceArray[0];
  }

  private setInitialValues(usedNamespaces, initialNamespaceName) {
    const initialNamespace = this.getInitialNamespace(
      usedNamespaces,
      initialNamespaceName
    );
    if (!initialNamespace) {
      return;
    }
    this.initialNamespaceName = initialNamespaceName;
    this.allServices = initialNamespace.allServices;
    this.selectedApplicationsState = [];

    initialNamespace.services.forEach(item => {
      if (item && item.id) {
        this.selectedApplicationsState.push({ id: item.id });
      }
    });
  }

  save() {
    if (this.application && this.application.name) {
      this.applicationBindingService
        .update(
          this.namespaceName,
          this.application.name,
          this.allServices,
          this.selectedApplicationsState
        )
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
    this.modalService.close(this.editBindingModal);
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
