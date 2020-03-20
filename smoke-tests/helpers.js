import config from './config';

export const testIfBackendModuleExists = (
  testName,
  backendModuleName,
  testToRun,
) => {
  if (config.backendModules.includes(backendModuleName)) {
    test(testName, testToRun);
  } else {
    test.skip(testName, testToRun);
  }
};
