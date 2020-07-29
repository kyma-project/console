import { handleSubscriptionArrayEvent } from 'gql/subscriptions';

export function getHealthyDeploymentsCount(deployments) {
  return deployments.filter(d => d.status.replicas === d.status.readyReplicas)
    .length;
}

export function getHealthyPodsCount(pods) {
  const successStatuses = ['RUNNING', 'SUCCEEDED'];
  return pods.filter(p => successStatuses.includes(p.status)).length;
}

export function handleDeploymentEvent(
  deployments,
  setDeployments,
  subscriptionData,
) {
  if (!subscriptionData) return;

  const event = subscriptionData.deploymentEvent;
  const changedDeployment = event.deployment;

  handleSubscriptionArrayEvent(
    deployments,
    setDeployments,
    event.type,
    changedDeployment,
  );
}

export function handlePodsEvent(pods, setPods, subscriptionData) {
  if (!subscriptionData) return;

  const event = subscriptionData.podEvent;
  const changedPod = event.pod;

  handleSubscriptionArrayEvent(pods, setPods, event.type, changedPod);
}
