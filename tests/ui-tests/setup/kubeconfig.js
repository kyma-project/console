import * as k8s from '@kubernetes/client-node';
import config from '../config';

export const loadKubeConfig = () => {
  const kubeConfig = new k8s.KubeConfig();

  if (config.localdev) {
    kubeConfig.loadFromDefault();
  } else {
    kubeConfig.loadFromCluster();
  }

  return kubeConfig;
};
