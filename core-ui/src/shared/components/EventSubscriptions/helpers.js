export function createOwnerRef(apiVersion, kind, entry) {
  return {
    apiVersion,
    kind,
    name: entry.name,
    UID: entry.UID,
  };
}
