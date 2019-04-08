import { useState, useContext } from 'react';
import createContainer from 'constate';

import ConfigurationsService from './Configurations.service';

import { HELM_BROKER_IS_DEVELOPMENT_MODE, ERRORS } from '../constants';
const URL_ERRORS = ERRORS.URL;

const useUrls = () => {
  const { originalConfigs } = useContext(ConfigurationsService.Context);
  let timer: number = 0;

  const getUrlsFromConfigByName = (configName: string): string[] => {
    const config = originalConfigs.find(config => config.name === configName);
    return config ? config.urls : [];
  };

  const validateUrl = (url: string, existingUrls: string[]): string => {
    if (existingUrls.includes(url)) {
      return URL_ERRORS.ALREADY_EXISTS;
    }
    if (HELM_BROKER_IS_DEVELOPMENT_MODE) {
      if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        return URL_ERRORS.STARTS_WITH_HTTP;
      }
    } else {
      if (!url.startsWith('https://')) {
        return URL_ERRORS.STARTS_WITH_HTTP;
      }
    }
    return '';
  };

  return {
    getUrlsFromConfigByName,
    validateUrl,
  };
};

export default createContainer(useUrls);
