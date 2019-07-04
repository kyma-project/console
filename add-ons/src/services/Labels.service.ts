import { useContext, useEffect, useState } from 'react';
import createContainer from 'constate';

import { ConfigurationsService } from './index';

import { Configuration, ConfigurationLabels, FilterLabels } from '../types';
import {
  ERRORS,
  LABEL_VARIABLE,
  KEY_VARIABLE,
  VALUE_VARIABLE,
} from '../constants';
const LABEL_ERRORS = ERRORS.LABEL;

const useLabels = () => {
  const { originalConfigs } = useContext(ConfigurationsService);

  const [uniqueLabels, setUniqueLabels] = useState<FilterLabels>({});

  const getFiltersLabels = (configs: Configuration[]): FilterLabels => {
    const labels: FilterLabels = {};
    configs.forEach(config => {
      if (config.labels) {
        Object.keys(config.labels).forEach(key => {
          if (config.labels) {
            const label = config.labels[key];
            if (!labels[key]) {
              labels[key] = [label];
            } else {
              labels[key].push(label);
            }
          }
        });
      }
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
      return LABEL_ERRORS.INVALID_LABEL.replace(LABEL_VARIABLE, label);
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
      return LABEL_ERRORS.KEY_OR_VALUE_INVALID.replace(
        KEY_VARIABLE,
        key,
      ).replace(VALUE_VARIABLE, value);
    }

    const duplicateKeyExists: boolean = Boolean(
      existingLabels
        .map(l => l.split('=')[0])
        .find((keyFromList: string) => keyFromList === key),
    );
    if (duplicateKeyExists) {
      return LABEL_ERRORS.DUPLICATE_KEYS_EXISTS.replace(
        KEY_VARIABLE,
        key,
      ).replace(VALUE_VARIABLE, value);
    }

    return '';
  };

  useEffect(() => {
    if (originalConfigs) {
      setUniqueLabels(
        sortLabels(getUniqueLabels(getFiltersLabels(originalConfigs))),
      );
    }
  }, [originalConfigs]);

  return {
    uniqueLabels,
    validateLabel,
  };
};

const { Provider, Context } = createContainer(useLabels);
export { Provider as LabelsProvider, Context as LabelsService };
