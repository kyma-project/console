import builder from './builder';

export const backendModuleExists = name => {
  return builder.getBackendModules().includes(name);
};
