import { Observable } from 'rxjs';
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
  include_subscription_name_header: boolean;
  event_type: string;
  event_type_version: string;
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
