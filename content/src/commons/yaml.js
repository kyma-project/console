import manifest from './manifest.yaml';
const YAML = require('yamljs');

export const parseYaml = () => {
  const manifestFile = YAML.load(manifest);
  const manifestString = YAML.stringify(manifestFile, 4);
  return YAML.parse(manifestString).spec;
};

export const prepareTopicsList = () => {
  const yaml = parseYaml();
  let topics = [];

  if (!yaml) return;

  Object.entries(yaml).forEach(([type, entriesByType]) => {
    let topicsT;
    if (Array.isArray(entriesByType)) {
      topicsT = entriesByType.map(entryByType => {
        return {
          id: entryByType.id,
          type: type,
        };
      });
    } else {
      topicsT = {
        id: entriesByType.id,
        type: type,
      };
    }

    Array.isArray(topicsT) ? topics.push(...topicsT) : topics.push(topicsT);
  });

  return topics;
};
