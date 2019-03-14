import { ApplicationBindingService } from '../application-binding-service';
import { ComponentCommunicationService } from './../../../../../shared/services/component-communication.service';
import { NamespacesService } from '../../../../namespaces/services/namespaces.service';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from '../../services/applications.service';
import { ModalService, ModalComponent } from 'fundamental-ngx';

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
  private namespacesService: NamespacesService;
  public application: any;
  public ariaExpanded = false;
  public ariaHidden = true;
  public isActive = false;
  private filteredNamespaces = [];
  public namespaceName;
  public filteredNamespacesNames = [];

  constructor(
    namespacesService: NamespacesService,
    private applicationService: ApplicationsService,
    private route: ActivatedRoute,
    private applicationBindingService: ApplicationBindingService,
    private communication: ComponentCommunicationService,
    private modalService: ModalService
  ) {
    this.namespacesService = namespacesService;
    this.applicationBindingService = applicationBindingService;
  }

  public show() {
    this.route.params.subscribe(params => {
      const applicationId = params['id'];
      const observables = [
        this.applicationService.getApplication(applicationId) as any,
        this.namespacesService.getNamespaces() as any
      ];

      forkJoin(observables).subscribe(
        data => {
          const response: any = data;

          this.application = response[0].application;
          this.namespaces = response[1];

          this.namespaces.forEach(namespace => {
            if (this.application && this.application.enabledInNamespaces) {
              this.getFilteredNamespaces(
                this.application.enabledInNamespaces,
                namespace
              );
            }
          });
        },
        err => {
          console.log(err);
        }
      );
      this.isActive = true;
      this.modalService.open(this.editBindingModal).result.finally(() => {
        this.isActive = false;
        this.namespaceName = null;
        this.filteredNamespaces = [];
        this.filteredNamespacesNames = [];
      });
    });
  }

  private getFilteredNamespaces(enabledInNamespaces, namespace) {
    const exists = _.includes(enabledInNamespaces, namespace.label);

    if (!exists) {
      this.filteredNamespaces.push(namespace);
      this.filteredNamespacesNames.push(namespace);
    }
  }

  public toggleDropDown() {
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  public openDropDown(event: Event) {
    event.stopPropagation();
    this.ariaExpanded = true;
    this.ariaHidden = false;
  }

  public closeDropDown() {
    this.ariaExpanded = false;
    this.ariaHidden = true;
  }

  public selectedNamespace(namespace) {
    this.namespaceName = namespace.label;
  }

  save() {
    if (this.application && this.application.name) {
      this.applicationBindingService
        .bind(this.namespaceName, this.application.name)
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
    this.modalService.close(this.editBindingModal);
  }

  filterNamespacesNames() {
    this.filteredNamespacesNames = [];
    this.filteredNamespaces.forEach(element => {
      if (element.label.includes(this.namespaceName.toLowerCase())) {
        this.filteredNamespacesNames.push(element);
      }
    });
  }

  checkIfNamespaceExists() {
    if (this.filteredNamespaces.length > 0 && this.namespaceName) {
      return this.filteredNamespaces
        .map(element => {
          return element.label;
        })
        .includes(this.namespaceName);
    } else {
      return false;
    }
  }
}
