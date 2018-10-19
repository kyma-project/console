import { Observable } from 'rxjs';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';
import { LocalObjectReference } from './local-object-reference';

export interface IServiceBinding extends IMetaDataOwner {
  spec: IServiceBindingSpec;
}

export interface IServiceBindingSpec {
  instanceRef: LocalObjectReference;
  secretName: string;
}

export class ServiceBinding extends MetaDataOwner implements IServiceBinding {
  spec: IServiceBindingSpec;
  constructor(input?: IServiceBinding) {
    super(input.metadata, undefined, input.kind, input.apiVersion);
    this.spec = input.spec;
  }
}

export interface IServiceBindingList extends IMetaDataOwner {
  items: IServiceBinding[];
}
