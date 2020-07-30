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
      const newResource = resource.filter(r => r.name !== changedResource.name);
      setResource([...newResource, changedResource]);
      return;
    default:
      return;
  }
}
