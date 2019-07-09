import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostListener,
  TemplateRef,
} from '@angular/core';
import { ServiceInstance } from '../../../../shared/datamodel/k8s/service-instance';
import { ServiceInstancesService } from '../../../../service-instances/service-instances.service';
import { ServiceBindingsService } from '../../../../service-bindings/service-bindings.service';
import { ServiceBinding } from '../../../../shared/datamodel/k8s/service-binding';
import { InstanceBindingInfo } from '../../../../shared/datamodel/instance-binding-info';
import * as luigiClient from '@kyma-project/luigi-client';
import { ServiceBindingList } from '../../../../shared/datamodel/k8s/service-binding-list';
import { ModalService, ModalRef } from 'fundamental-ngx';

const RUNNING = 'RUNNING';

@Component({
  selector: 'app-lambda-instance-binding-creator',
  templateUrl: './lambda-instance-binding-creator.component.html',
  styleUrls: ['../../lambda-details.component.scss'],
})
export class LambdaInstanceBindingCreatorComponent {
  constructor(
    private serviceInstancesService: ServiceInstancesService,
    private serviceBindingsService: ServiceBindingsService,
    private modalService: ModalService,
  ) {}
  @ViewChild('instanceBindingCreatorModal')
  instanceBindingCreatorModal: TemplateRef<ModalRef>;

  public isValid = false;
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
  private isActive = false;

  @Input() alreadyAddedInstances: InstanceBindingInfo[];
  @Output()
  selectedServiceBindingEmitter = new EventEmitter<InstanceBindingInfo>();

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.closeModal(event);
  }

  public show() {
    luigiClient.uxManager().addBackdrop();
    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.environment = eventData.namespaceId;
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

    this.isActive = true;
    this.modalService
      .open(this.instanceBindingCreatorModal)
      .afterClosed.toPromise()
      .finally(() => {
        this.isActive = false;
        luigiClient.uxManager().removeBackdrop();
      });
  }

  public closeModal(event: Event): void {
    if (this.isActive) {
      event.stopPropagation();
      luigiClient.uxManager().removeBackdrop();
      this.modalService.dismissAll();
      this.reset();
    }
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
