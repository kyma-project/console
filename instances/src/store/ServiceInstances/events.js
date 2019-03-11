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
  instancesObj = {},
  event = {},
) => {
  const currentItems = instancesObj.serviceInstances || [];
  if (currentItems.length === 0) {
    return instancesObj;
  }

  const bindingUsage = event.serviceBindingUsage;
  if (!bindingUsage) {
    return instancesObj;
  }

  let idx = -1;
  if (bindingUsage.serviceBinding) {
    idx = currentItems.findIndex(
      instance =>
        instance.name === bindingUsage.serviceBinding.serviceInstanceName,
    );
  }

  if (idx === -1) {
    // Try to search in another way
    idx = currentItems.findIndex(instance => {
      for (const instanceBindingUsage of instance.serviceBindingUsages) {
        if (instanceBindingUsage.name === bindingUsage.name) {
          return true;
        }
      }

      return false;
    });

    if (idx === -1) {
      return instancesObj;
    }
  }

  const currentInstanceServiceBindingUsages =
    currentItems[idx].serviceBindingUsages || [];

  let result = [...currentItems];
  switch (event.type) {
    case 'ADD':
      result[idx].serviceBindingUsages = [
        ...currentInstanceServiceBindingUsages,
        bindingUsage,
      ];
      break;
    case 'UPDATE':
      const instance = result[idx];
      const bindingUsageIdx = instance.serviceBindingUsages.findIndex(
        b => b.name === bindingUsage.name,
      );
      if (bindingUsageIdx === -1) {
        // if the `ADD` event hasn't been received
        result[idx].serviceBindingUsages = [
          ...currentInstanceServiceBindingUsages,
          bindingUsage,
        ];
        break;
      }
      result[idx].serviceBindingUsages[bindingUsageIdx] = bindingUsage;
      break;
    case 'DELETE':
      result[
        idx
      ].serviceBindingUsages = currentInstanceServiceBindingUsages.filter(
        b => b.name !== bindingUsage.name,
      );
      break;
    default:
      result = currentItems;
      break;
  }

  if (
    result[idx].serviceBindingUsages &&
    result[idx].serviceBindingUsages.length > 0
  ) {
    result[idx].serviceBindingUsages.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  return { ...instancesObj, serviceInstances: result };
};

export const handleServiceBindingEvent = (instancesObj = {}, event = {}) => {
  const currentItems = instancesObj.serviceInstances || [];
  if (currentItems.length === 0) {
    return instancesObj;
  }

  const binding = event.serviceBinding;
  if (!binding) {
    return instancesObj;
  }

  const idx = currentItems.findIndex(
    instance => instance.name === binding.serviceInstanceName,
  );

  if (idx === -1) {
    return instancesObj;
  }

  const currentInstanceServiceBindings =
    (currentItems[idx].serviceBindings &&
      currentItems[idx].serviceBindings.items) ||
    [];

  let result = [...currentItems];
  const instance = result[idx];
  switch (event.type) {
    case 'ADD':
      result[idx].serviceBindings.items = [
        ...currentInstanceServiceBindings,
        binding,
      ];
      break;
    case 'UPDATE':
      const bindingIdx = result[idx].serviceBindings.items.findIndex(
        b => b.name === binding.name,
      );
      if (bindingIdx === -1) {
        // if the `ADD` event hasn't been received
        result[idx].serviceBindings.items = [
          ...currentInstanceServiceBindings,
          binding,
        ];
        break;
      }
      result[idx].serviceBindings.items[bindingIdx] = binding;
      if (instance.serviceBindingUsages) {
        result[idx].serviceBindingUsages = instance.serviceBindingUsages.map(
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
      result[idx].serviceBindings.items = currentInstanceServiceBindings.filter(
        b => b.name !== binding.name,
      );
      if (instance.serviceBindingUsages) {
        result[idx].serviceBindingUsages = instance.serviceBindingUsages.map(
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
      result = currentItems;
      break;
  }

  if (
    result[idx].serviceBindings.items &&
    result[idx].serviceBindings.items.length > 0
  ) {
    result[idx].serviceBindings.items.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  result[idx].serviceBindings.stats = recalculateServiceBindingStats(
    result[idx].serviceBindings.items,
  );

  return { ...instancesObj, serviceInstances: result };
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
