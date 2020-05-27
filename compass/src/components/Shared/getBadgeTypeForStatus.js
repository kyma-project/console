export const getBadgeTypeForStatus = status => {
  if (!status) return undefined;

  switch (status.condition) {
    case 'INITIAL':
      return 'info';
    case 'CONNECTED':
      return 'success';
    case 'FAILED':
      return 'error';
    default:
      return undefined;
  }
};
