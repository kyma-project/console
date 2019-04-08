import { useContext, useEffect, useState } from 'react';
import createContainer from 'constate';

import ConfigurationsService from './Configurations.service';

import { Configuration, ConfigurationLabels, FilterLabels } from '../types';

const useLabels = () => {
  const { originalConfigs } = useContext(ConfigurationsService.Context);

  const [uniqueLabels, setUniqueLabels] = useState<FilterLabels>({});

  const getFiltersLabels = (configs: Configuration[]): FilterLabels => {
    let labels: FilterLabels = {};
    configs.forEach(config => {
      Object.keys(config.labels).forEach(key => {
        const label = config.labels[key];
        if (!labels[key]) {
          labels[key] = [label];
        } else {
          labels[key].push(label);
        }
      });
    });

    return labels;
  };

  const getUniqueLabels = (labels: FilterLabels): FilterLabels => {
    Object.keys(labels).forEach(key => {
      labels[key] = labels[key].filter((v, i, a) => a.indexOf(v) === i);
    });

    return labels;
  };

  const sortLabels = (labels: FilterLabels): FilterLabels => {
    Object.keys(labels).map(key => {
      labels[key] = labels[key].sort((a, b) => a.localeCompare(b));
    });
    return labels;
  };

  const validateLabel = (label: string, existingLabels: string[]): string => {
    if (!label) {
      return '';
    }

    if (!(label.split('=').length === 2)) {
      return `Invalid label ${label}! A key and value should be separated by a '='`;
    }

    const key: string = label.split('=')[0];
    const value: string = label.split('=')[1];

    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const foundKey = key.match(regex);
    const isKeyValid = Boolean(foundKey && foundKey[0] === key && key !== '');
    const foundVal = value.match(regex);
    const isValueValid = Boolean(
      (foundVal && foundVal[0] === value) || value !== '',
    );
    if (!isKeyValid || !isValueValid) {
      return `Invalid label ${key}=${value}! In a valid label, a key and value cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.`;
    }

    const duplicateKeyExists: boolean = Boolean(
      existingLabels
        .map(l => l.split('=')[0])
        .find((keyFromList: string) => keyFromList === key),
    );
    if (duplicateKeyExists) {
      return `Invalid label ${key}=${value}! Keys cannot be reused!`;
    }

    return '';
  };

  useEffect(() => {
    originalConfigs &&
      setUniqueLabels(
        sortLabels(getUniqueLabels(getFiltersLabels(originalConfigs))),
      );
  }, [originalConfigs]);

  return {
    uniqueLabels,
    validateLabel,
  };
};

export default createContainer(useLabels);
