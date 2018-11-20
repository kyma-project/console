import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Clipboard } from 'ts-clipboard';
import { ServiceInstance } from '../../../../shared/datamodel/k8s/service-instance';
import { ServiceInstancesService } from '../../../../service-instances/service-instances.service';
import { ServiceBindingsService } from '../../../../service-bindings/service-bindings.service';
import { ServiceBinding } from '../../../../shared/datamodel/k8s/service-binding';
import { Observable } from 'rxjs';
import { InstanceBindingInfo } from '../../../../shared/datamodel/instance-binding-info';
import * as luigiClient from '@kyma-project/luigi-client';
import { ServiceBindingList } from '../../../../shared/datamodel/k8s/service-binding-list';
import { ServiceInstanceList } from '../../../../shared/datamodel/k8s/service-instance-list';
import { CoreServicesService } from '../../../../core-services/core-services.service';

@Component({
  selector: 'app-lambda-instance-binding-creator',
  templateUrl: './lambda-instance-binding-creator.component.html',
  styleUrls: [
    '../../../../app.component.scss',
    '../../lambda-details.component.scss',
  ],
})
export class LambdaInstanceBindingCreatorComponent {
  public isActive = false;
  private isValid = false;
  private isSelectedInstanceBindingPrefixInvalid = false;
  private createSecrets = true;
  private selectedInstance: ServiceInstance;
  private selectedBinding: ServiceBinding;
  private selectedInstanceBindingPrefix: string;
  private relevantServiceBindings = new ServiceBindingList({
    items: [],
  });
  private instances = new ServiceInstanceList({
    items: [],
  });
  private serviceBindings = new ServiceBindingList({
    items: [],
  });
  private token: string;
  private environment: string;
  constructor(
    private serviceInstancesService: ServiceInstancesService,
    private serviceBindingsService: ServiceBindingsService,
    private coreService: CoreServicesService,
  ) {}

  private secrets: Map<string, string>;

  @Input() alreadyAddedInstances: InstanceBindingInfo[];
  @Output()
  selectedServiceBindingEmitter = new EventEmitter<InstanceBindingInfo>();

  public show() {
    this.isActive = true;
    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.environment = eventData.currentEnvironmentId;
      this.token = eventData.idToken;
      this.serviceInstancesService
        .getServiceInstances(this.environment, this.token)
        .subscribe(
          instances => {
            instances.items = instances.items.filter(i => {
              if (i.status.provisionStatus !== 'Provisioned') {
                return;
              }
              let isAdded = false;
              this.alreadyAddedInstances.forEach(alreadyAddedInst => {
                if (i.metadata.name === alreadyAddedInst.instanceName) {
                  isAdded = true;
                  return;
                }
              });
              return !isAdded;
            });
            this.instances = instances;
          },
          err => {},
        );
      this.serviceBindingsService
        .getServiceBindings(this.environment, this.token)
        .subscribe(
          bindings => {
            this.serviceBindings = bindings;
          },
          err => {},
        );
    });
  }

  public validatesPrefix() {
    const regex = /[a-z0-9]([(-|_)a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*/;
    const found = this.selectedInstanceBindingPrefix.match(regex);
    this.isSelectedInstanceBindingPrefixInvalid =
      (found && found[0] === this.selectedInstanceBindingPrefix) ||
      this.selectedInstanceBindingPrefix === ''
        ? false
        : true;
    if (this.selectedInstanceBindingPrefix.length > 61) {
      this.isSelectedInstanceBindingPrefixInvalid = true;
    }
  }

  public cancel(event: Event) {
    this.isActive = false;
    this.reset();
    event.stopPropagation();
  }

  public submit(event: Event) {
    const ibInfo: InstanceBindingInfo = {
      instanceName: this.selectedInstance.metadata.name,
      createSecret: this.createSecrets,
      serviceBinding: this.createSecrets
        ? ''
        : this.selectedBinding.metadata.name,
      secretName: this.createSecrets
        ? '-'
        : this.selectedBinding.spec.secretName,
      envVarNames: [],
      status: this.createSecrets
        ? ''
        : this.selectedBinding.status.conditions[0].status,
      statusType: this.createSecrets
        ? ''
        : this.selectedBinding.status.conditions[0].type,
      instanceBindingPrefix: this.selectedInstanceBindingPrefix,
    };

    if (!this.createSecrets && this.selectedBinding.spec.secretName !== '') {
      this.coreService
        .getSecret(
          this.selectedBinding.spec.secretName,
          this.environment,
          this.token,
        )
        .subscribe(res => {
          this.secrets = res.data;
          ibInfo.envVarNames = Object.keys(this.secrets);
        });
    }

    this.selectedServiceBindingEmitter.emit(ibInfo);

    this.isActive = false;
    this.reset();
    event.stopPropagation();
  }

  public validateSelection() {
    this.relevantServiceBindings.items = this.serviceBindings.items.filter(
      item => {
        return (
          this.selectedInstance !== undefined &&
          this.selectedInstance.metadata !== undefined &&
          item.spec.instanceRef.name === this.selectedInstance.metadata.name
        );
      },
    );
    if (this.selectedInstance && this.createSecrets) {
      this.isValid = true;
      this.selectedBinding = null;
      return;
    }

    if (this.selectedInstance && this.selectedBinding) {
      this.isValid = true;
      return;
    }
    this.isValid = false;
  }

  private reset() {
    this.createSecrets = true;
    this.selectedInstance = null;
    this.selectedBinding = null;
    this.isValid = false;
  }

  vote(agreed: boolean) {}
}
