import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IStatus } from './generic/status';
import { IPodTemplate, IPodTemplateSpec } from './pod-template';

export interface IReplicaSet extends IMetaDataOwner {
  spec: IReplicaSetSpec;
  status: IReplicaSetStatus;

  getImages();
  getBoundAppName();
}

export interface IReplicaSetSpec {
  replicas: number;
  template: IPodTemplate;
}

export interface IReplicaSetStatus extends IStatus {
  fullyLabeledReplicas: number;
  observedGeneration: number;
  replicas: number;
  readyReplicas: number;
  availableReplicas: number;
}

export class ReplicaSet extends MetaDataOwner implements IReplicaSet {
  spec: IReplicaSetSpec;
  status: IReplicaSetStatus;

  constructor(input: IReplicaSet) {
    super(input.metadata, input.status);
    this.spec = input.spec;
    this.status = input.status;
  }

  getImages(): string[] {
    const result = [];
    this.spec.template.spec.containers.forEach(container =>
      result.push(container.image)
    );
    return result;
  }

  getBoundAppName(): string {
    let result = 'None';
    if (this.metadata.labels.hasOwnProperty('app')) {
      result = this.metadata.labels['app'];
    }
    return result;
  }
}
