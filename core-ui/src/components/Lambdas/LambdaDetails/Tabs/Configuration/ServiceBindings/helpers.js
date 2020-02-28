export function filterServiceInstances(
  serviceInstances = [],
  serviceBindingUsages = [],
) {
  if (!serviceBindingUsages.length) {
    return serviceInstances;
  }

  const canInjectInstances = serviceInstances.filter(
    serviceInstance => serviceInstance.bindable,
  );

  const injectedServiceInstancesNames = serviceBindingUsages.map(
    binding => binding.serviceBinding.serviceInstanceName,
  );

  return canInjectInstances.filter(
    service => !injectedServiceInstancesNames.includes(service.name),
  );
}
