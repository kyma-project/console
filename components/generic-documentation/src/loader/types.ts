// Service Catalog
export interface ServiceClass {
  clusterDocsTopic: ClusterDocsTopic;
  docsTopic: DocsTopic;
}

// Asset Store
export interface Metadata {
  disableRelativeLinks?: boolean;
  [key: string]: any;
}

export interface File {
  url: string;
  metadata: Metadata;
  parameters?: {
    disableRelativeLinks?: boolean;
  };
}

export interface ClusterAsset {
  name: string;
  metadata: Metadata;
  type: string;
  files: File[];
  status: AssetStatus;
}

export interface Asset extends ClusterAsset {
  namespace: string;
}

export interface AssetStatus {
  phase: AssetPhaseType;
  reason: string;
  message: string;
}

export enum AssetPhaseType {
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

// Headless CMS
export interface ClusterDocsTopic {
  name: string;
  groupName: string;
  assets: ClusterAsset[];
  displayName: string;
  description: string;
  status: DocsTopicStatus;
}

export interface DocsTopic extends ClusterDocsTopic {
  namespace: string;
  assets: Asset[];
}

export interface DocsTopicStatus {
  phase: DocsTopicPhaseType;
  reason: string;
  message: string;
}

export enum DocsTopicPhaseType {
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export type DT = DocsTopic | ClusterDocsTopic;
