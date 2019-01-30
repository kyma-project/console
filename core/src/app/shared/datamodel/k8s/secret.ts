import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';

export interface ISecret extends IMetaDataOwner {
  data: {};
  type: string;
}

export class Secret extends MetaDataOwner implements ISecret {
  data: {};
  type: string;

  constructor(input: ISecret) {
    super(input.metadata, input.status);
    this.data = input.data;
    this.type = input.type;
  }
}
