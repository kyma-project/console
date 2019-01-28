import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IStatus } from './generic/status';

export interface IPod extends IMetaDataOwner {
  spec: {};
  status: IStatus;
}

export class Pod extends MetaDataOwner implements IPod {
  spec: {};
  status: IStatus;

  constructor(input: IPod) {
    super(input.metadata, input.status);
    this.spec = input.spec;
    this.status = input.status;
  }
}
