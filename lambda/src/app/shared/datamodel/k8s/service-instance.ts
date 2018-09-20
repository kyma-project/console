import { Observable } from 'rxjs';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';
import { LocalObjectReference } from './local-object-reference';

export interface IServiceInstance extends IMetaDataOwner {
  spec: IServiceInstanceSpec;
}

export interface IServiceInstanceSpec {
  clusterServiceClassExternalName: any;
  clusterServicePlanExternalName: any;
}

export class ServiceInstance extends MetaDataOwner implements IServiceInstance {
  spec: IServiceInstanceSpec;
  constructor(input?: IServiceInstance) {
    super(input.metadata, undefined, input.kind, input.apiVersion);
    this.spec = input.spec;
  }
}
