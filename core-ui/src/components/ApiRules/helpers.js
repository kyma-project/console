export function getApiRuleUrl(service, k8sApiUrl) {
  const host = `https://${service.host}`;
  const domain = k8sApiUrl.replace('api.', '');
  return host.split(`.${domain}`)[0] + `.${domain}`;
}
