import { Observable } from 'rxjs';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';
import { LocalObjectReference } from './local-object-reference';
import { IStatus } from './generic/status';

export class ServiceInstance {
  name: string;
  bindable: boolean;
}
