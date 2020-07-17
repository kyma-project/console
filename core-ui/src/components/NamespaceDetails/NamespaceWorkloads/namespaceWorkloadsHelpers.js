export function getHealthyDeploymentsCount(deployments) {
  return deployments.filter(d => d.status.replicas === d.status.readyReplicas)
    .length;
}

export function getHealthyPodsCount(pods) {
  const successStatuses = ['RUNNING', 'SUCCEEDED'];
  return pods.filter(p => successStatuses.includes(p.status)).length;
}

function handleEvent(resource, setResource, eventType, changedResource) {
  switch (eventType) {
    case 'ADD':
      setResource([...resource, changedResource]);
      return;
    case 'DELETE':
      setResource(resource.filter(r => r.name !== changedResource.name));
      return;
    case 'UPDATE':
      const newResource = resource.filter(r => r.name !== changedResource.name);
      setResource([...newResource, changedResource]);
      return;
    default:
      return;
  }
}

export function handleDeploymentEvent(
  deployments,
  setDeployments,
  subscriptionData,
) {
  if (!subscriptionData) return;

  const event = subscriptionData.deploymentEvent;
  const changedDeployment = event.deployment;

  handleEvent(deployments, setDeployments, event.type, changedDeployment);
}

export function handlePodsEvent(pods, setPods, subscriptionData) {
  if (!subscriptionData) return;

  const event = subscriptionData.podEvent;
  const changedPod = event.pod;

  handleEvent(pods, setPods, event.type, changedPod);
}
