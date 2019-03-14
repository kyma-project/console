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

  public environments = [];
  private environmentsService: NamespacesService;
  public application: any;
  public ariaExpanded = false;
  public ariaHidden = true;
  public isActive = false;
  private filteredEnvs = [];
  public environmentName;
  public filteredEnvsNames = [];

  constructor(
    environmentsService: NamespacesService,
    private applicationService: ApplicationsService,
    private route: ActivatedRoute,
    private applicationBindingService: ApplicationBindingService,
    private communication: ComponentCommunicationService,
    private modalService: ModalService
  ) {
    this.environmentsService = environmentsService;
    this.applicationBindingService = applicationBindingService;
  }

  public show() {
    this.route.params.subscribe(params => {
      const applicationId = params['id'];
      const observables = [
        this.applicationService.getApplication(applicationId) as any,
        this.environmentsService.getEnvironments() as any
      ];

      forkJoin(observables).subscribe(
        data => {
          const response: any = data;

          this.application = response[0].application;
          this.environments = response[1];

          this.environments.forEach(env => {
            if (this.application && this.application.enabledInNamespaces) {
              this.getFilteredEnvironments(
                this.application.enabledInNamespaces,
                env
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
        this.environmentName = null;
        this.filteredEnvs = [];
        this.filteredEnvsNames = [];
      });
    });
  }

  private getFilteredEnvironments(enabledInNamespaces, env) {
    const exists = _.includes(enabledInNamespaces, env.label);

    if (!exists) {
      this.filteredEnvs.push(env);
      this.filteredEnvsNames.push(env);
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

  public selectedEnv(env) {
    this.environmentName = env.label;
  }

  save() {
    if (this.application && this.application.name) {
      this.applicationBindingService
        .bind(this.environmentName, this.application.name)
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

  filterEnvsNames() {
    this.filteredEnvsNames = [];
    this.filteredEnvs.forEach(element => {
      if (element.label.includes(this.environmentName.toLowerCase())) {
        this.filteredEnvsNames.push(element);
      }
    });
  }

  checkIfEnvironmentExists() {
    if (this.filteredEnvs.length > 0 && this.environmentName) {
      return this.filteredEnvs
        .map(element => {
          return element.label;
        })
        .includes(this.environmentName);
    } else {
      return false;
    }
  }
}
