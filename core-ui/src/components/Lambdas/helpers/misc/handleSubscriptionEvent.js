export const SUBSCRIPTION_EVENT_TYPES = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export function handleSubscriptionEvent(
  { type, newItem },
  collection = [],
  comparisonProperty = 'name',
) {
  function onAdd() {
    if (
      !collection.find(
        t => t[comparisonProperty] === newItem[comparisonProperty],
      )
    ) {
      return [...collection, newItem];
    }

    return collection;
  }

  function onUpdate() {
    const index = collection.findIndex(
      t => t[comparisonProperty] === newItem[comparisonProperty],
    );
    if (index === -1) {
      return [...collection, newItem];
    }

    const updatedCollection = [...collection];
    updatedCollection[index] = {
      ...newItem,
    };
    return updatedCollection;
  }

  function onDelete() {
    return collection.filter(
      t => t[comparisonProperty] !== newItem[comparisonProperty],
    );
  }

  switch (type) {
    case SUBSCRIPTION_EVENT_TYPES.ADD:
      return onAdd();
    case SUBSCRIPTION_EVENT_TYPES.UPDATE:
      return onUpdate();
    case SUBSCRIPTION_EVENT_TYPES.DELETE:
      return onDelete();
    default:
      return collection;
  }
}
