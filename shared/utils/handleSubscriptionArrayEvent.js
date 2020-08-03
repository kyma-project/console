export function handleSubscriptionArrayEvent(
  resource,
  setResource,
  eventType,
  changedResource,
) {
  switch (eventType) {
    case 'ADD':
      if (resource.find(r => r.name === changedResource.name)) {
        throw Error(`Duplicate name: ${changedResource.name}.`);
      }
      setResource([...resource, changedResource]);
      return;
    case 'DELETE':
      setResource(resource.filter(r => r.name !== changedResource.name));
      return;
    case 'UPDATE':
      setResource(
        resource.map(r =>
          r.name === changedResource.name ? changedResource : r,
        ),
      );
      return;
    default:
      return;
  }
}
