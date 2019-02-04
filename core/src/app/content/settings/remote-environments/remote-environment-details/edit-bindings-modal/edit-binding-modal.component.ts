import { RemoteEnvironmentBindingService } from './../remote-environment-binding-service';
import { ComponentCommunicationService } from './../../../../../shared/services/component-communication.service';
import { EnvironmentsService } from '../../../../environments/services/environments.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteEnvironmentsService } from './../../services/remote-environments.service';

import * as _ from 'lodash';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-bindings-modal',
  templateUrl: './edit-binding-modal.component.html',
  styleUrls: ['./edit-binding-modal.component.scss']
})
export class EditBindingsModalComponent {
  public environments = [];
  private environmentsService: EnvironmentsService;
  public remoteEnv: any;
  private ariaExpanded = false;
  private ariaHidden = true;
  public isActive = false;
  private filteredEnvs = [];
  private environmentName;
  private filteredEnvsNames = [];

  constructor(
    environmentsService: EnvironmentsService,
    private remoteEnvironmentService: RemoteEnvironmentsService,
    private route: ActivatedRoute,
    private remoteEnvironmentBindingService: RemoteEnvironmentBindingService,
    private communication: ComponentCommunicationService
  ) {
    this.environmentsService = environmentsService;
    this.remoteEnvironmentBindingService = remoteEnvironmentBindingService;
  }

  public show() {
    this.route.params.subscribe(params => {
      const remoteEnvId = params['id'];
      const observables = [
        this.remoteEnvironmentService.getRemoteEnvironment(remoteEnvId) as any,
        this.environmentsService.getEnvironments() as any
      ];

      forkJoin(observables).subscribe(
        data => {
          const response: any = data;

          this.remoteEnv = response[0].application;
          this.environments = response[1];

          this.environments.forEach(env => {
            if (this.remoteEnv && this.remoteEnv.enabledInNamespaces) {
              this.getFilteredEnvironments(
                this.remoteEnv.enabledInNamespaces,
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
    });
  }

  private getFilteredEnvironments(enabledInEnvironments, env) {
    const exists = _.includes(enabledInEnvironments, env.label);

    if (!exists) {
      this.filteredEnvs.push(env);
      this.filteredEnvsNames.push(env);
    }
  }

  public toggleDropDown() {
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  private openDropDown(event: Event) {
    event.stopPropagation();
    this.ariaExpanded = true;
    this.ariaHidden = false;
  }

  private closeDropDown() {
    this.ariaExpanded = false;
    this.ariaHidden = true;
  }

  public selectedEnv(env) {
    this.environmentName = env.label;
  }

  save() {
    if (this.remoteEnv && this.remoteEnv.name) {
      this.remoteEnvironmentBindingService
        .bind(this.environmentName, this.remoteEnv.name)
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
    this.isActive = false;
    this.environmentName = null;
    this.filteredEnvs = [];
    this.filteredEnvsNames = [];
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
