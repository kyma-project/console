export default async function fetchTenants(token) {
  const url = window.clusterConfig.compassApiUrl;
  const query = {
    query: `{
    tenants {
      name
      id
      initialized
    }
  }
  `,
  };

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(query),
  });
  const json = await response.json();
  return json.data.tenants;
}
