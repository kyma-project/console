const regex = new RegExp('/tenant/(.*?)/(.*)(?:/.*)?');

export const getAlternativePath = (tenantName, fromPath) => {
  const currentPath = fromPath || window.location.pathname;
  const match = currentPath.match(regex);
  if (match) {
    const tenant = match[1];
    const path = match[2];
    if (tenant === tenantName) {
      // the same tenant, leave path as it is
      return `${tenantName}/${path}`;
    } else {
      // other tenant, get back to context as applications or runtimes
      const contextOnlyPath = path.split('/')[0];
      return `${tenantName}/${contextOnlyPath}`;
    }
  }
  return null;
};
