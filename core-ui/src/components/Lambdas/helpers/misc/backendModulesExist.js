export function backendModulesExist(
  existingBackendModules = [],
  backendModules = [],
) {
  if (!existingBackendModules.length || !backendModules.length) {
    return false;
  }

  for (const backendModule of backendModules) {
    if (!existingBackendModules.includes(backendModule)) {
      return false;
    }
  }

  return true;
}
