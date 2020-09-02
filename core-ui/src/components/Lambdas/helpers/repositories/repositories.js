import { REPOSITORY_AUTH } from '../../constants';

export const publicAuth = '';
export const basicAuth = 'basic';
export const keyAuth = 'key';

export const repositoryAuthType = {
  [publicAuth]: REPOSITORY_AUTH.PUBLIC,
  [basicAuth]: REPOSITORY_AUTH.BASIC,
  [keyAuth]: REPOSITORY_AUTH.KEY,
};

export function isGitUrl(str) {
  var regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|#[-\d\w._]+?)$/;
  return regex.test(str);
}
