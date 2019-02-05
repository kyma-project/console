import builder from './builder';

export const tokenize = str => {
  if (!str) return "";
  
  return str
    .trim()
    .replace(/ /g, '-')
    .toLowerCase();
};

export const backendModuleExists = (name) => {
  return builder.getBackendModules().includes(name);
}
