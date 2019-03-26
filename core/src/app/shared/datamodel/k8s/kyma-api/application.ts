import { MetaDataOwner, IMetaDataOwner } from '../generic/meta-data-owner';
import { IApplication } from './application';

export interface IApplication extends IMetaDataOwner {
  spec: IApplicationSpec;
}

export interface IApplicationSpec {
  bindings: any[];
  description: string;
  clusterKey: string;
  type: string;
  namespace: string;
}

export class Application extends MetaDataOwner implements IApplication {
  spec: IApplicationSpec;

  constructor(input: IApplication) {
    super(input.metadata, input.status);
    this.spec = input.spec;
  }
}
