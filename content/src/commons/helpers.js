import builder from './builder';

export const tokenize = str => {
  if (!str) return '';

  return str
    .trim()
    .replace(/ /g, '-')
    .toLowerCase();
};

export const backendModuleExists = name => {
  return builder.getBackendModules().includes(name);
};

export function compareTwoObjects(obj1, obj2) {
  for (const p in obj1) {
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    if (obj1[p] === null && obj2[p] !== null) return false;
    if (obj2[p] === null && obj1[p] !== null) return false;

    switch (typeof obj1[p]) {
      case 'object':
        if (!compareTwoObjects(obj1[p], obj2[p])) return false;
        break;
      case 'function':
        if (
          typeof obj2[p] === 'undefined' ||
          (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())
        )
          return false;
        break;
      default:
        if (obj1[p] === '' && obj2[p] !== '') return false;
        if (obj2[p] === '' && obj1[p] !== '') return false;
        if (obj1[p] !== obj2[p]) return false;
    }
  }

  for (const p in obj2) {
    if (typeof obj1[p] === 'undefined') return false;
  }
  return true;
}
