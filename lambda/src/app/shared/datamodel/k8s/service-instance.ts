import { Observable } from 'rxjs';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';
import { LocalObjectReference } from './local-object-reference';
import { IStatus } from './generic/status';

export interface IServiceInstance extends IMetaDataOwner {
  spec: IServiceInstanceSpec;
  status?: IServiceInstanceStatus;
}

export interface IServiceInstanceSpec {
  clusterServiceClassExternalName: any;
  clusterServicePlanExternalName: any;
}

export interface IServiceInstanceStatus extends IStatus {
  provisionStatus: string;
}

export class ServiceInstance extends MetaDataOwner implements IServiceInstance {
  spec: IServiceInstanceSpec;
  status?: IServiceInstanceStatus;
  constructor(input?: IServiceInstance) {
    super(input.metadata, undefined, input.kind, input.apiVersion);
    this.spec = input.spec;
  }
}
