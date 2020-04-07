export function filterServiceInstances(
  serviceInstances = [],
  serviceBindingUsages = [],
) {
  const canInjectInstances = serviceInstances.filter(
    serviceInstance => serviceInstance.bindable,
  );

  if (!serviceBindingUsages.length) {
    return canInjectInstances;
  }

  const injectedServiceInstancesNames = serviceBindingUsages.map(
    binding => binding.serviceBinding.serviceInstanceName,
  );

  return canInjectInstances.filter(
    service => !injectedServiceInstancesNames.includes(service.name),
  );
}
