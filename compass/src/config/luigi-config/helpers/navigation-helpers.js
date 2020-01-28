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

const getToken = () => {
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

async function fetchTenants() {
  const payload = {
    variables: {},
    query: `{
      tenants {
        name
        tenant
      }
    }
    `,
  };
  const response = await fetchFromGraphql(payload);
  return response.data.tenants;
}

async function fetchFromGraphql(data) {
  const url = window.clusterConfig.graphqlApiUrl;
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      tenant: '3e64ebae-38b5-46a0-b1ed-9ccee153a0ae', //TODO <-- bug in API - this should be not required
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

const getTenants = async () => {
  const tenants = await fetchTenants();
  return tenants.map(tenant => {
    return {
      name: tenant.name,
      id: tenant.tenant,
    };
  });
};

const getTenantNames = tenants => {
  const tenantNames = tenants.map(tenant => {
    const alternativePath = getAlternativePath(tenant.name);
    return {
      label: tenant.name,
      pathValue: alternativePath || tenant.name,
    };
  });
  return tenantNames;
};

module.exports = {
  getTenants,
  getToken,
  getTenantNames,
};
