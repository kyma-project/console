import { useState, useEffect, useContext } from 'react';
import createContainer from 'constate';

import QueriesService from './Queries.service';
import FiltersService from './Filters.service';

import { randomNameGenerator } from '../helpers/random-names-generator';
import { Configuration } from '../types';
import {
  DEFAULT_CONFIGURATION,
  ERRORS,
  CONFIGURATION_NAME_PREFIX,
} from '../constants';
const NAME_ERRORS = ERRORS.NAME;

const useConfigurations = () => {
  const { addonsConfigurations } = useContext(QueriesService.Context);
  const { activeFilters } = useContext(FiltersService.Context);

  // Configs
  const [originalConfigs, setOriginalConfigs] = useState<Configuration[]>(
    () => addonsConfigurations,
  );
  const [configurationNames, setConfigurationNames] = useState<string[]>([]);

  const validateName = (name: string): string => {
    if (getConfigurationsName(originalConfigs).includes(name)) {
      return NAME_ERRORS.ALREADY_EXISTS;
    }

    const validateFormat = (name: string) => {
      const format =
        /^[a-z0-9-_.]+$/.test(name) &&
        /[a-z0-9]/.test(name[0]) &&
        /[a-z0-9]/.test(name[name.length - 1]);

      const checkLength = name.length > 63 || !name.length;

      return !format || checkLength;
    };

    if (!name) {
      return NAME_ERRORS.SHORT;
    }
    if (validateFormat(name)) {
      return NAME_ERRORS.REGEX;
    }
    if (name.length < 4) {
      return NAME_ERRORS.SHORT;
    }
    if (name.length > 63) {
      return NAME_ERRORS.SHORT;
    }

    return '';
  };

  const configNameGenerator = (): string => {
    let name: string = '';
    const condition = (name: string) =>
      originalConfigs.some(config => config.name === name);
    do {
      name = `${CONFIGURATION_NAME_PREFIX}-${randomNameGenerator()}`;
    } while (condition(name));

    return name;
  };

  const sortConfigByName = (configs: Configuration[]): Configuration[] => {
    return configs.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA === DEFAULT_CONFIGURATION) return -1;
      if (nameB === DEFAULT_CONFIGURATION) return 1;
      return nameA.localeCompare(nameB);
    });
  };

  const getConfigurationsName = (configs: Configuration[]): string[] => {
    return configs.map(config => config.name);
  };

  const configurationsExist = (): boolean => {
    const length = originalConfigs && originalConfigs.length;
    return Boolean(length);
  };

  const filterBySearch = (configs: Configuration[]): Configuration[] => {
    if (activeFilters.search) {
      return configs.filter(config =>
        config.name.includes(activeFilters.search),
      );
    }
    return configs;
  };

  useEffect(() => {
    if (!addonsConfigurations) return;

    setOriginalConfigs(sortConfigByName(addonsConfigurations));
    setConfigurationNames(getConfigurationsName(addonsConfigurations));
  }, [addonsConfigurations]);

  // Filtered Configs
  const [filteredConfigs, setFilteredConfigs] = useState(originalConfigs);
  useEffect(() => {
    if (!originalConfigs) return;

    if (
      !Object.keys(activeFilters.labels).length ||
      !Object.keys(activeFilters.labels).some(key =>
        Boolean(activeFilters.labels[key].length),
      )
    ) {
      setFilteredConfigs(filterBySearch(originalConfigs));
      return;
    }

    let newFilteredConfigs = originalConfigs.filter(config => {
      for (const labelKey in config.labels) {
        for (const activeFilterKey in activeFilters.labels) {
          if (
            activeFilters.labels[activeFilterKey].includes(
              config.labels[labelKey],
            )
          ) {
            return true;
          }
        }
      }
      return false;
    });

    const sortedConfigs = sortConfigByName(filterBySearch(newFilteredConfigs));
    setFilteredConfigs(sortedConfigs);
  }, [originalConfigs, activeFilters]);

  return {
    originalConfigs,
    setOriginalConfigs,
    validateName,
    configNameGenerator,
    configurationNames,
    filteredConfigs,
    configurationsExist,
  };
};

export default createContainer(useConfigurations);
