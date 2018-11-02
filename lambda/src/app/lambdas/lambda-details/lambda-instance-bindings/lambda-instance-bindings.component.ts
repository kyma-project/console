import {
  Component,
  Input,
  ReflectiveInjector,
  Type,
  ViewChild,
  ViewContainerRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IEnvVar } from '../../../shared/datamodel/k8s/container';
import { LambdaInstanceBindingCreatorComponent } from './lambda-instance-binding-creator/lambda-instance-binding-creator.component';
import { InstanceBindingInfo } from '../../../shared/datamodel/instance-binding-info';
import {
  ServiceBindingUsage,
  IServiceBindingUsageList,
} from '../../../shared/datamodel/k8s/service-binding-usage';
import { ServiceBindingsService } from '../../../service-bindings/service-bindings.service';
import { ServiceBindingUsagesService } from '../../../service-binding-usages/service-binding-usages.service';
import { forEach } from '@angular/router/src/utils/collection';
import { IServiceBindingList } from '../../../shared/datamodel/k8s/service-binding';
import { InstanceBindingState } from '../../../shared/datamodel/instance-binding-state';
import * as luigiClient from '@kyma-project/luigi-client';
import { CoreServicesService } from '../../../core-services/core-services.service';

@Component({
  selector: 'app-lambda-instance-bindings',
  templateUrl: './lambda-instance-bindings.component.html',
  styleUrls: ['../lambda-details.component.scss'],
})
export class LambdaInstanceBindingsComponent {
  @ViewChild('bindingCreatorModal')
  bindingCreatorModal: LambdaInstanceBindingCreatorComponent;
  @Input() lambdaName: string;
  @Input() isLambdaNameInvalid: boolean;
  @Output()
  bindingStateEmitter = new EventEmitter<Map<string, InstanceBindingState>>();

  instanceBindingInfoList: InstanceBindingInfo[] = [];
  serviceBindingUsage: ServiceBindingUsage;
  serviceBindingList: IServiceBindingList;
  bindingUsageList: IServiceBindingUsageList;
  environment: string;
  bindingPrefix: string;
  token: string;
  error: string = null;
  bindingState = new Map<string, InstanceBindingState>();

  constructor(
    private serviceBindingUsageService: ServiceBindingUsagesService,
    private serviceBindingsService: ServiceBindingsService,
    private coreService: CoreServicesService,
  ) {
    luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.environment = eventData.currentEnvironmentId;
      this.token = eventData.idToken;
    });

    this.serviceBindingsService
      .getServiceBindings(this.environment, this.token)
      .subscribe(sb => {
        this.serviceBindingList = sb;
        this.serviceBindingUsageService
          .getServiceBindingUsages(this.environment, this.token)
          .subscribe(
            sbuList => {
              sbuList.items = sbuList.items.filter(item => {
                return (
                  item.spec.usedBy.kind === 'function' &&
                  item.spec.usedBy.name === this.lambdaName
                );
              });
              this.bindingUsageList = sbuList;
              this.bindingUsageList.items.forEach(usage => {
                this.serviceBindingList.items.forEach(binding => {
                  if (
                    usage.spec.serviceBindingRef.name === binding.metadata.name
                  ) {
                    this.coreService
                      .getSecret(
                        binding.spec.secretName,
                        this.environment,
                        this.token,
                      )
                      .subscribe(res => {
                        let secrets: Map<string, string>;
                        secrets = res.data;

                        const prevState: InstanceBindingInfo = {
                          serviceBinding: usage.spec.serviceBindingRef.name,
                          instanceName: binding.spec.instanceRef.name,
                          secretName: binding.spec.secretName,
                          envVarNames: Object.keys(secrets),
                          instanceBindingPrefix:
                            usage.spec.parameters.envPrefix.name,
                        };

                        const cs: InstanceBindingInfo = {
                          instanceName: '',
                          envVarNames: [],
                          secretName: '',
                          serviceBinding: '',
                          instanceBindingPrefix: '',
                        };

                        const ibs: InstanceBindingState = {
                          previousState: prevState,
                          currentState: cs,
                          hasChanged: false,
                        };
                        this.bindingState.set(
                          binding.spec.instanceRef.name,
                          ibs,
                        );
                        this.instanceBindingInfoList.push(prevState);
                      });
                  }
                });
              });
            },
            err => {
              this.error = err.message;
            },
          );
      });
  }

  showBindingCreatorModal(): void {
    this.bindingCreatorModal.show();
  }

  remove(i) {
    const bindingInfo: InstanceBindingState = this.bindingState.get(
      this.instanceBindingInfoList[i].instanceName,
    );
    bindingInfo.currentState = undefined;
    bindingInfo.hasChanged = true;
    this.bindingState.set(
      this.instanceBindingInfoList[i].instanceName,
      bindingInfo,
    );
    this.instanceBindingInfoList.splice(i, 1);
    this.bindingStateEmitter.emit(this.bindingState);
  }

  addServiceBinding($event): void {
    const instanceBindinginfo = $event as InstanceBindingInfo;
    const instanceName = instanceBindinginfo.instanceName;
    if (this.bindingState.has(instanceName)) {
      const prevState = this.bindingState.get(instanceName).previousState;
      const ibs: InstanceBindingState = {
        hasChanged: true,
        currentState: instanceBindinginfo,
        previousState: prevState,
      };
      this.bindingState.set(instanceBindinginfo.instanceName, ibs);
    } else {
      const ibs: InstanceBindingState = {
        hasChanged: true,
        currentState: instanceBindinginfo,
        previousState: undefined,
      };
      this.bindingState.set(instanceBindinginfo.instanceName, ibs);
    }

    this.instanceBindingInfoList.push(instanceBindinginfo);
    this.bindingStateEmitter.emit(this.bindingState);
  }
}
