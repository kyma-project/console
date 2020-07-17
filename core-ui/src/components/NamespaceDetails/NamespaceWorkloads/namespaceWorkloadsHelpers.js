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

  const setDeployments2 = d => {
    console.group('DEPLOY EVENT ' + event.type + ' ' + changedDeployment.name);
    console.log('before count: ', deployments.length);
    console.log(
      'setting to ',
      getHealthyDeploymentsCount(d) + ' / ' + d.length,
    );
    console.log('setting to ', d);
    console.groupEnd(
      'DEPLOY EVENT ' + event.type + ' ' + changedDeployment.name,
    );
    setDeployments(d);
  };

  handleEvent(deployments, setDeployments2, event.type, changedDeployment);
}

export function handlePodsEvent(pods, setPods, subscriptionData) {
  if (!subscriptionData) return;

  const event = subscriptionData.podEvent;
  const changedPod = event.pod;

  const setPods2 = d => {
    console.group('POD EVENT ' + event.type + ' ' + changedPod.name);
    console.log('before count: ', pods.length);
    console.log('setting to ', getHealthyPodsCount(d) + ' / ' + d.length);
    console.log('setting to ', d);
    console.groupEnd('POD EVENT ' + event.type + ' ' + changedPod.name);
    setPods(d);
  };

  handleEvent(pods, setPods2, event.type, changedPod);
}
