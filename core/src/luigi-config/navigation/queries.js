import { extractKymaVersion } from './util';

function createHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function mapMicrofrontends(microFrontendList) {
  return microFrontendList.items.map(({metadata, spec}) => ({
    name: metadata.name,
    category: spec.category,
    viewBaseUrl: spec.viewBaseUrl,
    navigationNodes: spec.navigationNodes,
  }));
}

export function fetchConsoleInitData(token) {
  const backendModules = {
    path: '/apis/ui.kyma-project.io/v1alpha1/backendmodules',
    selector: data => ({ backendModules: data.items.map(bM => bM.metadata) })
  };

  const clusterMicroFrontends = {
    path: '/apis/ui.kyma-project.io/v1alpha1/clustermicrofrontends',
    selector: data => ({ clusterMicroFrontends: data.items.map(cMF => ({ ...cMF.spec, ...cMF.metadata })) }),
  }

  const kymaVersion = {
    path: '/apis/apps/v1/namespaces/kyma-installer/deployments/kyma-installer',
    selector: data => ({ versionInfo: extractKymaVersion(data) }),
  }

  const ssrr = {
    typeMeta: {
      kind: "SelfSubjectRulesReview",
			aPIVersion: "authorization.k8s.io/v1",
    },
    spec: { namespace: '*' }
  }
  // we are doing SSRR query separately as it's requires a request body
  // vide components/console-backend-service/internal/domain/k8s/selfsubjectrules_resolver.go
  const ssrrQuery = fetch(`http://localhost:3001${'/apis/authorization.k8s.io/v1/selfsubjectrulesreviews'}`, {
    method: 'POST',
    body: JSON.stringify(ssrr),
    headers: createHeaders(token), 
  }).then(res => res.json()).then(res => ({selfSubjectRules: res.status.resourceRules}));

  const promises = [
    backendModules,
    clusterMicroFrontends,
    kymaVersion,
  ].map(({ path, selector }) => fetch(`http://localhost:3001${path}`, {
    headers: createHeaders(token),
  }).then(res => res.json()).then(selector));

  return Promise.all([...promises, ssrrQuery])
    .then(res => Object.assign(...res));
}

export function fetchMicrofrontends(namespaceName, token) {
  return fetch(`http://localhost:3001/apis/ui.kyma-project.io/v1alpha1/namespaces/${namespaceName}/microfrontends`, {
    headers: createHeaders(token),
  }).then(res => res.json()).then(mapMicrofrontends);
}

export function fetchNamespaces(token) {
  return fetch('http://localhost:3001/api/v1/namespaces/', {
    headers: createHeaders(token),
  }).then(res => res.json()).then(list => list.items.map(ns => ns.metadata));
}
