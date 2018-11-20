import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';

export interface IHPAutoscaler extends IMetaDataOwner {
  spec: IHPAutoscalerSpec;
}

export interface IHPAutoscalerSpec {
  scaleTargetRef: IScaleTargetRef;
  maxReplicas: number;
  minReplicas: number;
  metrics: IMetricSpec[];
}

export interface IScaleTargetRef {
  apiVersion: string;
  kind: string;
  name: string;
}

export interface IMetricResource {
  name: string;
  targetAverageUtilization: number;
}

export interface IMetricSpec {
  type: string;
  resource: IMetricResource;
}

export class HPAutoscaler extends MetaDataOwner implements IHPAutoscaler {
  spec: IHPAutoscalerSpec;

  constructor(input: IHPAutoscaler) {
    super(input.metadata, input.status);
    this.spec = input.spec;
  }
}
