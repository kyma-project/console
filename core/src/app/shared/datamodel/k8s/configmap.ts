import { MetaDataOwner } from 'shared/datamodel/k8s/generic/meta-data-owner';

export interface IConfigMap {
  metadata: any;
  data: object;
}

export class ConfigMap extends MetaDataOwner implements IConfigMap {
  metadata: any;
  data: object;

  constructor(input: IConfigMap) {
    super(input.metadata);
    this.metadata = input.metadata;
    this.data = input.data;
  }
}
