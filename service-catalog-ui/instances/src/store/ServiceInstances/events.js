import cloneDeep from 'lodash.clonedeep';

export const handleInstanceEvent = (obj = {}, event = {}) => {
  const currentItems = obj.serviceInstances || [];
  const instance = event.serviceInstance;
  if (!instance) {
    return obj;
  }

  let result;
  switch (event.type) {
    case 'ADD':
      result = [...currentItems, instance];
      break;
    case 'UPDATE':
      const items = [...currentItems];
      const idx = items.findIndex(i => i.name === instance.name);
      if (idx === -1) {
        // if the `ADD` event hasn't been received
        result = [...currentItems, instance];
        break;
      }
      items[idx] = instance;
      result = items;
      break;
    case 'DELETE':
      result = currentItems.filter(i => i.name !== instance.name);
      break;
    default:
      result = items;
      break;
  }

  if (result && result.length > 0) {
    result.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  return { ...obj, serviceInstances: result };
};

export const handleServiceBindingUsageEvent = (
  instanceObj = {},
  event = {},
) => {
  if (!instanceObj.serviceInstance) return instanceObj;

  const bindingUsage = event.serviceBindingUsage;
  if (!bindingUsage) {
    return instanceObj;
  }

  const serviceInstance = instanceObj.serviceInstance;

  const currentInstanceServiceBindingUsages =
    serviceInstance.serviceBindingUsages || [];

  let result = cloneDeep(serviceInstance);

  switch (event.type) {
    case 'ADD':
      if (
        currentInstanceServiceBindingUsages.find(
          serviceBindingUsage => serviceBindingUsage.name === bindingUsage.name,
        )
      )
        break;
      result.serviceBindingUsages = [
        ...currentInstanceServiceBindingUsages,
        bindingUsage,
      ];
      break;
    case 'UPDATE':
      const bindingUsageIdx = result.serviceBindingUsages.findIndex(
        b => b.name === bindingUsage.name,
      );
      if (bindingUsageIdx === -1) {
        // if the `ADD` event hasn't been received
        result.serviceBindingUsages = [
          ...currentInstanceServiceBindingUsages,
          bindingUsage,
        ];
        break;
      }
      result.serviceBindingUsages[bindingUsageIdx] = bindingUsage;
      break;
    case 'DELETE':
      result.serviceBindingUsages = currentInstanceServiceBindingUsages.filter(
        b => b.name !== bindingUsage.name,
      );
      break;
    default:
      result = { ...serviceInstance };
      break;
  }

  if (result.serviceBindingUsages && result.serviceBindingUsages.length > 0) {
    result.serviceBindingUsages.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  return { serviceInstance: result };
};

export const handleServiceBindingEvent = (instanceObj = {}, event = {}) => {
  if (!instanceObj.serviceInstance) return instanceObj;

  const binding = event.serviceBinding;
  if (!binding) {
    return instanceObj;
  }

  const serviceInstance = instanceObj.serviceInstance;

  const currentInstanceServiceBindings =
    (serviceInstance.serviceBindings &&
      serviceInstance.serviceBindings.items) ||
    [];

  let result = cloneDeep(serviceInstance);

  switch (event.type) {
    case 'ADD':
      if (
        currentInstanceServiceBindings.find(
          serviceBinding => serviceBinding.name === binding.name,
        )
      )
        break;
      result.serviceBindings.items = [
        ...currentInstanceServiceBindings,
        binding,
      ];
      break;
    case 'UPDATE':
      const bindingIdx = result.serviceBindings.items.findIndex(
        b => b.name === binding.name,
      );
      if (bindingIdx === -1) {
        // if the `ADD` event hasn't been received
        result.serviceBindings.items = [
          ...currentInstanceServiceBindings,
          binding,
        ];
        break;
      }
      result.serviceBindings.items[bindingIdx] = binding;
      if (serviceInstance.serviceBindingUsages) {
        result.serviceBindingUsages = serviceInstance.serviceBindingUsages.map(
          usage => {
            if (
              usage &&
              usage.serviceBinding &&
              usage.serviceBinding.name === binding.name
            ) {
              usage.serviceBinding = binding;
            }
            return { ...usage };
          },
        );
      }
      break;
    case 'DELETE':
      result.serviceBindings.items = currentInstanceServiceBindings.filter(
        b => b.name !== binding.name,
      );
      if (serviceInstance.serviceBindingUsages) {
        result.serviceBindingUsages = serviceInstance.serviceBindingUsages.map(
          usage => {
            if (
              usage &&
              usage.serviceBinding &&
              usage.serviceBinding.name === binding.name
            ) {
              usage.serviceBinding = null;
            }

            return usage;
          },
        );
      }
      break;
    default:
      result = { ...serviceInstance };
      break;
  }

  if (result.serviceBindings.items && result.serviceBindings.items.length > 0) {
    result.serviceBindings.items.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  result.serviceBindings.stats = recalculateServiceBindingStats(
    result.serviceBindings.items,
  );

  return { serviceInstance: result };
};

function recalculateServiceBindingStats(items = []) {
  const statuses = {
    ready: 'READY',
    pending: 'PENDING',
    failed: 'FAILED',
    unknown: 'UNKNOWN',
  };
  const stats = {
    ready: 0,
    failed: 0,
    pending: 0,
    unknown: 0,
    __typename: 'ServiceBindingsStats',
  };

  items.forEach(item => {
    if (!item.status) {
      return;
    }

    switch (item.status.type) {
      case statuses.ready:
        stats.ready += 1;
        break;
      case statuses.failed:
        stats.failed += 1;
        break;
      case statuses.pending:
        stats.pending += 1;
        break;
      case statuses.unknown:
        stats.unknown += 1;
        break;
      default:
        return;
    }
  });

  return stats;
}
