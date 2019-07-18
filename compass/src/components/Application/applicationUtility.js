import _ from 'lodash';

export function printPrettyConnectionStatus(status) {
  return _.startCase(_.toLower(status));
}

export function determineClass(status) {
  switch (status) {
    case 'NOT_SERVING':
      return 'fd-status-label--busy';
    case 'SERVING':
      return 'fd-status-label--available';
    case 'GATEWAY_NOT_CONFIGURED':
      return '';
    default:
      return '';
  }
}
