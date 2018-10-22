import {
  IDashboardMetaDataOwner,
  DashboardMetaDataOwner
} from './generic/dashboard-meta-data-owner';

export interface IDashboardConfigMap extends IDashboardMetaDataOwner {
  type: string;
}

export class DashboardConfigMap extends DashboardMetaDataOwner
  implements IDashboardConfigMap {
  type: string;
  constructor(input: IDashboardConfigMap) {
    super(input.objectMeta, input.typeMeta);
    this.type = input.type;
  }
}
