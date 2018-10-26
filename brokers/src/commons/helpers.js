export const statusColor = statusType => {
  switch (statusType) {
    case 'FAILED':
      return '#ee0000';
    case 'RUNNING':
      return '#3db350';
    default:
      return '#ffb600';
  }
};
