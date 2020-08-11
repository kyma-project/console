export function handleSubscriptionEvent(
  eventType,
  setResource,
  changedResource,
  resourceFilter,
) {
  if (!resourceFilter(changedResource)) {
    return;
  }

  switch (eventType) {
    case 'UPDATE':
    case 'ADD':
      setResource(changedResource);
      return;
    case 'DELETE':
      setResource(null);
      return;
    default:
      return;
  }
}
