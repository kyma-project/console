const getAlternativePath = tenantName => {
  const currentPath = window.location.pathname;
  const regex = new RegExp('^/tenant/(.*?)/(.*)(?:/.*)?');
  const match = currentPath.match(regex);
  if (match) {
    const tenant = match[1];
    const path = match[2];
    if (tenant == tenantName) {
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

export const getToken = () => {
  let token = null;
  if (localStorage.getItem('luigi.auth')) {
    try {
      token = JSON.parse(localStorage.getItem('luigi.auth')).idToken;
    } catch (e) {
      console.error('Error while reading ID Token: ', e);
    }
  }
  return token;
};

export async function fetchTenants() {
  const payload = {
    query: `{
      tenants {
        name
        id
      }
    }
    `,
  };
  try {
    const response = await fetchFromGraphql(payload);
    return response.data.tenants;
  } catch (err) {
    console.error('Tenants could not be loaded', err);
    return [];
  }
}

const fetchFromGraphql = async data => {
  const url = window.clusterConfig.graphqlApiUrl;
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getTenantNames = tenants => {
  const tenantNames = tenants.map(tenant => {
    const alternativePath = getAlternativePath(tenant.id);
    return {
      label: tenant.name,
      pathValue: alternativePath || tenant.id,
    };
  });
  return tenantNames;
};
