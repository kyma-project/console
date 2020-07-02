import { getApiUrl } from '@kyma-project/common';

export function getApiRuleUrl(service) {
  const host = `https://${service.host}`;
  const domain = getApiUrl('domain');
  return host.split(`.${domain}`)[0] + `.${domain}`;
}
