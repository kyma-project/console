import { Observable } from 'rxjs';
import { Deployment, IDeployment, IDeploymentStatus } from './deployment';
import { Service, IServiceSpec } from './service';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';
import { ISubscription, ISubscriptionList } from './subscription';

export class SubscriptionList extends MetaDataOwner
  implements ISubscriptionList {
  items: ISubscription[];
  constructor(input: ISubscriptionList) {
    super(input.metadata);
    this.items = input.items;
  }
}
