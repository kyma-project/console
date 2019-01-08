import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IStatus } from './generic/status';
import { IPodTemplate, IPodTemplateSpec } from './pod-template';

export interface IReplicaSets extends IMetaDataOwner {
  spec: IReplicaSetsSpec;
  status: IReplicaSetsStatus;

  getImages();
  getBoundAppName();
}

export interface IReplicaSetsSpec {
  replicas: number;
  template: IPodTemplate;
}

export interface IReplicaSetsStatus extends IStatus {
  fullyLabeledReplicas: number;
  observedGeneration: number;
  replicas: number;
  readyReplicas: number;
  availableReplicas: number;
}

export class ReplicaSets extends MetaDataOwner implements IReplicaSets {
  spec: IReplicaSetsSpec;
  status: IReplicaSetsStatus;

  constructor(input: IReplicaSets) {
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
