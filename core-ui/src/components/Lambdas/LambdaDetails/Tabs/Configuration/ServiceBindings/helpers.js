// TODO: Remove this function after introducing new queries for ServiceBindingUsages in CBS
export function filterServiceInstances(lambdaName, serviceInstances = []) {
  const canInjectInstances = serviceInstances.filter(
    serviceInstance =>
      serviceInstance.bindable && serviceInstance.status.type === 'RUNNING',
  );

  const injectedServiceInstances = canInjectInstances
    .map(serviceInstance => {
      const bindingUsage = serviceInstance.serviceBindingUsages.find(
        usage =>
          usage.usedBy.name === lambdaName &&
          usage.usedBy.kind === 'knative-service',
      );

      return {
        serviceInstanceName: serviceInstance.name,
        bindingUsage,
      };
    })
    .filter(serviceInstance => serviceInstance.bindingUsage);

  const injectedServiceInstancesNames = injectedServiceInstances.map(
    service => service.serviceInstanceName,
  );
  const notInjectedServiceInstances = canInjectInstances.filter(
    serviceInstance =>
      !injectedServiceInstancesNames.includes(serviceInstance.name),
  );

  return [injectedServiceInstances || [], notInjectedServiceInstances || []];
}
