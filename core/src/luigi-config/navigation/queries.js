import { config } from './../config';
import { getInitParams } from './../init-params';

function createHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Api-Url': getInitParams().k8sApiUrl,
  };
}

function mapMicrofrontends(microFrontendList, config) {
  return microFrontendList.items.map(({ metadata, spec }) => ({
    name: metadata.name,
    category: spec.category,
    viewBaseUrl:
      spec.viewBaseUrl || `https://${metadata.name}.${config.domain}`,
    navigationNodes: spec.navigationNodes,
  }));
}

export function fetchConsoleInitData(token) {
  const backendModulesQuery = fetch(
    `${config.pamelaApiUrl}/apis/ui.kyma-project.io/v1alpha1/backendmodules`,
    {
      headers: createHeaders(token),
    }
  )
    .then((res) => res.json())
    .then((data) => ({ backendModules: data.items.map((bM) => bM.metadata) }))
    .catch(() => ({ backendModules: [] }));

  const cmfQuery = fetch(
    `${config.pamelaApiUrl}/apis/ui.kyma-project.io/v1alpha1/clustermicrofrontends`,
    {
      headers: createHeaders(token),
    }
  )
    .then((res) => res.json())
    .then((data) => ({
      clusterMicroFrontends: data.items.map((cMF) => ({
        ...cMF.spec,
        ...cMF.metadata,
      })),
    }))
    .catch(() => ({ clusterMicroFrontends: [] }));

  const ssrr = {
    typeMeta: {
      kind: 'SelfSubjectRulesReview',
      aPIVersion: 'authorization.k8s.io/v1',
    },
    spec: { namespace: '*' },
  };

  const ssrrQuery = fetch(
    `${config.pamelaApiUrl}/apis/authorization.k8s.io/v1/selfsubjectrulesreviews`,
    {
      method: 'POST',
      body: JSON.stringify(ssrr),
      headers: createHeaders(token),
    }
  )
    .then((res) => res.json())
    .then((res) => ({ selfSubjectRules: res.status.resourceRules }));

  const promises = [backendModulesQuery, cmfQuery, ssrrQuery];

  return Promise.all(promises).then((res) => Object.assign(...res));
}

export function fetchMicrofrontends(namespaceName, token) {
  return fetch(
    `${config.pamelaApiUrl}/apis/ui.kyma-project.io/v1alpha1/namespaces/${namespaceName}/microfrontends`,
    {
      headers: createHeaders(token),
    }
  )
    .then((res) => res.json())
    .then((res) => mapMicrofrontends(res, config))
    .catch(() => []); // microfrontends may not exist on target cluster
}

export function fetchNamespaces(token) {
  return fetch(`${config.pamelaApiUrl}/api/v1/namespaces/`, {
    headers: createHeaders(token),
  })
    .then((res) => res.json())
    .then((list) => list.items.map((ns) => ns.metadata));
}
