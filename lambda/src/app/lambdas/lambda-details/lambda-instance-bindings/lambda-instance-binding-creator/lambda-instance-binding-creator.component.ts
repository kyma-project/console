import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener
} from '@angular/core';
import { ServiceInstance } from '../../../../shared/datamodel/k8s/service-instance';
import { ServiceInstancesService } from '../../../../service-instances/service-instances.service';
import { ServiceBindingsService } from '../../../../service-bindings/service-bindings.service';
import { ServiceBinding } from '../../../../shared/datamodel/k8s/service-binding';
import { InstanceBindingInfo } from '../../../../shared/datamodel/instance-binding-info';
import * as luigiClient from '@kyma-project/luigi-client';
import { ServiceBindingList } from '../../../../shared/datamodel/k8s/service-binding-list';
import { ModalService, ModalComponent } from 'fundamental-ngx';

const RUNNING = 'RUNNING';

@Component({
  selector: 'app-lambda-instance-binding-creator',
  templateUrl: './lambda-instance-binding-creator.component.html',
  styleUrls: ['../../lambda-details.component.scss'],
})
export class LambdaInstanceBindingCreatorComponent {
  @ViewChild('instanceBindingCreatorModal')
  instanceBindingCreatorModal: ModalComponent;

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.closeModal(event);
  }

  public isValid = false;
  public isSelectedInstanceBindingPrefixInvalid = false;
  public createSecrets = true;
  public selectedInstance: ServiceInstance;
  public selectedBinding: ServiceBinding;
  public selectedInstanceBindingPrefix: string;
  public relevantServiceBindings = new ServiceBindingList({
    items: [],
  });
  public instances: ServiceInstance[];
  private serviceBindings = new ServiceBindingList({
    items: [],
  });
  private token: string;
  private environment: string;
  private active = false;
  constructor(
    private serviceInstancesService: ServiceInstancesService,
    private serviceBindingsService: ServiceBindingsService,
    private modalService: ModalService,
  ) { }

  @Input() alreadyAddedInstances: InstanceBindingInfo[];
  @Output()
  selectedServiceBindingEmitter = new EventEmitter<InstanceBindingInfo>();

  public show() {
    luigiClient.uxManager().addBackdrop();
    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.environment = eventData.environmentId;
      this.token = eventData.idToken;
      this.serviceInstancesService
        .getServiceInstances(this.environment, this.token, RUNNING)
        .subscribe(
          instances => {
            instances.data.serviceInstances = instances.data.serviceInstances.filter(
              i => {
                if (!i.bindable) {
                  return false;
                }
                let isAdded = false;
                this.alreadyAddedInstances.forEach(alreadyAddedInst => {
                  if (i.name === alreadyAddedInst.instanceName) {
                    isAdded = true;
                    return;
                  }
                });
                return !isAdded;
              },
            );
            this.instances = instances.data.serviceInstances;
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

    this.active = true;
    this.modalService
      .open(this.instanceBindingCreatorModal)
      .result.finally(() => {
        this.active = false;
        luigiClient.uxManager().removeBackdrop();
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

  public closeModal(event: Event): void {
    event.stopPropagation();
    luigiClient.uxManager().removeBackdrop();
    if (this.instanceBindingCreatorModal) {
      this.modalService.close(this.instanceBindingCreatorModal);
    }
    this.reset();
  }

  public submit(event: Event) {
    const ibInfo: InstanceBindingInfo = {
      instanceName: this.selectedInstance.name,
      createSecret: this.createSecrets,
      serviceBinding: this.createSecrets
        ? ''
        : this.selectedBinding.metadata.name,
      secretName: this.createSecrets
        ? '-'
        : this.selectedBinding.spec.secretName,
      envVarNames: [],
      instanceBindingPrefix: this.selectedInstanceBindingPrefix,
    };

    this.selectedServiceBindingEmitter.emit(ibInfo);
    this.closeModal(event);
  }

  public validateSelection() {
    this.relevantServiceBindings.items = this.serviceBindings.items.filter(
      item => {
        return (
          this.selectedInstance !== undefined &&
          item.spec.instanceRef.name === this.selectedInstance.name
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
}
