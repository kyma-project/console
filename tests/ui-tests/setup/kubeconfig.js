import * as k8s from '@kubernetes/client-node';
import config from '../config';

const loadKubeConfig = () => {
  const kubeConfig = new k8s.KubeConfig();

  if (!config.outsideCluster) {
    kubeConfig.loadFromCluster();
    return kubeConfig;
  }

  if (config.kubeConfigPath) {
    kubeConfig.loadFromFile(config.kubeConfigPath);
    return kubeConfig;
  }

  kubeConfig.loadFromDefault();
  return kubeConfig;
};

export const kubeConfig = loadKubeConfig();
