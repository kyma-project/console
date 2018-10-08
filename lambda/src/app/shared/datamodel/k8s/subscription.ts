import { Observable } from 'rxjs/Observable';
import { Deployment, IDeployment, IDeploymentStatus } from './deployment';
import { Service, IServiceSpec } from './service';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';

export interface ISubscription extends IMetaDataOwner {
  spec: ISubscriptionSpec;
}

export interface ISubscriptionSpec {
  endpoint: string;
  source_id: string;
}

export class Subscription extends MetaDataOwner implements ISubscription {
  spec: ISubscriptionSpec;
  constructor(input?: ISubscription) {
    super(input.metadata, undefined, input.kind, input.apiVersion);
    this.spec = input.spec;
  }
}

export interface ISubscriptionList extends IMetaDataOwner {
  items: ISubscription[];
}
