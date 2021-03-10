export const getBadgeTypeForStatus = status => {
  switch (status) {
    case 'READY':
    case 'RUNNING':
      return 'success';
    case 'PROVISIONING':
    case 'DEPROVISIONING':
    case 'PENDING':
      return 'info';
    case 'FAILED':
      return 'error';
    default:
      return undefined;
  }
};
