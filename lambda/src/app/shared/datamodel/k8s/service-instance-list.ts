import { Observable } from 'rxjs';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';
import { LocalObjectReference } from './local-object-reference';
import { IServiceInstance } from './service-instance';

export interface IServiceInstanceList extends IMetaDataOwner {
  items: IServiceInstance[];
}

export class ServiceInstanceList extends MetaDataOwner
  implements IServiceInstanceList {
  items: IServiceInstance[];
  constructor(input: IServiceInstanceList) {
    super(input.metadata);
    this.items = input.items;
  }
}
