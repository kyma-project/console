export class InstanceBindingInfo {
  instanceName: string;
  instanceBindingPrefix: string;
  createSecret?: boolean;
  serviceBinding: string;
  envVarNames: string[];
  secretName: string;
}
