import sanitizeHtml from 'sanitize-html';
import { clusterConfig } from './../clusterConfig';
import { getAlternativePath } from './getAlternativePath';

export const getToken = () => {
  let token = null;
  if (sessionStorage.getItem('luigi.auth')) {
    try {
      token = JSON.parse(sessionStorage.getItem('luigi.auth')).idToken;
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
        initialized
      }
    }
    `,
  };
  try {
    const response = await fetchFromGraphql(payload);
    const tenants = response.data.tenants;
    cacheTenants(tenants);
    return tenants;
  } catch (err) {
    console.error('Tenants could not be loaded', err);
    return [];
  }
}

const cacheTenants = tenants =>
  sessionStorage.setItem('tenants', JSON.stringify(tenants));
export const getTenantsFromCache = () =>
  JSON.parse(sessionStorage.getItem('tenants')) || [];

const fetchFromGraphql = async data => {
  const url = clusterConfig.compassApiUrl;

  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (response.status === 401) {
    setCurrentLocation();
  }

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
  return tenantNames.sort((a, b) => a.label.localeCompare(b.label));
};

export const customOptionsRenderer = opt => {
  // we have to manually find selected tenant by id, as Luigi distinguishes
  // "options" by their labels (which may not be unique)
  const currentTenantId = opt.id.substring(0, opt.id.indexOf('/'));

  const isSelected =
    currentTenantId && !!window.location.pathname.match(currentTenantId);

  const label = sanitizeHtml(opt.label);

  return `<a href="javascript:void(0)" class="fd-menu__link ${
    isSelected ? 'is-selected' : ''
  } svelte-1ldh2pm" title="${label}">${label}</a>`;
};

export const setCurrentLocation = () => {
  // dex redirects to /#access_token=... we don't want to store this address
  if (!window.location.hash) {
    const location = window.location.href;
    localStorage.setItem('console.location', location);
  }
};

export const getPreviousLocation = () => {
  const prevLocation = localStorage.getItem('console.location');
  if (prevLocation) {
    localStorage.removeItem('console.location');
  }
  return prevLocation;
};
