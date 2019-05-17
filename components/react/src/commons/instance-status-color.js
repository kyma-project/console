export const instanceStatusColor = statusType => {
  switch (statusType) {
    case 'PROVISIONING':
    case 'DEPROVISIONING':
    case 'PENDING':
      return '#ffb600';
    case 'FAILED':
      return '#ee0000';
    case 'RUNNING':
    case 'READY':
      return '#3db350';
    default:
      return '#ffb600';
  }
};
