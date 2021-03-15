export function getApiRuleUrl(service, domain) {
  const host = `https://${service.host}`;
  return host.split(`.${domain}`)[0] + `.${domain}`;
}
