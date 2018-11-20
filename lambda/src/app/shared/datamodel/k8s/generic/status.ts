export interface ILastProbeTime {
  status?: string;
  type?: string;
}

export interface ICondition {
  status?: string;
  type?: string;
  lastProbeTime?: ILastProbeTime[];
}

export interface IContainerStatuses {
  name?: string;
  ready?: boolean;
}

export interface IStatus {
  phase?: string;
  availableReplicas: number;
  conditions?: ICondition[];
  containerStatuses?: IContainerStatuses[];
}
