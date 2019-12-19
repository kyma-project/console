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
  parameters: Metadata;
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
export interface ClusterAssetGroup {
  name: string;
  groupName: string;
  assets: ClusterAsset[];
  displayName: string;
  description: string;
  status: AssetGroupStatus;
}

export interface AssetGroup extends ClusterAssetGroup {
  namespace: string;
  assets: Asset[];
}

export interface AssetGroupStatus {
  phase: AssetGroupPhaseType;
  reason: string;
  message: string;
}

export enum AssetGroupPhaseType {
  READY = 'READY',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}
