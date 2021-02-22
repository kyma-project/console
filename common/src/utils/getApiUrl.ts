import { getClusterConfig } from './getClusterConfig';

export function getApiUrl(endpoint: string): string {
  const clusterConfig = getClusterConfig();
  return clusterConfig[endpoint];
}
