import builder from './builder';

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

export const backendModuleExists = name => {
  return builder.getBackendModules().includes(name);
};
